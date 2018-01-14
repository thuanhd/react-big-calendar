'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _DayColumn = require('./DayColumn');

var _DayColumn2 = _interopRequireDefault(_DayColumn);

var _TimeColumn = require('./TimeColumn');

var _TimeColumn2 = _interopRequireDefault(_TimeColumn);

var _DateContentRow = require('./DateContentRow');

var _DateContentRow2 = _interopRequireDefault(_DateContentRow);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _width = require('dom-helpers/query/width');

var _width2 = _interopRequireDefault(_width);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _messages = require('./utils/messages');

var _messages2 = _interopRequireDefault(_messages);

var _propTypes3 = require('./utils/propTypes');

var _helpers = require('./utils/helpers');

var _accessors = require('./utils/accessors');

var _eventLevels = require('./utils/eventLevels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeGrid = function (_Component) {
  _inherits(TimeGrid, _Component);

  function TimeGrid(props) {
    _classCallCheck(this, TimeGrid);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleSelectAllDaySlot = function (slots, slotInfo) {
      var onSelectSlot = _this.props.onSelectSlot;

      (0, _helpers.notify)(onSelectSlot, {
        slots: slots,
        start: slots[0],
        end: slots[slots.length - 1],
        action: slotInfo.action
      });
    };

    _this.state = { gutterWidth: undefined, isOverflowing: null };
    _this.handleSelectEvent = _this.handleSelectEvent.bind(_this);
    _this.handleDoubleClickEvent = _this.handleDoubleClickEvent.bind(_this);
    _this.handleHeaderClick = _this.handleHeaderClick.bind(_this);
    return _this;
  }

  TimeGrid.prototype.componentWillMount = function componentWillMount() {
    this._gutters = [];
    this.calculateScroll();
  };

  TimeGrid.prototype.componentDidMount = function componentDidMount() {
    this.checkOverflow();

    if (this.props.width == null) {
      this.measureGutter();
    }
    this.applyScroll();

    this.positionTimeIndicator();
    this.triggerTimeIndicatorUpdate();
  };

  TimeGrid.prototype.componentWillUnmount = function componentWillUnmount() {
    window.clearTimeout(this._timeIndicatorTimeout);
  };

  TimeGrid.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this.props.width == null && !this.state.gutterWidth) {
      this.measureGutter();
    }

    this.applyScroll();
    this.positionTimeIndicator();
    //this.checkOverflow()
  };

  TimeGrid.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _props = this.props,
        range = _props.range,
        scrollToTime = _props.scrollToTime;
    // When paginating, reset scroll

    if (!_dates2.default.eq(nextProps.range[0], range[0], 'minute') || !_dates2.default.eq(nextProps.scrollToTime, scrollToTime, 'minute')) {
      this.calculateScroll();
    }
  };

  TimeGrid.prototype.render = function render() {
    var _this2 = this;

    var _props2 = this.props,
        events = _props2.events,
        range = _props2.range,
        dayOffs = _props2.dayOffs,
        width = _props2.width,
        startAccessor = _props2.startAccessor,
        endAccessor = _props2.endAccessor,
        resources = _props2.resources,
        allDayAccessor = _props2.allDayAccessor,
        showMultiDayTimes = _props2.showMultiDayTimes;


    width = width || this.state.gutterWidth;

    var start = range[0],
        end = range[range.length - 1];

    this.slots = range.length;

    var allDayEvents = [],
        rangeEvents = [];

    events.forEach(function (event) {
      if ((0, _eventLevels.inRange)(event, start, end, _this2.props)) {
        var eStart = (0, _accessors.accessor)(event, startAccessor),
            eEnd = (0, _accessors.accessor)(event, endAccessor);

        if ((0, _accessors.accessor)(event, allDayAccessor) || _dates2.default.isJustDate(eStart) && _dates2.default.isJustDate(eEnd) || !showMultiDayTimes && !_dates2.default.eq(eStart, eEnd, 'day')) {
          allDayEvents.push(event);
        } else {
          rangeEvents.push(event);
        }
      }
    });

    allDayEvents.sort(function (a, b) {
      return (0, _eventLevels.sortEvents)(a, b, _this2.props);
    });

    var gutterRef = function gutterRef(ref) {
      return _this2._gutters[1] = ref && (0, _reactDom.findDOMNode)(ref);
    };

    var eventsRendered = this.renderEvents(range, rangeEvents, this.props.now, resources || [null], dayOffs);
    allDayEvents = [];
    return _react2.default.createElement(
      'div',
      { className: 'rbc-time-view' },
      this.renderHeader(range, allDayEvents, width, resources, dayOffs),
      _react2.default.createElement(
        'div',
        { ref: 'content', className: 'rbc-time-content' },
        _react2.default.createElement('div', { ref: 'timeIndicator', className: 'rbc-current-time-indicator' }),
        _react2.default.createElement(_TimeColumn2.default, _extends({}, this.props, {
          showLabels: true,
          style: { width: width },
          ref: gutterRef,
          className: 'rbc-time-gutter'
        })),
        eventsRendered
      )
    );
  };

  TimeGrid.prototype.renderEvents = function renderEvents(range, events, today, resources, dayOffs) {
    var _this3 = this;

    var _props3 = this.props,
        min = _props3.min,
        max = _props3.max,
        endAccessor = _props3.endAccessor,
        startAccessor = _props3.startAccessor,
        resourceAccessor = _props3.resourceAccessor,
        resourceIdAccessor = _props3.resourceIdAccessor,
        components = _props3.components,
        practitioners = _props3.practitioners,
        workingHourRange = _props3.workingHourRange;

    var rangeGroups = [];
    for (var i = 0; i < range.length; i++) {
      for (var j = 0; j < practitioners.length; j++) {
        rangeGroups.push({ date: range[i], practitioner: practitioners[j] });
      }
    }
    var currentDate = void 0;
    return rangeGroups.map(function (_ref, idx) {
      var date = _ref.date,
          practitioner = _ref.practitioner;

      var split = idx > 0 && currentDate === date;
      currentDate = date;
      var daysEvents = events.filter(function (event) {
        return _dates2.default.inRange(date, (0, _accessors.accessor)(event, startAccessor), (0, _accessors.accessor)(event, endAccessor), 'day') && practitioner && practitioner.key === event.practitionerKey;
      });
      return resources.map(function (resource, id) {
        var eventsToDisplay = !resource ? daysEvents : daysEvents.filter(function (event) {
          return (0, _accessors.accessor)(event, resourceAccessor) === (0, _accessors.accessor)(resource, resourceIdAccessor);
        });
        var weekDay = _dates2.default.getDateWeek(date);
        return _react2.default.createElement(_DayColumn2.default, _extends({}, _this3.props, {
          workingHourRange: workingHourRange,
          min: _dates2.default.merge(date, min),
          max: _dates2.default.merge(date, max),
          resource: resource && resource.id,
          eventComponent: components.event,
          eventWrapperComponent: components.eventWrapper,
          dayWrapperComponent: components.dayWrapper,
          className: (0, _classnames2.default)({ 'split': split }),
          style: (0, _eventLevels.segStyle)(1, _this3.slots),
          key: idx + '-' + id,
          isOff: dayOffs.includes(weekDay),
          date: date,
          practitioner: practitioner,
          events: eventsToDisplay,
          onSelectSlot: function onSelectSlot(slotInfo) {
            return _this3.handleSelect(slotInfo);
          },
          showFormatter: _this3.props.showFormatter
        }));
      });
    });
  };

  TimeGrid.prototype.renderHeader = function renderHeader(range, events, width, resources, dayOffs) {
    var _this4 = this;

    var _props4 = this.props,
        messages = _props4.messages,
        rtl = _props4.rtl,
        selectable = _props4.selectable,
        components = _props4.components,
        now = _props4.now;

    var _ref2 = this.state || {},
        isOverflowing = _ref2.isOverflowing;

    var style = {};
    if (isOverflowing) style[rtl ? 'marginLeft' : 'marginRight'] = (0, _scrollbarSize2.default)() - 1 + 'px';

    var headerRendered = resources ? this.renderHeaderResources(range, resources) : (0, _messages2.default)(messages).allDay;

    return _react2.default.createElement(
      'div',
      {
        ref: 'headerCell',
        className: (0, _classnames2.default)('rbc-time-header', isOverflowing && 'rbc-overflowing'),
        style: style
      },
      _react2.default.createElement(
        'div',
        { className: 'rbc-row' },
        _react2.default.createElement('div', { className: 'rbc-label rbc-header-gutter', style: { width: width } }),
        this.renderHeaderCells(range)
      ),
      resources && _react2.default.createElement(
        'div',
        { className: 'rbc-row rbc-row-resource' },
        _react2.default.createElement('div', { className: 'rbc-label rbc-header-gutter', style: { width: width } }),
        headerRendered
      ),
      _react2.default.createElement(
        'div',
        { className: 'rbc-row' },
        _react2.default.createElement(
          'div',
          {
            ref: function ref(_ref3) {
              return _this4._gutters[0] = _ref3;
            },
            className: 'rbc-label rbc-header-gutter',
            style: { width: width }
          },
          ''
        ),
        this.renderHeaderGroups(range)
      )
    );
  };

  TimeGrid.prototype.renderHeaderGroups = function renderHeaderGroups(range) {
    var _this5 = this;

    var _props5 = this.props,
        dayPropGetter = _props5.dayPropGetter,
        practitioners = _props5.practitioners;


    var newRange = [];
    for (var i = 0; i < range.length; i++) {
      for (var j = 0; j < practitioners.length; j++) {
        newRange.push({ date: range[i], practitioner: practitioners[j] });
      }
    }
    var currentDate = void 0;
    return newRange.map(function (_ref4, index) {
      var date = _ref4.date,
          practitioner = _ref4.practitioner;

      var split = index > 0 && currentDate === date;
      currentDate = date;

      var _ref5 = dayPropGetter && dayPropGetter(date) || {},
          className = _ref5.className,
          dayStyles = _ref5.style;

      var dateWeek = _dates2.default.getDateWeek(date);
      return _react2.default.createElement(
        'div',
        {
          key: index,
          className: (0, _classnames2.default)('rbc-header', 'rbc-groupName', split && 'split', className, _dates2.default.isToday(date) && 'rbc-today', _this5.props.dayOffs.includes(dateWeek) && 'rbc-off'),
          style: _extends({}, dayStyles, (0, _eventLevels.segStyle)(1, _this5.slots))
        },
        _react2.default.createElement(
          'span',
          null,
          practitioner ? practitioner.value : ''
        )
      );
    });
  };

  TimeGrid.prototype.renderHeaderResources = function renderHeaderResources(range, resources) {
    var _this6 = this;

    var resourceTitleAccessor = this.props.resourceTitleAccessor;

    return range.map(function (date, i) {
      return resources.map(function (resource, j) {
        return _react2.default.createElement(
          'div',
          {
            key: i + '-' + j,
            className: (0, _classnames2.default)('rbc-header', _dates2.default.isToday(date) && 'rbc-today', _this6.props.dayOffs.includes(date.getDay()) && 'rbc-off'),
            style: (0, _eventLevels.segStyle)(1, _this6.slots)
          },
          _react2.default.createElement(
            'span',
            null,
            (0, _accessors.accessor)(resource, resourceTitleAccessor)
          )
        );
      });
    });
  };

  TimeGrid.prototype.renderHeaderCells = function renderHeaderCells(range) {
    var _this7 = this;

    var _props6 = this.props,
        dayFormat = _props6.dayFormat,
        culture = _props6.culture,
        components = _props6.components,
        dayPropGetter = _props6.dayPropGetter,
        getDrilldownView = _props6.getDrilldownView;

    var HeaderComponent = components.header || _Header2.default;

    return range.map(function (date, i) {
      var drilldownView = getDrilldownView(date);
      var label = _localizer2.default.format(date, dayFormat, culture);

      var _ref6 = dayPropGetter && dayPropGetter(date) || {},
          className = _ref6.className,
          dayStyles = _ref6.style;

      var header = _react2.default.createElement(HeaderComponent, {
        date: date,
        label: label,
        localizer: _localizer2.default,
        format: dayFormat,
        culture: culture
      });
      var dateWeek = _dates2.default.getDateWeek(date);
      return _react2.default.createElement(
        'div',
        {
          key: i,
          className: (0, _classnames2.default)('rbc-header', className, _dates2.default.isToday(date) && 'rbc-today', _this7.props.dayOffs.includes(dateWeek) && 'rbc-off'),
          style: _extends({}, dayStyles, (0, _eventLevels.segStyle)(1, _this7.slots))
        },
        drilldownView ? _react2.default.createElement(
          'a',
          {
            href: '#',
            onClick: function onClick(e) {
              return _this7.handleHeaderClick(date, drilldownView, e);
            }
          },
          header
        ) : _react2.default.createElement(
          'span',
          null,
          header
        )
      );
    });
  };

  TimeGrid.prototype.handleSelect = function handleSelect(slotInfo) {
    (0, _helpers.notify)(this.props.onSelectSlot, slotInfo);
  };

  TimeGrid.prototype.handleHeaderClick = function handleHeaderClick(date, view, e) {
    e.preventDefault();
    (0, _helpers.notify)(this.props.onDrillDown, [date, view]);
  };

  TimeGrid.prototype.handleSelectEvent = function handleSelectEvent() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _helpers.notify)(this.props.onSelectEvent, args);
  };

  TimeGrid.prototype.handleDoubleClickEvent = function handleDoubleClickEvent() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    (0, _helpers.notify)(this.props.onDoubleClickEvent, args);
  };

  TimeGrid.prototype.handleSelectAlldayEvent = function handleSelectAlldayEvent() {
    //cancel any pending selections so only the event click goes through.
    this.clearSelection();

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    (0, _helpers.notify)(this.props.onSelectEvent, args);
  };

  TimeGrid.prototype.clearSelection = function clearSelection() {
    clearTimeout(this._selectTimer);
    this._pendingSelection = [];
  };

  TimeGrid.prototype.measureGutter = function measureGutter() {
    var width = this.state.gutterWidth;
    var gutterCells = this._gutters;

    if (!width) {
      width = Math.max.apply(Math, gutterCells.map(_width2.default));

      if (width) {
        width += 10;
        this.setState({ gutterWidth: width });
      }
    }
  };

  TimeGrid.prototype.applyScroll = function applyScroll() {
    if (this._scrollRatio) {
      var content = this.refs.content;

      content.scrollTop = content.scrollHeight * this._scrollRatio;
      // Only do this once
      this._scrollRatio = null;
    }
  };

  TimeGrid.prototype.calculateScroll = function calculateScroll() {
    var _props7 = this.props,
        min = _props7.min,
        max = _props7.max,
        scrollToTime = _props7.scrollToTime;


    var diffMillis = scrollToTime - _dates2.default.startOf(scrollToTime, 'day');
    var totalMillis = _dates2.default.diff(max, min);

    this._scrollRatio = diffMillis / totalMillis;
  };

  TimeGrid.prototype.checkOverflow = function checkOverflow() {
    var _this8 = this;

    if (this._updatingOverflow) return;

    var isOverflowing = this.refs.content.scrollHeight > this.refs.content.clientHeight;

    if (this.state.isOverflowing !== isOverflowing) {
      this._updatingOverflow = true;
      this.setState({ isOverflowing: isOverflowing }, function () {
        _this8._updatingOverflow = false;
      });
    }
  };

  TimeGrid.prototype.positionTimeIndicator = function positionTimeIndicator() {
    var _props8 = this.props,
        rtl = _props8.rtl,
        min = _props8.min,
        max = _props8.max;

    var now = new Date();

    var secondsGrid = _dates2.default.diff(max, min, 'seconds');
    var secondsPassed = _dates2.default.diff(now, min, 'seconds');

    var timeIndicator = this.refs.timeIndicator;
    var factor = secondsPassed / secondsGrid;
    var timeGutter = this._gutters[this._gutters.length - 1];

    if (timeGutter && now >= min && now <= max) {
      var pixelHeight = timeGutter.offsetHeight;
      var offset = Math.floor(factor * pixelHeight);

      timeIndicator.style.display = 'block';
      timeIndicator.style[rtl ? 'left' : 'right'] = 0;
      timeIndicator.style[rtl ? 'right' : 'left'] = timeGutter.offsetWidth + 'px';
      timeIndicator.style.top = offset + 'px';
    } else {
      timeIndicator.style.display = 'none';
    }
  };

  TimeGrid.prototype.triggerTimeIndicatorUpdate = function triggerTimeIndicatorUpdate() {
    var _this9 = this;

    // Update the position of the time indicator every minute
    this._timeIndicatorTimeout = window.setTimeout(function () {
      _this9.positionTimeIndicator();

      _this9.triggerTimeIndicatorUpdate();
    }, 60000);
  };

  return TimeGrid;
}(_react.Component);

