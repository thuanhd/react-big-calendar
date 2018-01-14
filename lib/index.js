'use strict';

exports.__esModule = true;
exports.HTCalendar = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDndHtml5Backend = require('react-dnd-html5-backend');

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _reactDnd = require('react-dnd');

var _dragAndDrop = require('./addons/dragAndDrop');

var _dragAndDrop2 = _interopRequireDefault(_dragAndDrop);

var _resizeCalendar = require('./addons/resizerDraggableBox/resizeCalendar');

var _resizeCalendar2 = _interopRequireDefault(_resizeCalendar);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _move = require('./utils/move');

var _move2 = _interopRequireDefault(_move);

var _Calendar = require('./Calendar');

var _Calendar2 = _interopRequireDefault(_Calendar);

var _EventWrapper = require('./EventWrapper');

var _EventWrapper2 = _interopRequireDefault(_EventWrapper);

var _BackgroundWrapper = require('./BackgroundWrapper');

var _BackgroundWrapper2 = _interopRequireDefault(_BackgroundWrapper);

var _localizer = require('./localizer');

var _moment3 = require('./localizers/moment');

var _moment4 = _interopRequireDefault(_moment3);

var _globalize = require('./localizers/globalize');

var _globalize2 = _interopRequireDefault(_globalize);

var _constants = require('./utils/constants');

var _globalize3 = require('globalize');

var _globalize4 = _interopRequireDefault(_globalize3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_extends(_Calendar2.default, {
  setLocalizer: _localizer.set,
  globalizeLocalizer: _globalize2.default,
  momentLocalizer: _moment4.default,
  Views: _constants.views,
  Navigate: _constants.navigate,
  move: _move2.default,
  components: {
    eventWrapper: _EventWrapper2.default,
    dayWrapper: _BackgroundWrapper2.default,
    dateCellWrapper: _BackgroundWrapper2.default
  }
});

exports.default = _Calendar2.default;


(0, _globalize2.default)(_globalize4.default);

var DragAndDropCalendar = (0, _dragAndDrop2.default)(_Calendar2.default);

var DndCalendar = function (_React$Component) {
  _inherits(DndCalendar, _React$Component);

  function DndCalendar() {
    _classCallCheck(this, DndCalendar);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  DndCalendar.prototype.moveEvent = function moveEvent(_ref) {
    var event = _ref.event,
        start = _ref.start,
        end = _ref.end,
        practitioner = _ref.practitioner;

    var updatedEvent = _extends({}, event, { start: start, end: end });
    if (practitioner) updatedEvent.practitionerKey = practitioner && practitioner.key;
    this.props.onItemChanged && this.props.onItemChanged(updatedEvent);
  };

  DndCalendar.prototype.selectEvent = function selectEvent(event) {
    this.props.onItemClicked && this.props.onItemClicked(event);
  };

  DndCalendar.prototype.selectCell = function selectCell(slotInfo) {
    var event = {
      start: slotInfo.start,
      end: slotInfo.end,
      practitioner: slotInfo.practitioner
    };
    this.props.onNewItemClicked && this.props.onNewItemClicked(event);
  };

  DndCalendar.prototype.onEventResize = function onEventResize(itemType, _ref2) {
    var event = _ref2.event,
        value = _ref2.value,
        start = _ref2.start,
        end = _ref2.end,
        isPassAbove = _ref2.isPassAbove;

    if (itemType === 'event-resize') {
      var ele = $('#' + event.key);
      var hid = ele.find('.step-height').val();
      var duration2 = _dates2.default.diff(start, end);
      var newHeight = duration2 * hid;
      ele.css('height', newHeight + '%');
      if (isPassAbove) {
        var top = ele.find('.step-top').val();
        var newTop = top - newHeight;
        ele.css('top', newTop + '%');
      }
    }
  };

  DndCalendar.prototype.render = function render() {
    var _this2 = this;

    var timeSlot = this.props.timeSlot;

    timeSlot = timeSlot <= 60 ? timeSlot < 1 ? 1 : timeSlot : 1;
    var step = 60 / timeSlot;
    var from = void 0,
        to = void 0;
    var d = new Date();
    d.setHours(this.props.dayHourRange.from, 0, 0);
    from = d;
    d = new Date();
    d.setHours(this.props.dayHourRange.to + 1, 0, 0);
    to = d;
    var formats = {
      timeGutterFormat: function timeGutterFormat(date, culture, localizer) {
        return date.toLocaleTimeString(localizer, {
          hour: 'numeric',
          hour12: true
        });
      },
      dayFormat: function dayFormat(date, culture, localizer) {
        return (0, _moment2.default)(date).format('ddd, Do MMM');
      },
      eventTimeRangeFormat: function eventTimeRangeFormat(_ref3, culture, localizer) {
        var start = _ref3.start,
            end = _ref3.end;

        return start.toLocaleTimeString(localizer, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }) + ' - ' + end.toLocaleTimeString(localizer, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        });
      },
      selectRangeFormat: function selectRangeFormat(_ref4, culture, localizer) {
        var start = _ref4.start,
            end = _ref4.end;

        return start.toLocaleTimeString(localizer, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }) + ' - ' + end.toLocaleTimeString(localizer, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        });
      }
    };
    var visibleDates = this.calculateVisibleDate();

    var workingHourRange = _extends({}, this.props.dayHourRange);

    var dayOffs = this.props.dayOffs;
    dayOffs = dayOffs && dayOffs.map(function (d) {
      if (d + 1 === 7) return 0;
      return d + 1;
    });

    return _react2.default.createElement(DragAndDropCalendar, {
      components: { event: _resizeCalendar2.default },
      events: this.props.data || [],
      onEventDrop: function onEventDrop(_ref5) {
        var event = _ref5.event,
            start = _ref5.start,
            end = _ref5.end,
            practitioner = _ref5.practitioner;
        return _this2.moveEvent({ event: event, start: start, end: end, practitioner: practitioner });
      },
      onEventResize: function onEventResize(itemType, _ref6) {
        var event = _ref6.event,
            value = _ref6.value,
            start = _ref6.start,
            end = _ref6.end,
            isPassAbove = _ref6.isPassAbove;
        return _this2.onEventResize(itemType, {
          event: event,
          value: value,
          start: start,
          end: end,
          isPassAbove: isPassAbove
        });
      },
      onSelectEvent: function onSelectEvent(event) {
        return _this2.selectEvent(event);
      },
      onSelectSlot: function onSelectSlot(slotInfo) {
        return _this2.selectCell(slotInfo);
      },
      step: step,
      timeslots: timeSlot,
      views: ['custom'],
      defaultView: 'custom',
      visibleDates: visibleDates,
      practitioners: this.props.practitioners,
      workingHourRange: workingHourRange,
      dayOffs: dayOffs,
      defaultDate: this.props.date,
      toolbar: false,
      min: from,
      max: to,
      formats: formats,
      messages: { allDay: '' },
      showFormatter: this.props.showFormatter,
      titleAccessor: function titleAccessor(event) {
        return _this2.handleEventTitle(event);
      }
    });
  };

  DndCalendar.prototype.calculateVisibleDate = function calculateVisibleDate() {
    var visibleDates = [];
    var _props = this.props,
        date = _props.date,
        scale = _props.scale;


    scale = scale < 1 ? 1 : scale > 31 ? 31 : scale;

    switch (scale) {
      case 7:
        var monday = (0, _moment2.default)(date).isoWeekday(1);
        visibleDates = [monday.toDate()];
        for (var i = 1; i < 7; i++) {
          visibleDates.push(monday.add(1, 'days').toDate());
        }
        break;
      default:
        var start = (Math.floor(scale / 2) - (scale % 2 === 0 ? 1 : 0)) * -1;
        var end = Math.floor(scale / 2);
        for (var _i = start; _i <= end; _i++) {
          visibleDates.push((0, _moment2.default)(date).add(_i, 'days').toDate());
        }

    }
    return visibleDates;
  };

  DndCalendar.prototype.handleEventTitle = function handleEventTitle(event) {
    return event.data;
  };

  return DndCalendar;
}(_react2.default.Component);

