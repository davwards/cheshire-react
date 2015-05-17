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

function setSelected(position) {
  if(_selectedSquare) {
    if(_board.info(position).possibleMove) {
      _board.info(position).possibleMove(_board);
    }

    _board.clearSelection();
    _selectedSquare = null;
  }
  else if(_board.isOccupied(position)) {
    _board.select(position);
    _selectedSquare = position;
    _.each(PossibleMoves(_board, position), function(possibleMove, destination){
      _board.setPossibleMove(destination, possibleMove);
    });
  }
}

var GameBoardStore = assign({}, EventEmitter.prototype, {
  getBoardState: function() {
    return _.merge(_.clone(_board.positions), {promotingPawn: _board.promotingPawn()});
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
