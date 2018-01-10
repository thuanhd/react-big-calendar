import React from 'react'
import events from '../events'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import PropTypes from 'prop-types'
import moment from 'moment'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'

require('globalize/lib/cultures/globalize.culture.vi-VN')

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Dnd extends React.Component {
  static propsTypes = {
    dataSet: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
        start: PropTypes.instanceOf(Date),
        end: PropTypes.instanceOf(Date),
        group: PropTypes.string,
      })
    ),
    date: PropTypes.instanceOf(Date),
    visibleDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    workingHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    dayHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    dayOffs: PropTypes.arrayOf(PropTypes.number),
    groups: PropTypes.arrayOf(PropTypes.string),
    onItemChanged: PropTypes.func,
    onItemClicked: PropTypes.func,
    onCellClicked: PropTypes.func,
  }

  static defaultProps = {
    dataSet: null,
    date: new Date(),
    visibleDates: [moment().toDate()],
    workingHourRange: {
      from: 9,
      to: 17,
    },
    dayHourRange: {
      from: 7,
      to: 22,
    },
    dayOffs: [6, 7],
    groups: [null],
  }

  min
  max

  constructor(props) {
    super(props)
  }

  moveEvent({ event, start, end, group }) {
    const updatedEvent = { ...event, start, end, group }
    this.props.onItemChanged && this.props.onItemChanged(updatedEvent)
  }

  selectEvent(event) {
    this.props.onItemClicked && this.props.onItemClicked(event)
  }

  selectCell(slotInfo) {
    let event = {
      start: slotInfo.start,
      end: slotInfo.end,
    }
    this.props.onCellClicked && this.props.onCellClicked(event)
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }

  render() {
    let from, to
    let d = new Date()
    d.setHours(this.props.dayHourRange.from, 0, 0)
    from = d
    d = new Date()
    d.setHours(this.props.dayHourRange.to + 1, 0, 0)
    to = d

    let formats = {
      timeGutterFormat: (date, culture, localizer) => {
        return date.toLocaleTimeString(localizer, {
          hour: 'numeric',
          hour12: true,
        })
      },
      dayFormat: (date, culture, localizer) => {
        return moment(date).format('ddd, Do MMM')
      },
      eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
        return (
          start.toLocaleTimeString(localizer, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          }) +
          ' - ' +
          end.toLocaleTimeString(localizer, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          })
        )
      },
      selectRangeFormat: ({ start, end }, culture, localizer) => {
        return (
          start.toLocaleTimeString(localizer, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          }) +
          ' - ' +
          end.toLocaleTimeString(localizer, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          })
        )
      },
    }
    return (
      <DragAndDropCalendar
        selectable
        events={this.props.dataSet || []}
        onEventDrop={({ event, start, end, group }) =>
          this.moveEvent({ event, start, end, group })}
        onEventResize={this.resizeEvent}
        onSelectEvent={event => this.selectEvent(event)}
        onSelectSlot={slotInfo => this.selectCell(slotInfo)}
        step={15}
        timeslots={4}
        views={['custom']}
        defaultView="custom"
        scrollToTime={new Date()}
        visibleDates={this.props.visibleDates}
        groups={this.props.groups}
        workingHourRange={this.props.workingHourRange}
        culture={'vi-VN'}
        defaultDate={this.props.date}
        toolbar={false}
        min={from}
        max={to}
        formats={formats}
        messages={{ allDay: '' }}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(Dnd)

function nth(d) {
  if (d > 3 && d < 21) return 'th' // thanks kennebec
  switch (d % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
