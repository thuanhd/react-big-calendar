import { views } from './utils/constants'
import Month from './Month'
import Day from './Day'
import Week from './Week'
import WorkWeek from './WorkWeek'
import Agenda from './Agenda'
import Custom from './Custom'

const VIEWS = {
  [views.MONTH]: Month,
  [views.WEEK]: Week,
  [views.WORK_WEEK]: WorkWeek,
  [views.CUSTOM]: Custom,
  [views.DAY]: Day,
  [views.AGENDA]: Agenda,
}

export default VIEWS
