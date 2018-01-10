import React from 'react'
import CalendarResizerDraggableBox from './CalendarResizerDraggableBox';
import './CalendarResizerDraggableBox.css'

class CalendarEvent extends React.Component {
  componentWillMount(){
    this.setState({
      event:this.props.event,
      calendar:this.props.calendar
    });
    console.log(this.props);
  }
  render() {
    const { calendar, event } = this.state
    return (
      <div className="rbc-event-contentsub">
        <div>{event.title}</div>
        {
          <CalendarResizerDraggableBox event={event}>
            <div className="rbc-resizer icon-event hidden-print">
            </div>
          </CalendarResizerDraggableBox>}
      </div>
    );
  }
}

export default CalendarEvent;