var React            = require('react'),
    update           = require('react/lib/update'),
    clone            = React.cloneElement,
    dnd              = require('react-dnd'),
    DragSource       = dnd.DragSource,
    DropTarget       = dnd.DropTarget,
    DragDropContext  = dnd.DragDropContext,
    HTML5Backend     = require('react-dnd-html5-backend');

var dragSource = {
  beginDrag: function (props) {
    return {
      position: props.position
    };
  },

  endDrag: function(props, monitor){
    if (monitor.didDrop()) {
      props.onDrop();
    } else {
      props.onCancel();
    }
  }
};

var dropTarget = {
  hover: function (props, monitor) {
    var sourcePosition = monitor.getItem().position,
        targetPosition = props.position;

    if (sourcePosition !== targetPosition) { props.onHover(sourcePosition, targetPosition); }
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

var Item = React.createClass({
  render: function () {
    var connect = instance =>
      this.props.connectDragSource(this.props.connectDropTarget(instance));

      return clone(this.props.children, { ...this.props, ref: connect });
  }
});

var SortableCollection = React.createClass({
  propTypes: {
    type:           React.PropTypes.string, // unique name for draggable/droppable constraints, defaults to "uniq" name
    handle:         React.PropTypes.string, // ref of draggable element, otherwise the whole item is draggable (TODO)
    container:      React.PropTypes.string, // wrapping DOM element tagName
    collection:     React.PropTypes.array,
    onSorted:       React.PropTypes.func,
    children:       React.PropTypes.element.isRequired, // single element to act as template for collection
  },

  getDefaultProps: function () {
    return {
      container: "ul"
    };
  },

  getInitialState: function () {
    var type = this.props.type || this._generateType();

    var DropItem      = DropTarget(type, dropTarget, collectTarget)(Item),
        DragDropItem  = DragSource(type, dragSource, collectSource)(DropItem);

    return {
      // Stores the currently sorted collection as reflected by dragging,
      // Collection will be mutated on drag hover so the browser actually moves items
      collection: this.props.collection,
      // Stores the class to render instances of for each entry in collection
      // Note sure of a better way to do this to enable  non-colliding types for each collection
      SortableItemClass: DragDropItem
    };
  },

  componentWillReceiveProps: function (nextProps) {
    // Once the onDrop callback is fired with the new collection
    // we need to re-set this collection to ultimately reflect the new order
    this.setState({collection: nextProps.collection});
  },

  render: function () {
    var SortableItem = this.state.SortableItemClass;

    var children = this.state.collection.map(function (props, i) {
      var originalPosition = this.props.collection.indexOf(props);

      return (
        <SortableItem {...props} key={i} position={originalPosition}
          onHover={this._handleHover}
          onDrop={this._handleDrop}
          onCancel={this._handleCancel} >
          {this.props.children}
        </SortableItem>
      );
    }, this);

    return (
      React.createElement(this.props.container, this.props, children)
    );
  },
  // Tracks hover states to modify interface to reflect current position hovered
  _handleHover: function (originalSourcePosition, originalTargetPosition) {
    var source                = this.props.collection[originalSourcePosition],
        currentSourcePosition = this.state.collection.indexOf(source),
        target                = this.props.collection[originalTargetPosition],
        currentTargetPosition = this.state.collection.indexOf(target);

    this.setState(update(this.state, {
      collection: {$splice: [
        [currentSourcePosition, 1],
        [currentTargetPosition, 0, source]
      ]}
    }));
  },

  // Handles the final callback to calling component to say "this is the new collection"
  _handleDrop: function () {
    if (this.props.collection !== this.state.collection) { // Dropped on yourself
      this.props.onSorted(this.state.collection);
    }
  },

  // If item is dropped outside a valid dropTarget, we cancel and reset
  _handleCancel: function () {
    this.setState({collection: this.props.collection});
  },

  // Expected to be random enough so as never to collide with other SortableCollections
  // UUID would obv be better but I *think* the odds of this colliding are pretty slim
  _generateType: function () {
    return Math.random().toString(36).substring(7);
  }
});

module.exports = DragDropContext(HTML5Backend)(SortableCollection);
