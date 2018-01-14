import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import dates from './utils/dates'
import { elementType, dateFormat } from './utils/propTypes'
import BackgroundWrapper from './BackgroundWrapper'
import TimeSlotGroup from './TimeSlotGroup'
import {notify} from './utils/helpers'

export default class TimeColumn extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    culture: PropTypes.string,
    timeslots: PropTypes.number.isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    workingHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    practitioner: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      workingHours: PropTypes.shape({from: PropTypes.number, to: PropTypes.number})
    }),

    showLabels: PropTypes.bool,
    timeGutterFormat: dateFormat,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    resource: PropTypes.string,

    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,
    onSelectSlot: PropTypes.func,
  }
  static defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: 'day',
    className: '',
    dayWrapperComponent: BackgroundWrapper,
  }

  renderTimeSliceGroup(key, isNow, date, resource) {
    const {
      dayWrapperComponent,
      timeslots,
      showLabels,
      step,
      slotPropGetter,
      dayPropGetter,
      timeGutterFormat,
      workingHourRange,
      culture,
      practitioner,
    } = this.props
    let hour = date.getHours()
    let isWorkingHour =
      !workingHourRange ||
      (workingHourRange &&
        hour >= workingHourRange.from &&
        hour <= workingHourRange.to)

    let practitionerAvaiable = true;
    let from =  practitioner && practitioner.workingHours && practitioner.workingHours.from;
    let to =  practitioner && practitioner.workingHours && practitioner.workingHours.to;

    if(from && from >=0 && from <=24) {
      practitionerAvaiable = from <= hour;
    }
    if(practitionerAvaiable && to && to >=0 && to <=24) {
      practitionerAvaiable = to >= hour
    }

    return (
      <TimeSlotGroup
        key={key}
        isWorkingHour={isWorkingHour}
        practitionerAvaiable={practitionerAvaiable}
        isNow={isNow}
        value={date}
        practitioner={practitioner}
        step={step}
        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        culture={culture}
        timeslots={timeslots}
        resource={resource}
        showLabels={showLabels}
        timeGutterFormat={timeGutterFormat}
        dayWrapperComponent={dayWrapperComponent}
        onSelectSlot={(slotInfo) => this.handleSelect(slotInfo)}
      />
    )
  }

  render() {
    const {
      className,
      children,
      style,
      now,
      min,
      max,
      step,
      timeslots,
      resource,
    } = this.props
    const totalMin = dates.diff(min, max, 'minutes')
    const numGroups = Math.ceil(totalMin / (step * timeslots))
    const renderedSlots = []
    const groupLengthInMinutes = step * timeslots

    let date = min
    let next = date
    let isNow = false

    for (var i = 0; i < numGroups; i++) {
      isNow = dates.inRange(
        now,
        date,
        dates.add(next, groupLengthInMinutes - 1, 'minutes'),
        'minutes'
      )

      next = dates.add(date, groupLengthInMinutes, 'minutes')
      renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date, resource))

      date = next
    }
    return (
      <div className={cn(className, 'rbc-time-column')} style={style}>
        {renderedSlots}
        {children}
      </div>
    )
  }

  handleSelect(slotInfo) {
    notify(this.props.onSelectSlot, slotInfo)
  }
}