DndCalendar.propsTypes = {
  timeSlot: _propTypes2.default.number,
  practitioners: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string,
    value: _propTypes2.default.string,
    workingHours: _propTypes2.default.shape({ from: _propTypes2.default.number, to: _propTypes2.default.number })
  })),
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string,
    practitionerKey: _propTypes2.default.string,
    data: _propTypes2.default.any,
    start: _propTypes2.default.instanceOf(Date),
    end: _propTypes2.default.instanceOf(Date),
    unavailable: _propTypes2.default.bool
  })),
  date: _propTypes2.default.instanceOf(Date),
  scale: _propTypes2.default.number,
  dayHourRange: _propTypes2.default.shape({
    from: _propTypes2.default.number,
    to: _propTypes2.default.number
  }),
  dayOffs: _propTypes2.default.arrayOf(_propTypes2.default.number),
  onItemChanged: _propTypes2.default.func,
  onItemClicked: _propTypes2.default.func,
  onNewItemClicked: _propTypes2.default.func,
  showFormatter: _propTypes2.default.func
};
DndCalendar.defaultProps = {
  timeSlot: 4,
  practitioners: [null],
  data: [],
  date: new Date(),
  scale: 7,
  visibleDates: _dates2.default.getDatesWeek(),
  dayHourRange: {
    from: 7,
    to: 22
  },
  dayOffs: [5, 6]
};
var HTCalendar = exports.HTCalendar = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(DndCalendar);