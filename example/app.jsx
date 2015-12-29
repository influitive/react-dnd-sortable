import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Sortable from '../lib/react-dnd-sortable';

const collection = [
  {id: 1, label: "Some Awesome Label 1", x: "a"},
  {id: 2, label: "Some Awesome Label 2", x: "b"},
  {id: 3, label: "Some Awesome Label 3", x: "c"},
  {id: 4, label: "Some Awesome Label 4", x: "d"},
];

class SortableItem extends React.Component {
  render() {
    return (
      <div className={this._classNames()}>
        <div>
          <strong>{this.props.label}</strong> - {this.props.x}
          <img src="https://cdn1.iconfinder.com/data/icons/interface-4/96/Cursor-Move-512.png" width="16px" ref="drag" />
        </div>
      </div>
    );
  }

  _classNames() {
    return classNames({
      item: true,
      over: this.props.isOver
    });
  }
}

class App extends React.Component {
  state = {
    collection1: collection,
    collection2: Array.prototype.slice.call(collection)
  };

  render() {
    return <div className="table-ex">
      <Sortable container="div"
        collection={this.state.collection1}
        onSorted={this._handleSorted1}
        template={<SortableItem />} />
      <br/>
      <Sortable container="div" collection={this.state.collection2}
        onSorted={this._handleSorted2}
        template={<SortableItem />} />
    </div>;
  }

  _handleSorted1 = sortedCollection => {
    this.setState({collection1: sortedCollection});
  }

  _handleSorted2 = sortedCollection => {
    this.setState({collection2: sortedCollection});
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
