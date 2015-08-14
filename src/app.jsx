var React      = require('react'),
    classnames = require('classnames');

var SortableCollection = require('sortable_collection');

var collection = [
  {id: 1, label: "Some Awesome Label 1", x: "a"},
  {id: 2, label: "Some Awesome Label 2", x: "b"},
  {id: 3, label: "Some Awesome Label 3", x: "c"},
  {id: 4, label: "Some Awesome Label 4", x: "d"},
];

var SortableItem = React.createClass({
  render: function () {
    return (
      <li className={this._classNames()}>
        <strong>{this.props.label}</strong> - {this.props.x}
        <img src="https://cdn1.iconfinder.com/data/icons/interface-4/96/Cursor-Move-512.png" width="16px" ref="drag" />
      </li>
    );
  },
  _classNames: function () {
    return classnames({
      item: true,
      over: this.props.isOver
    });
  }
})

var App = React.createClass({
  getInitialState: function () {
    return {
      collection1: collection,
      collection2: Array.prototype.slice.call(collection)
    };
  },
  render: function () {
    return (
      <p>
        <SortableCollection collection={this.state.collection1} onSorted={this._handleSorted1}>
          <SortableItem />
        </SortableCollection>
        <br />
        <SortableCollection collection={this.state.collection2} onSorted={this._handleSorted2}>
          <SortableItem />
        </SortableCollection>
      </p>
    );
  },
  _handleSorted1: function (sortedCollection) {
    this.setState({collection1: sortedCollection});
  },
  _handleSorted2: function (sortedCollection) {
    this.setState({collection2: sortedCollection});
  }
});


React.render(<App />, document.getElementById('container'));
