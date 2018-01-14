import React from 'react'
import CalendarResizerDraggableBox from './CalendarResizerDraggableBox';
import cn from 'classnames'

class CalendarEvent extends React.Component {
  render() {
    let title = this.props.title;
    return (
      <div className={cn(
        "rbc-event-contentsub",
        this.props.wrapText && "wrap-text"
      )}>
        <div>{title}</div>
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