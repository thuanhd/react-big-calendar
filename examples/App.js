import React from 'react'
import { render } from 'react-dom'

import {HTCalendar} from 'react-big-calendar'
import moment from 'moment'

import events from './events'

class Example extends React.Component {
  state = { dataSet: events }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ selected: 'dnd' })
    }, 0)
  }

  render() {
    let dataSet = this.state.dataSet

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
              visibleDates={visibleDates}
              groups={['John Cena', 'Taka']}
              onItemChanged={event => this.handleItemChanged(event)}
              onItemClicked={event => this.handleItemClicked(event)}
              onCellClicked={event => this.handleCellClicked(event)}
              dataSet={dataSet}
            />
          </div>
        </div>
      </div>
    )
  }

  handleItemChanged(event) {
    for(var i =0 ;i<this.state.dataSet.length;i++){
      if(this.state.dataSet[i].id === event.id){
        this.state.dataSet[i] = {...event};
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

  handleCellClicked(event) {
    alert(
      'New \n' +
        event.start.toLocaleTimeString() +
        '\n' +
        event.end.toLocaleTimeString()
    )
  }
}

render(<Example />, document.getElementById('root'))
