import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import { elementType, dateFormat } from './utils/propTypes'
import cn from 'classnames'

export default class TimeSlotGroup extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    isWorkingHour: PropTypes.bool,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    group: PropTypes.string,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    timeGutterFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,
  }
  static defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false,
  }

  renderSlice(slotNumber, content, value) {
    const {
      dayWrapperComponent,
      showLabels,
      isNow,
      culture,
      resource,
      slotPropGetter,
      group,
    } = this.props
    return (
      <TimeSlot
        key={slotNumber}
        slotPropGetter={slotPropGetter}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabels && !slotNumber}
        content={content}
        culture={culture}
        isNow={isNow}
        resource={resource}
        value={value}
        group={group}
      />
    )
  }

  renderSlices() {
    const ret = []
    const sliceLength = this.props.step
    let sliceValue = this.props.value
    for (let i = 0; i < this.props.timeslots; i++) {
      const content = localizer.format(
        sliceValue,
        this.props.timeGutterFormat,
        this.props.culture
      )
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }
  render() {
    const { isWorkingHour } = this.props
    return (
      <div className={cn('rbc-timeslot-group', isWorkingHour || 'rbc-off')}>
        {this.renderSlices()}
      </div>
    )
  }
}
