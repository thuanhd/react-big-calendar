import React from 'react'
import { render } from 'react-dom'

import localizer from 'react-big-calendar/lib/localizers/globalize'
import globalize from 'globalize'
import moment from 'moment'

localizer(globalize)

import 'react-big-calendar/lib/less/styles.less'
import './styles.less'
import './prism.less'
import Basic from './demos/basic'
import Selectable from './demos/selectable'
import Cultures from './demos/cultures'
import Popup from './demos/popup'
import Rendering from './demos/rendering'
import CustomView from './demos/customView'
import Timeslots from './demos/timeslots'
import Dnd from './demos/dnd'
import events from './events'

class Example extends React.Component {
  state = { selected: 'basic', dateSet: events }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ selected: 'dnd' })
    }, 0)
  }

  render() {
    let dataSet = this.state.dateSet
    let selected = this.state.selected
    let Current = {
      basic: Basic,
      selectable: Selectable,
      cultures: Cultures,
      popup: Popup,
      rendering: Rendering,
      customView: CustomView,
      timeslots: Timeslots,
      dnd: Dnd,
    }[selected]
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
            <Current
              className="demo"
              visibleDates={visibleDates}
              dateRange={7}
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

    for(var i =0 ;i<this.state.dateSet.length;i++){
      if(this.state.dateSet[i].id === event.id){
        this.state.dateSet[i] = {...event};
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
