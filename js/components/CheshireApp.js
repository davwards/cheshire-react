var React = require('react');

var GameBoardStore = require('../stores/GameBoardStore');

var Board = require('./Board.js');

var CheshireApp = React.createClass({
  render: function() {
    return (
      <section>
        <Board boardState={this.state.board}/>
      </section>
    );
  },

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    GameBoardStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GameBoardStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getAppState());
  }
});

function getAppState() {
  return {
    board: GameBoardStore.getBoardState()
  };
};

module.exports = CheshireApp;
