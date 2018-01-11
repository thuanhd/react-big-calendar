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
import { set as setLocalizer } from './localizer'
import momentLocalizer from './localizers/moment'
import globalizeLocalizer from './localizers/globalize'
import './less/styles.less'
import './addons/dragAndDrop/styles.less'

import { views, navigate } from './utils/constants'

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
    dataSet: [],
    date: new Date(),
    visibleDates: dates.getDatesWeek(),
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

  moveEvent({event, start, end, group}) {
    const updatedEvent = {...event, start, end}
    if (group)
      updatedEvent.group = group;

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

  onEventResize(itemType, {event, value, start, end, isPassAbove}) {
    if (itemType === 'event-resize') {
      let ele = $('#' + event.id);
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

    return (
      <DragAndDropCalendar
        selectable
        components={{event: CalendarEvent}}
        events={this.props.dataSet || []}
        onEventDrop={({event, start, end, group}) =>
          this.moveEvent({event, start, end, group})
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
        step={15}
        timeslots={4}
        views={['custom']}
        defaultView={'custom'}
        visibleDates={this.props.visibleDates}
        groups={this.props.groups}
        workingHourRange={this.props.workingHourRange}
        // culture={'vi-VN'}
        defaultDate={this.props.date}
        toolbar={false}
        min={from}
        max={to}
        formats={formats}
        messages={{allDay: ''}}
      />
    )
  }
}

export const HTCalendar = DragDropContext(HTML5Backend)(DndCalendar);