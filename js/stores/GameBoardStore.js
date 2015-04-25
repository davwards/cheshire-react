var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');

var BoardModel = require('../models/Board');
var PossibleMoves = require('../services/PossibleMoves');

var Pieces = require('../constants/Pieces');
var Actions = require('../constants/Actions');
var Events = require('../constants/Events');

_board = new BoardModel();

var _selectedSquare;

function setSelected(rank, file) {
  if(_selectedSquare) {
    if(_board.position(rank+file).possibleMove) {
      _board.move(_selectedSquare, rank+file);
    }

    _board.clearSelection();
    _selectedSquare = null;
  }
  else if(_board.isOccupied(rank+file)) {
    _board.select(rank+file);
    _selectedSquare = rank + file;
    _.each(PossibleMoves(_board, rank+file), function(possibleMove){
      _board.setPossibleMove(possibleMove);
    });
  }
}

var GameBoardStore = assign({}, EventEmitter.prototype, {
  getBoardState: function() {
    return _board.ranks;
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
      setSelected(action.rank, action.file);
      break;

    default:
      return;
  }

  GameBoardStore.emitChange();
});

module.exports = GameBoardStore;
