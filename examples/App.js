import React from 'react'
import { render } from 'react-dom'

import {HTCalendar} from 'react-big-calendar'
import moment from 'moment'

import events from './events'

class Example extends React.Component {
  state = { data: events }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ selected: 'dnd' })
    }, 0)
  }

  render() {
    let data = this.state.data

    let monday = moment().isoWeekday(1)
    let visibleDates = [monday.toDate()]
    for (let i = 1; i < 7; i++) {
      visibleDates.push(monday.add(1, 'days').toDate())
    }
    return (
      <div className="app">
        <div className="examples">
          <div className="example">
            <div className="view-source" />
            <HTCalendar
              timeSlot={4}
              scale={7}
              dayOffs={[2,4]}
              practitioners={[{
                key: 'p1',
                value: 'John Cena',
                workingHours: {
                  from: 9,
                  to: 12,
                }
              },{
                key: 'p2',
                value: 'Taka',
                workingHours: {
                  from: 14,
                  to: 17,
                }
              }]}
              onItemChanged={event => this.handleItemChanged(event)}
              onItemClicked={event => this.handleItemClicked(event)}
              onNewItemClicked={event => this.onNewItemClicked(event)}
              data={data}
              showFormatter={(event) => this.formater(event)}
              //date={moment('2018-02-14').toDate()}
            />
          </div>
        </div>
      </div>
    )
  }

  handleItemChanged(event) {
    for(var i =0 ;i<this.state.data.length;i++){
      if(this.state.data[i].key === event.key){
        this.state.data[i] = {...event};
      }
    }
    this.forceUpdate();
  }

  handleItemClicked(event) {
    alert(
      event.title +
        '\n' +
        event.start.toLocaleTimeString() +
        '\n' +
        event.end.toLocaleTimeString()
    )
  }

  onNewItemClicked(event) {
    alert(
      'New \n' +
        event.start.toLocaleTimeString() +
        '\n' +
        event.end.toLocaleTimeString() +
      '\n' +
      event.practitioner.value
    )
  }

  formater(event) {
    return 'Title: ' + event.data + '\nGroup: ' + event.practitionerKey
  }
}

render(<Example />, document.getElementById('root'))
