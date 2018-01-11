'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CalendarResizerDraggableBox = require('./CalendarResizerDraggableBox');

var _CalendarResizerDraggableBox2 = _interopRequireDefault(_CalendarResizerDraggableBox);

require('./CalendarResizerDraggableBox.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalendarEvent = function (_React$Component) {
  _inherits(CalendarEvent, _React$Component);

  function CalendarEvent() {
    _classCallCheck(this, CalendarEvent);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  CalendarEvent.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rbc-event-contentsub' },
      _react2.default.createElement(
        'div',
        null,
        this.props.event.title
      ),
      _react2.default.createElement(
        _CalendarResizerDraggableBox2.default,
        { event: this.props.event },
        _react2.default.createElement('div', { className: 'rbc-resizer icon-event hidden-print' })
      )
    );
  };

  return CalendarEvent;
}(_react2.default.Component);

exports.default = CalendarEvent;
module.exports = exports['default'];