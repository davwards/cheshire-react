var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');

var BoardModel = require('../models/Board');
var possibleMoves = require('../services/possibleMoves');
var gameOver = require('../services/gameOver');

var Pieces = require('../constants/Pieces');
var Actions = require('../constants/Actions');
var Events = require('../constants/Events');

_board = new BoardModel();

var _sideToPlay = Pieces.sides.WHITE;
var _currentSelection;
var _possibleMoves = {};

function setSelected(position) {
  if(_currentSelection) {
    if(_possibleMoves[position]) {
      _possibleMoves[position](_board);
      _sideToPlay = (_sideToPlay === Pieces.sides.WHITE ?
                      Pieces.sides.BLACK :
                      Pieces.sides.WHITE);
    }

    _currentSelection = null;
    _possibleMoves = {};
  }
  else if(_board.info(position).side === _sideToPlay) {
    _currentSelection = position;
    _possibleMoves = possibleMoves(_board, position);
  }
}

var GameBoardStore = assign({}, EventEmitter.prototype, {
  getBoardState: function() {
    var state = _.tap(_.clone(_board.positions, true), function(b) {
      b.sideToPlay = _sideToPlay;
      b.promotingPawn = _board.promotingPawn();
      b.gameState = gameOver(_board, _sideToPlay);

      if(_currentSelection)
        b[_currentSelection].selected = true;

      _.each(_possibleMoves, function(move, position) {
        b[position].possibleMove = !!move;
      });
    });

    return state;
  },
  emitChange: function() {
    this.emit(Events.CHANGE);
  },
  addChangeListener: function(callback) {
    this.on(Events.CHANGE, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(Events.CHANGE, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case Actions.SELECT_SQUARE:
      setSelected(action.position);
      break;

    case Actions.PROMOTE_PAWN:
      _board.promotePawn(action.position, action.newType);
      break;

    default:
      return;
  }

  GameBoardStore.emitChange();
});

module.exports = GameBoardStore;
