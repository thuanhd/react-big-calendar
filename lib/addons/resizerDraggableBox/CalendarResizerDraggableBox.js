'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDnd = require('react-dnd');

var _reactDndHtml5Backend = require('react-dnd-html5-backend');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalendarResizerDraggableBox = function (_React$Component) {
  _inherits(CalendarResizerDraggableBox, _React$Component);

  function CalendarResizerDraggableBox() {
    _classCallCheck(this, CalendarResizerDraggableBox);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  CalendarResizerDraggableBox.prototype.componentDidMount = function componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    });
  };

  CalendarResizerDraggableBox.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        connectDragSource = _props.connectDragSource;

    return connectDragSource(children);
  };

  return CalendarResizerDraggableBox;
}(_react2.default.Component);

CalendarResizerDraggableBox.propTypes = {
  children: _propTypes2.default.node.isRequired,
  connectDragSource: _propTypes2.default.func.isRequired
};
exports.default = (0, _reactDnd.DragSource)('event-resize', {
  beginDrag: function beginDrag(props) {
    // pass props to DragLayer, getting with monitor.getItem()
    return props.event;
  },
  endDrag: function endDrag(props) {
    // pass special state to mark the end of the drag
    return { endDrag: true };
  }
}, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    // isDragging: monitor.isDragging(),
    // item: monitor.getItem(),
    // itemType: monitor.getItemType(),
    // dropResult: monitor.getDropResult(),
    // didDrop: monitor.didDrop(),
    // differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
    connectDragPreview: connect.dragPreview() // prevent from displaying ghost image
  };
})(CalendarResizerDraggableBox);
module.exports = exports['default'];