TimeGrid.propTypes = {
  events: _propTypes2.default.array.isRequired,
  resources: _propTypes2.default.array,

  step: _propTypes2.default.number,
  range: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date)),
  dayOffs: _propTypes2.default.arrayOf(_propTypes2.default.number),
  workingHourRange: _propTypes2.default.shape({
    from: _propTypes2.default.number,
    to: _propTypes2.default.number
  }),
  practitioners: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string,
    value: _propTypes2.default.string,
    workingHours: _propTypes2.default.shape({ from: _propTypes2.default.number, to: _propTypes2.default.number })
  })),
  min: _propTypes2.default.instanceOf(Date),
  max: _propTypes2.default.instanceOf(Date),
  now: _propTypes2.default.instanceOf(Date),

  scrollToTime: _propTypes2.default.instanceOf(Date),
  eventPropGetter: _propTypes2.default.func,
  dayPropGetter: _propTypes2.default.func,
  dayFormat: _propTypes3.dateFormat,
  showMultiDayTimes: _propTypes2.default.bool,
  culture: _propTypes2.default.string,

  rtl: _propTypes2.default.bool,
  width: _propTypes2.default.number,

  titleAccessor: _propTypes3.accessor.isRequired,
  allDayAccessor: _propTypes3.accessor.isRequired,
  startAccessor: _propTypes3.accessor.isRequired,
  endAccessor: _propTypes3.accessor.isRequired,
  resourceAccessor: _propTypes3.accessor.isRequired,

  resourceIdAccessor: _propTypes3.accessor.isRequired,
  resourceTitleAccessor: _propTypes3.accessor.isRequired,

  selected: _propTypes2.default.object,
  selectable: _propTypes2.default.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: _propTypes2.default.number,

  onNavigate: _propTypes2.default.func,
  onSelectSlot: _propTypes2.default.func,
  onSelectEnd: _propTypes2.default.func,
  onSelectStart: _propTypes2.default.func,
  onSelectEvent: _propTypes2.default.func,
  onDoubleClickEvent: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  getDrilldownView: _propTypes2.default.func.isRequired,

  messages: _propTypes2.default.object,
  components: _propTypes2.default.object.isRequired,
  showFormatter: _propTypes2.default.func
};
TimeGrid.defaultProps = {
  step: 30,
  min: _dates2.default.startOf(new Date(), 'day'),
  max: _dates2.default.endOf(new Date(), 'day'),
  scrollToTime: _dates2.default.startOf(new Date(), 'day'),
  /* these 2 are needed to satisfy requirements from TimeColumn required props
   * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
   */
  type: 'gutter',
  now: new Date(),
  practitioners: [null]
};
exports.default = TimeGrid;
module.exports = exports['default'];