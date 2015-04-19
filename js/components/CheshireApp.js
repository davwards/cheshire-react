var React = require('react');

var GameBoardStore = require('../stores/GameBoardStore');

var Board = require('./Board.js');

var CheshireApp = React.createClass({
  render: function() {
    return (
      <section>
        <h1>Hello, World!!</h1>
        <Board boardState={this.state.board}/>
      </section>
    );
  },

  getInitialState: function() {
    return getAppState();
  }
});

function getAppState() {
  return {
    board: GameBoardStore.getBoardState()
  };
};

module.exports = CheshireApp;
