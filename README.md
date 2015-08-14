React Sortable
==============

### Render drag/drop sortable collections using React Dnd

> Provides a thin wrapper around React Dnd so you don't have to worry about the inner workings
> of that lib. Allows for live sorting with a callback on 'drop' with the newly sorted collection

#### Usage

( See src/app.jsx for another working example )

```javascript

var React       = require('react'),
    Sortable    = require('react-sortable'),
    classnames  = require('classnames');

var Template = React.createClass({
  propTypes: {
    isOver: React.PropTypes.boolean // injected by ReactSortable
  },

  render: function () {
    return (
      <li classname={classnames({item: true, over: this.props.isOver)}}>
        <p>Item {this.props.x} for {this.props.y}</p>
      </li>
    );
  }
});

// Get from some store
var collection = [
  {x: 1, y: 2},
  {x: 3, y: 4},
  {x: 5, y: 6},
  {x: 7, y: 8}
];

var SortableCollection = React.createClass({
  getInitialState: function () {
    return {
      collection: collection
    };
  },

  render: function () {
    return (
      <Sortable collection={this.state.collection} onSorted={this._handleSorted}>
        <Template />
      </Sortable>
    );
  },
  _handleSorted: function (sortedCollection) {
    this.setState({collection: sortedCollection});
  }
});
```

#### TODO

1. Right now sortable collection wraps items in a `<ul>`. It'd be nice to make this customizable
2. Sortable "type" is random, meaning you can't drag/drop onto other containers. It'd be nice
   to support dragging between different sortables
3. Support a customizable "handle" that a user can drag within template so the whole item doesn't
   *have* to be draggable
