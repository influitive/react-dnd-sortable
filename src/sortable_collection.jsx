var React            = require('react'),
    update           = require('react/lib/update'),
    clone            = require('react/addons').addons.cloneWithProps,
    dnd              = require('react-dnd'),
    DragSource       = dnd.DragSource,
    DropTarget       = dnd.DropTarget,
    DragDropContext  = dnd.DragDropContext,
    HTML5Backend     = require('react-dnd/modules/backends/HTML5');

var dragSource = {
  beginDrag: function (props) {
    return {
      id: props[props.itemIdentifier]
    };
  }
};

var dropTarget = {
  hover: function (props, monitor) {
    var itemIdentifier = props.itemIdentifier;

    var sourceId = monitor.getItem().id,
        targetId = props[itemIdentifier];

    if (sourceId !== targetId) { props.onSort(sourceId, targetId); }
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
    var connectSource = this.props.connectDragSource,
        connectTarget = this.props.connectDropTarget;

    return connectSource(connectTarget(
      clone(this.props.children, this.props)
    ));
  }
});

var Tmp          = DropTarget("X", dropTarget, collectTarget)(Item),
    SortableItem = DragSource("X", dragSource, collectSource)(Tmp);

var SortableCollection = React.createClass({
  propTypes: {
    type:           React.PropTypes.string,
    dragRef:        React.PropTypes.string,
    collection:     React.PropTypes.array,
    itemIdentifier: React.PropTypes.string, // they key to uniquely identify each item in collection
    onSorted:       React.PropTypes.func,
    children:       React.PropTypes.element.isRequired,
  },
  getDefaultProps: function () {
    return {
      itemIdentifier: 'id'
    };
  },
  render: function () {
    var itemIdentifier = this.props.itemIdentifier

    var children = this.props.collection.map(function (props, i) {
      return (
        <SortableItem {...props} itemIdentifier={itemIdentifier} key={i} onSort={this._handleSort}>
          {this.props.children}
        </SortableItem>
      );
    }, this);

    return (
      <ul>{children}</ul>
    );
  },
  _handleSort: function (sourceId, targetId) {
    var itemIdentifier = this.props.itemIdentifier;

    var source      = this.props.collection.filter(function(i){ return i[itemIdentifier] == sourceId; })[0],
        target      = this.props.collection.filter(function(i){ return i[itemIdentifier] == targetId; })[0],
        sourceIndex = this.props.collection.indexOf(source),
        targetIndex = this.props.collection.indexOf(target);

    var collection = update(this.props.collection, {$splice: [
      [sourceIndex, 1],
      [targetIndex, 0, source]
    ]});

    this.props.onSorted(collection);
  }
});

module.exports = DragDropContext(HTML5Backend)(SortableCollection);
