import React from 'react'
import CalendarResizerDraggableBox from './CalendarResizerDraggableBox';
import './CalendarResizerDraggableBox.css'

class CalendarEvent extends React.Component {
  render() {
    return (
      <div className="rbc-event-contentsub">
        <div>{this.props.event.title}</div>
        {
          <CalendarResizerDraggableBox event={this.props.event}>
            <div className="rbc-resizer icon-event hidden-print">
            </div>
          </CalendarResizerDraggableBox>}
      </div>
    );
  }
}

export default CalendarEvent;