import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'
import { elementType } from './utils/propTypes'
import moment from 'moment'
import {notify} from './utils/helpers'

export default class TimeSlot extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    value: PropTypes.instanceOf(Date).isRequired,
    practitioner: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      workingHours: PropTypes.shape({from: PropTypes.number, to: PropTypes.number})
    }),
    isNow: PropTypes.bool,
    showLabel: PropTypes.bool,
    content: PropTypes.string,
    culture: PropTypes.string,
    slotPropGetter: PropTypes.func,
    resource: PropTypes.string,
    step: PropTypes.number,
    onSelectSlot: PropTypes.func,
  }

  static defaultProps = {
    isNow: false,
    showLabel: false,
    content: '',
  }

  render() {
    const { value, slotPropGetter, resource, practitioner } = this.props
    const Wrapper = this.props.dayWrapperComponent
    const { className, style } = (slotPropGetter && slotPropGetter(value)) || {}

    return (
      <Wrapper value={value} practitioner={practitioner} resource={resource}>
        <div
          onClick={() => this.handleSlotClick()}
          style={style}
          className={cn(
            'rbc-time-slot',
            className,
            this.props.showLabel && 'rbc-label',
            this.props.isNow && 'rbc-now'
          )}
        >
          {this.props.showLabel && <span>{this.props.content}</span>}
        </div>
      </Wrapper>
    )
  }

  handleSlotClick() {
    let {value, practitioner} = this.props;
    let end = moment(value).add(this.props.step,'minutes').toDate();
    notify(this.props.onSelectSlot, {
      start: value,
      end,
      practitioner
    });
  }
}
