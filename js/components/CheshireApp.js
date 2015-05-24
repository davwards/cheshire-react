var React = require('react');

var GameBoardStore = require('../stores/GameBoardStore');

var Pieces = require('../constants/Pieces');
var Game = require('../constants/Game');
var Board = require('./Board.js');
var PawnPromotionDialogue = require('./PawnPromotionDialogue');

var CheshireApp = React.createClass({
  render: function() {
    var promotionDialogue;
    var enableSelection = true;

    if(this.state.board.promotingPawn) {
      promotionDialogue = (
        <PawnPromotionDialogue
          side={this.state.board[this.state.board.promotingPawn].side}
          position={this.state.board.promotingPawn}/>
      );
      enableSelection = false;
    }

    return (
      <section className="game-table">
        <Board boardState={this.state.board} enableSelection={enableSelection}/>
        { promotionDialogue }
        <p className="game-caption">{this._caption()}</p>
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
  },

  _caption: function() {
    if(this.state.board.promotingPawn)
      return 'Pawn promotes!';

    switch(this.state.board.gameState) {
      case Game.CONTINUE:
        return this._sideToPlay() + ' to play';
      case Game.CHECKMATE:
        return 'Checkmate!';
      case Game.STALEMATE:
        return 'Stalemate!';
    }
  },

  _sideToPlay: function() {
    return this.state.board.sideToPlay === Pieces.sides.WHITE ?
      'White':
      'Black';
  }
});

function getAppState() {
  return {
    board: GameBoardStore.getBoardState()
  };
};
module.exports = CheshireApp;
