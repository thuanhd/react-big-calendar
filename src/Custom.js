import PropTypes from 'prop-types'
import React from 'react'
import dates from './utils/dates'
import localizer from './localizer'
import { navigate } from './utils/constants'
import TimeGrid from './TimeGrid'
import moment from 'moment'

class Custom extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    visibleDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    dayOffs: PropTypes.arrayOf(PropTypes.number),
    workingHourRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
  }

  static defaultProps = {
    ...TimeGrid.defaultProps,
    dateRange: 7,
    dayOffs: [6, 7],
    workingHourRange: {
      from: 9,
      to: 16,
    },
  }

  render() {
    let { date, ...props } = this.props
    let range = Custom.range(date, this.props)
    return <TimeGrid {...props} range={range} eventOffset={15} />
  }
}

Custom.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'week')

    case navigate.NEXT:
      return dates.add(date, 1, 'week')

    default:
      return date
  }
}

Custom.range = (date, { culture, visibleDates }) => {
  return visibleDates.map(d =>
    moment(d)
      .startOf('day')
      .toDate()
  )
}

Custom.title = (date, { formats, culture, visibleDates }) => {
  if (visibleDates) {
    let [start, ...rest] = visibleDates
    return localizer.format(
      { start, end: rest.pop() },
      formats.dayRangeHeaderFormat,
      culture
    )
  }
}

export default Custom
