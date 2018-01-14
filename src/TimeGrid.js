import PropTypes from 'prop-types'
import React, {Component} from 'react'
import cn from 'classnames'
import {findDOMNode} from 'react-dom'

import dates from './utils/dates'
import localizer from './localizer'
import DayColumn from './DayColumn'
import TimeColumn from './TimeColumn'
import DateContentRow from './DateContentRow'
import Header from './Header'

import getWidth from 'dom-helpers/query/width'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import message from './utils/messages'

import {accessor, dateFormat} from './utils/propTypes'

import {notify} from './utils/helpers'

import {accessor as get} from './utils/accessors'

import {inRange, sortEvents, segStyle} from './utils/eventLevels'

export default class TimeGrid extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    resources: PropTypes.array,

    step: PropTypes.number,
    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    dayOffs: PropTypes.arrayOf(PropTypes.number),
    workingHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    practitioners: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      workingHours: PropTypes.shape({from: PropTypes.number, to: PropTypes.number})
    })),
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    now: PropTypes.instanceOf(Date),

    scrollToTime: PropTypes.instanceOf(Date),
    eventPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayFormat: dateFormat,
    showMultiDayTimes: PropTypes.bool,
    culture: PropTypes.string,

    rtl: PropTypes.bool,
    width: PropTypes.number,

    titleAccessor: accessor.isRequired,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,
    resourceAccessor: accessor.isRequired,

    resourceIdAccessor: accessor.isRequired,
    resourceTitleAccessor: accessor.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    longPressThreshold: PropTypes.number,

    onNavigate: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,

    messages: PropTypes.object,
    components: PropTypes.object.isRequired,
    showFormatter: PropTypes.func
  }

  static defaultProps = {
    step: 30,
    min: dates.startOf(new Date(), 'day'),
    max: dates.endOf(new Date(), 'day'),
    scrollToTime: dates.startOf(new Date(), 'day'),
    /* these 2 are needed to satisfy requirements from TimeColumn required props
     * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
     */
    type: 'gutter',
    now: new Date(),
    practitioners: [null],
  }

  constructor(props) {
    super(props)
    this.state = {gutterWidth: undefined, isOverflowing: null}
    this.handleSelectEvent = this.handleSelectEvent.bind(this)
    this.handleDoubleClickEvent = this.handleDoubleClickEvent.bind(this)
    this.handleHeaderClick = this.handleHeaderClick.bind(this)
  }

  componentWillMount() {
    this._gutters = []
    this.calculateScroll()
  }

  componentDidMount() {
    this.checkOverflow()

    if (this.props.width == null) {
      this.measureGutter()
    }
    this.applyScroll()

    this.positionTimeIndicator()
    this.triggerTimeIndicatorUpdate()
  }

  componentWillUnmount() {
    window.clearTimeout(this._timeIndicatorTimeout)
  }

  componentDidUpdate() {
    if (this.props.width == null && !this.state.gutterWidth) {
      this.measureGutter()
    }

    this.applyScroll()
    this.positionTimeIndicator()
    //this.checkOverflow()
  }

  componentWillReceiveProps(nextProps) {
    const {range, scrollToTime} = this.props
    // When paginating, reset scroll
    if (
      !dates.eq(nextProps.range[0], range[0], 'minute') ||
      !dates.eq(nextProps.scrollToTime, scrollToTime, 'minute')
    ) {
      this.calculateScroll()
    }
  }

  handleSelectAllDaySlot = (slots, slotInfo) => {
    const {onSelectSlot} = this.props
    notify(onSelectSlot, {
      slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
    })
  }

  render() {
    let {
      events,
      range,
      dayOffs,
      width,
      startAccessor,
      endAccessor,
      resources,
      allDayAccessor,
      showMultiDayTimes,
    } = this.props

    width = width || this.state.gutterWidth

    let start = range[0],
      end = range[range.length - 1]

    this.slots = range.length

    let allDayEvents = [],
      rangeEvents = []

    events.forEach(event => {
      if (inRange(event, start, end, this.props)) {
        let eStart = get(event, startAccessor),
          eEnd = get(event, endAccessor)

        if (
          get(event, allDayAccessor) ||
          (dates.isJustDate(eStart) && dates.isJustDate(eEnd)) ||
          (!showMultiDayTimes && !dates.eq(eStart, eEnd, 'day'))
        ) {
          allDayEvents.push(event)
        } else {
          rangeEvents.push(event)
        }
      }
    })

    allDayEvents.sort((a, b) => sortEvents(a, b, this.props))

    let gutterRef = ref => (this._gutters[1] = ref && findDOMNode(ref))

    let eventsRendered = this.renderEvents(
      range,
      rangeEvents,
      this.props.now,
      resources || [null],
      dayOffs
    )
    allDayEvents = []
    return (
      <div className="rbc-time-view">
        {this.renderHeader(
          range,
          allDayEvents,
          width,
          resources,
          dayOffs
        )}
        <div ref="content" className="rbc-time-content">
          <div ref="timeIndicator" className="rbc-current-time-indicator"/>
          <TimeColumn
            {...this.props}
            showLabels
            style={{width}}
            ref={gutterRef}
            className="rbc-time-gutter"
          />
          {eventsRendered}
        </div>
      </div>
    )
  }

  renderEvents(range, events, today, resources, dayOffs) {
    let {
      min,
      max,
      endAccessor,
      startAccessor,
      resourceAccessor,
      resourceIdAccessor,
      components,
      practitioners,
      workingHourRange,
    } = this.props
    let rangeGroups = []
    for (let i = 0; i < range.length; i++) {
      for (let j = 0; j < practitioners.length; j++) {
        rangeGroups.push({date: range[i], practitioner: practitioners[j]})
      }
    }
    let currentDate;
    return rangeGroups.map(({date, practitioner}, idx) => {
      let split = idx > 0 && currentDate === date;
      currentDate = date;
      let daysEvents = events.filter(
        event =>
          dates.inRange(
            date,
            get(event, startAccessor),
            get(event, endAccessor),
            'day'
          ) && practitioner && practitioner.key === event.practitionerKey
      )
      return resources.map((resource, id) => {
        let eventsToDisplay = !resource
          ? daysEvents
          : daysEvents.filter(
            event =>
              get(event, resourceAccessor) ===
              get(resource, resourceIdAccessor)
          )
        let weekDay = dates.getDateWeek(date)
        return (
          <DayColumn
            {...this.props}
            workingHourRange={workingHourRange}
            min={dates.merge(date, min)}
            max={dates.merge(date, max)}
            resource={resource && resource.id}
            eventComponent={components.event}
            eventWrapperComponent={components.eventWrapper}
            dayWrapperComponent={components.dayWrapper}
            className={cn({'split': split})}
            style={segStyle(1, this.slots)}
            key={idx + '-' + id}
            isOff={dayOffs.includes(weekDay)}
            date={date}
            practitioner={practitioner}
            events={eventsToDisplay}
            onSelectSlot={(slotInfo) => this.handleSelect(slotInfo)}
            showFormatter={this.props.showFormatter}
          />
        )
      })
    })
  }

  renderHeader(range, events, width, resources, dayOffs) {
    let {messages, rtl, selectable, components, now} = this.props
    let {isOverflowing} = this.state || {}

    let style = {}
    if (isOverflowing)
      style[rtl ? 'marginLeft' : 'marginRight'] = scrollbarSize() - 1 + 'px'

    let headerRendered = resources
      ? this.renderHeaderResources(range, resources)
      : message(messages).allDay

    return (
      <div
        ref="headerCell"
        className={cn('rbc-time-header', isOverflowing && 'rbc-overflowing')}
        style={style}
      >
        <div className="rbc-row">
          <div className="rbc-label rbc-header-gutter" style={{width}}/>
          {this.renderHeaderCells(range)}
        </div>
        {resources && (
          <div className="rbc-row rbc-row-resource">
            <div className="rbc-label rbc-header-gutter" style={{width}}/>
            {headerRendered}
          </div>
        )}
        <div className="rbc-row">
          <div
            ref={ref => (this._gutters[0] = ref)}
            className="rbc-label rbc-header-gutter"
            style={{width}}
          >
            {''}
          </div>
          {this.renderHeaderGroups(range)}
        </div>
      </div>
    )
  }

  renderHeaderGroups(range) {
    let {dayPropGetter, practitioners} = this.props

    let newRange = []
    for (let i = 0; i < range.length; i++) {
      for (let j = 0; j < practitioners.length; j++) {
        newRange.push({date: range[i], practitioner: practitioners[j]})
      }
    }
    let currentDate;
    return newRange.map(({date, practitioner}, index) => {
      let split = index > 0 && currentDate === date;
      currentDate = date;

      const {className, style: dayStyles} =
      (dayPropGetter && dayPropGetter(date)) || {}

      let dateWeek = dates.getDateWeek(date)
      return (
        <div
          key={index}
          className={cn(
            'rbc-header',
            'rbc-groupName',
            split && 'split',
            className,
            dates.isToday(date) && 'rbc-today',
            this.props.dayOffs.includes(dateWeek) && 'rbc-off'
          )}
          style={Object.assign({}, dayStyles, segStyle(1, this.slots))}
        >
          <span>{practitioner ? practitioner.value : ''}</span>
        </div>
      )
    })
  }

  renderHeaderResources(range, resources) {
    const {resourceTitleAccessor} = this.props
    return range.map((date, i) => {
      return resources.map((resource, j) => {
        return (
          <div
            key={i + '-' + j}
            className={cn(
              'rbc-header',
              dates.isToday(date) && 'rbc-today',
              this.props.dayOffs.includes(date.getDay()) && 'rbc-off'
            )}
            style={segStyle(1, this.slots)}
          >
            <span>{get(resource, resourceTitleAccessor)}</span>
          </div>
        )
      })
    })
  }

  renderHeaderCells(range) {
    let {
      dayFormat,
      culture,
      components,
      dayPropGetter,
      getDrilldownView,
    } = this.props
    let HeaderComponent = components.header || Header

    return range.map((date, i) => {
      let drilldownView = getDrilldownView(date)
      let label = localizer.format(date, dayFormat, culture)

      const {className, style: dayStyles} =
      (dayPropGetter && dayPropGetter(date)) || {}

      let header = (
        <HeaderComponent
          date={date}
          label={label}
          localizer={localizer}
          format={dayFormat}
          culture={culture}
        />
      )
      let dateWeek = dates.getDateWeek(date)
      return (
        <div
          key={i}
          className={cn(
            'rbc-header',
            className,
            dates.isToday(date) && 'rbc-today',
            this.props.dayOffs.includes(dateWeek) && 'rbc-off'
          )}
          style={Object.assign({}, dayStyles, segStyle(1, this.slots))}
        >
          {drilldownView ? (
            <a
              href="#"
              onClick={e => this.handleHeaderClick(date, drilldownView, e)}
            >
              {header}
            </a>
          ) : (
            <span>{header}</span>
          )}
        </div>
      )
    })
  }

  handleSelect(slotInfo) {
    notify(this.props.onSelectSlot, slotInfo);
  }

  handleHeaderClick(date, view, e) {
    e.preventDefault()
    notify(this.props.onDrillDown, [date, view])
  }

  handleSelectEvent(...args) {
    notify(this.props.onSelectEvent, args)
  }

  handleDoubleClickEvent(...args) {
    notify(this.props.onDoubleClickEvent, args)
  }

  handleSelectAlldayEvent(...args) {
    //cancel any pending selections so only the event click goes through.
    this.clearSelection()
    notify(this.props.onSelectEvent, args)
  }

  clearSelection() {
    clearTimeout(this._selectTimer)
    this._pendingSelection = []
  }

  measureGutter() {
    let width = this.state.gutterWidth
    let gutterCells = this._gutters

    if (!width) {
      width = Math.max(...gutterCells.map(getWidth))

      if (width) {
        width += 10
        this.setState({gutterWidth: width})
      }
    }
  }

  applyScroll() {
    if (this._scrollRatio) {
      const {content} = this.refs
      content.scrollTop = content.scrollHeight * this._scrollRatio
      // Only do this once
      this._scrollRatio = null
    }
  }

  calculateScroll() {
    const {min, max, scrollToTime} = this.props

    const diffMillis = scrollToTime - dates.startOf(scrollToTime, 'day')
    const totalMillis = dates.diff(max, min)

    this._scrollRatio = diffMillis / totalMillis
  }

  checkOverflow() {
    if (this._updatingOverflow) return

    let isOverflowing =
      this.refs.content.scrollHeight > this.refs.content.clientHeight

    if (this.state.isOverflowing !== isOverflowing) {
      this._updatingOverflow = true
      this.setState({isOverflowing}, () => {
        this._updatingOverflow = false
      })
    }
  }

  positionTimeIndicator() {
    const {rtl, min, max} = this.props
    const now = new Date()

    const secondsGrid = dates.diff(max, min, 'seconds')
    const secondsPassed = dates.diff(now, min, 'seconds')

    const timeIndicator = this.refs.timeIndicator
    const factor = secondsPassed / secondsGrid
    const timeGutter = this._gutters[this._gutters.length - 1]

    if (timeGutter && now >= min && now <= max) {
      const pixelHeight = timeGutter.offsetHeight
      const offset = Math.floor(factor * pixelHeight)

      timeIndicator.style.display = 'block'
      timeIndicator.style[rtl ? 'left' : 'right'] = 0
      timeIndicator.style[rtl ? 'right' : 'left'] =
        timeGutter.offsetWidth + 'px'
      timeIndicator.style.top = offset + 'px'
    } else {
      timeIndicator.style.display = 'none'
    }
  }

  triggerTimeIndicatorUpdate() {
    // Update the position of the time indicator every minute
    this._timeIndicatorTimeout = window.setTimeout(() => {
      this.positionTimeIndicator()

      this.triggerTimeIndicatorUpdate()
    }, 60000)
  }
}
