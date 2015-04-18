var React = require('react');

var Board = require('./Board.js');

var CheshireApp = React.createClass({
  render: function() {
    return (
      <section>
        <h1>Hello, World!!</h1>
        <Board />
      </section>
    );
  }
});

module.exports = CheshireApp;
