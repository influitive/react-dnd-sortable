import React, { PropTypes, cloneElement } from 'react';
import update from 'react/lib/update';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import createSortableItem from './sortable-item';

class SortableCollection extends React.Component {
  static defaultProps = { container: 'ul' };
  static propTypes = {
    type:       PropTypes.string, // unique name for draggable/droppable constraints, defaults to "uniq" name
    handle:     PropTypes.string, // ref of draggable element, otherwise the whole item is draggable (TODO)
    container:  PropTypes.string, // wrapping DOM element tagName
    collection: PropTypes.array,
    onSorted:   PropTypes.func,
    template:   PropTypes.element.isRequired
  };

  state = {
    // Stores the currently sorted collection as reflected by dragging,
    // Collection will be mutated on drag hover so the browser actually moves items
    collection: this.props.collection,
    // Stores the class to render instances of for each entry in collection
    // Note sure of a better way to do this to enable  non-colliding types for each collection
    SortableItemClass: createSortableItem(this.props.type)
  };

  componentWillReceiveProps(nextProps) {
    // Once the onDrop callback is fired with the new collection
    // we need to re-set this collection to ultimately reflect the new order
    this.setState({collection: nextProps.collection});
  }

  render() {
    const SortableItem = this.state.SortableItemClass;

    const children = this.state.collection.map((props, i) => {
      const originalPosition = this.props.collection.indexOf(props);

      return <SortableItem {...props} key={i} position={originalPosition}
        onHover={this._handleHover}
        onDrop={this._handleDrop}
        onCancel={this._handleCancel}
        template={this.props.template} />
    });

    return (
      React.createElement(this.props.container, this.props, children)
    );
  }

  // Tracks hover states to modify interface to reflect current position hovered
  _handleHover = (originalSourcePosition, originalTargetPosition) => {
    const source                = this.props.collection[originalSourcePosition];
    const currentSourcePosition = this.state.collection.indexOf(source);
    const target                = this.props.collection[originalTargetPosition];
    const currentTargetPosition = this.state.collection.indexOf(target);

    this.setState(update(this.state, {
      collection: {$splice: [
        [currentSourcePosition, 1],
        [currentTargetPosition, 0, source]
      ]}
    }));
  }

  // Handles the final callback to calling component to say "this is the new collection"
  _handleDrop = () => {
    if (this.props.collection !== this.state.collection) { // Dropped on yourself
      this.props.onSorted(this.state.collection);
    }
  }

  // If item is dropped outside a valid dropTarget, we cancel and reset
  _handleCancel = () => {
    this.setState({collection: this.props.collection});
  }
}

module.exports = DragDropContext(HTML5Backend)(SortableCollection);
