import React, { PropTypes, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import flow from 'lodash.flow';


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
    const sourcePosition = monitor.getItem().position;
    const targetPosition = props.position;

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

class Item extends React.Component {
  static propTypes = {
    template: PropTypes.element
  };

  componentDidMount() {
    const ref = this._createRef();
    const { connectDragSource, connectDropTarget } = this.props;
    connectDragSource(findDOMNode(this.refs[ref]));
    connectDropTarget(findDOMNode(this.refs[ref]));
  }

  render() {
    return cloneElement(this.props.template, {...this.props, ref: this._createRef() });
  }

  _createRef() {
    const { id, position } = this.props;
    return `${id}${position}`;
  }
}

export default (customType) => {
  const type = customType || Math.random().toString(36).substring(7);
  return flow(
    DropTarget(type, dropTarget, collectTarget),
    DragSource(type, dragSource, collectSource)
  )(Item);
}
