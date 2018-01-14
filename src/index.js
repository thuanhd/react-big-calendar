import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import withDragAndDrop from './addons/dragAndDrop'
import CalendarEvent from './addons/resizerDraggableBox/resizeCalendar'
import PropTypes from 'prop-types'
import moment from 'moment'
import dates from './utils/dates'
import move from './utils/move'
import Calendar from './Calendar'
import EventWrapper from './EventWrapper'
import BackgroundWrapper from './BackgroundWrapper'
import {set as setLocalizer} from './localizer'
import momentLocalizer from './localizers/moment'
import globalizeLocalizer from './localizers/globalize'

import {views, navigate} from './utils/constants'

Object.assign(Calendar, {
  setLocalizer,
  globalizeLocalizer,
  momentLocalizer,
  Views: views,
  Navigate: navigate,
  move,
  components: {
    eventWrapper: EventWrapper,
    dayWrapper: BackgroundWrapper,
    dateCellWrapper: BackgroundWrapper,
  },
})

export default Calendar

import globalize from 'globalize'

globalizeLocalizer(globalize);

const DragAndDropCalendar = withDragAndDrop(Calendar)

class DndCalendar extends React.Component {
  static propsTypes = {
    timeSlot: PropTypes.number,
    practitioners: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      workingHours: PropTypes.shape({from: PropTypes.number, to: PropTypes.number})
    })),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        practitionerKey: PropTypes.string,
        data: PropTypes.any,
        start: PropTypes.instanceOf(Date),
        end: PropTypes.instanceOf(Date),
        unavailable: PropTypes.bool,
      })
    ),
    date: PropTypes.instanceOf(Date),
    scale: PropTypes.number,
    dayHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    dayOffs: PropTypes.arrayOf(PropTypes.number),
    onItemChanged: PropTypes.func,
    onItemClicked: PropTypes.func,
    onNewItemClicked: PropTypes.func,
    showFormatter: PropTypes.func
  }

  static defaultProps = {
    timeSlot: 4,
    practitioners: [null],
    data: [],
    date: new Date(),
    scale: 7,
    visibleDates: dates.getDatesWeek(),
    dayHourRange: {
      from: 7,
      to: 22,
    },
    dayOffs: [5, 6],
  }

  moveEvent({event, start, end, practitioner}) {
    const updatedEvent = {...event, start, end}
    if (practitioner)
      updatedEvent.practitionerKey = practitioner && practitioner.key;
    this.props.onItemChanged && this.props.onItemChanged(updatedEvent)
  }

  selectEvent(event) {
    this.props.onItemClicked && this.props.onItemClicked(event)
  }

  selectCell(slotInfo) {
    let event = {
      start: slotInfo.start,
      end: slotInfo.end,
      practitioner: slotInfo.practitioner,
    }
    this.props.onNewItemClicked && this.props.onNewItemClicked(event)
  }

  onEventResize(itemType, {event, value, start, end, isPassAbove}) {
    if (itemType === 'event-resize') {
      let ele = $('#' + event.key);
      let hid = ele.find('.step-height').val();
      const duration2 = dates.diff(start, end);
      let newHeight = duration2 * hid;
      ele.css('height', newHeight + '%');
      if (isPassAbove) {
        let top = ele.find('.step-top').val();
        let newTop = top - newHeight;
        ele.css('top', newTop + '%');
      }
    }
  }

  render() {

    let {timeSlot} = this.props;
    timeSlot = timeSlot <= 60 ? (timeSlot < 1 ? 1 : timeSlot) : 1;
    let step = 60 / timeSlot;
    let from, to;
    let d = new Date();
    d.setHours(this.props.dayHourRange.from, 0, 0);
    from = d;
    d = new Date();
    d.setHours(this.props.dayHourRange.to + 1, 0, 0);
    to = d;
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
      eventTimeRangeFormat: ({start, end}, culture, localizer) => {
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
      selectRangeFormat: ({start, end}, culture, localizer) => {
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
    let visibleDates = this.calculateVisibleDate();

    let workingHourRange = Object.assign({}, this.props.dayHourRange);

    let dayOffs = this.props.dayOffs;
    dayOffs = dayOffs && dayOffs.map(d => {
      if(d + 1 === 7) return 0;
      return d + 1;
    });

    return (
      <DragAndDropCalendar
        components={{event: CalendarEvent}}
        events={this.props.data || []}
        onEventDrop={({event, start, end, practitioner}) =>
          this.moveEvent({event, start, end, practitioner})
        }
        onEventResize={(itemType, {event, value, start, end, isPassAbove}) => this.onEventResize(itemType, {
          event,
          value,
          start,
          end,
          isPassAbove
        })}
        onSelectEvent={event => this.selectEvent(event)}
        onSelectSlot={slotInfo => this.selectCell(slotInfo)}
        step={step}
        timeslots={timeSlot}
        views={['custom']}
        defaultView={'custom'}
        visibleDates={visibleDates}
        practitioners={this.props.practitioners}
        workingHourRange={workingHourRange}
        dayOffs={dayOffs}
        defaultDate={this.props.date}
        toolbar={false}
        min={from}
        max={to}
        formats={formats}
        messages={{allDay: ''}}
        showFormatter={this.props.showFormatter}
        titleAccessor={(event) => this.handleEventTitle(event)}
      />
    )
  }

  calculateVisibleDate() {
    let visibleDates = [];
    let {date, scale} = this.props;

    scale = scale < 1 ? 1 : (scale > 31 ? 31 : scale);

    switch (scale) {
      case 7:
        let monday = moment(date).isoWeekday(1);
        visibleDates = [monday.toDate()];
        for (let i = 1; i < 7; i++) {
          visibleDates.push(monday.add(1, 'days').toDate());
        }
        break;
      default:
        let start = (Math.floor(scale / 2) - (scale % 2 === 0 ? 1 : 0)) * -1;
        let end = Math.floor(scale / 2) ;
        for (let i = start; i <= end; i++) {
          visibleDates.push(moment(date).add(i, 'days').toDate());
        }

    }
    return visibleDates;
  }

  handleEventTitle(event) {
    return event.data;
  }
}

export const HTCalendar = DragDropContext(HTML5Backend)(DndCalendar);