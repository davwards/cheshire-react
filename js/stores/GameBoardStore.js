var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Pieces = require('../constants/Pieces');
var Actions = require('../constants/Actions');
var Events = require('../constants/Events');

_board = {
  'a' : {
    '1' : { piece: Pieces.WHITE_ROOK, side: 'white' },
    '2' : { piece: Pieces.WHITE_KNIGHT, side: 'white' },
    '3' : { piece: Pieces.WHITE_BISHOP, side: 'white' },
    '4' : { piece: Pieces.WHITE_QUEEN, side: 'white' },
    '5' : { piece: Pieces.WHITE_KING, side: 'white' },
    '6' : { piece: Pieces.WHITE_BISHOP, side: 'white' },
    '7' : { piece: Pieces.WHITE_KNIGHT, side: 'white' },
    '8' : { piece: Pieces.WHITE_ROOK, side: 'white' },
  },
  'b' : {
    '1' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '2' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '3' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '4' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '5' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '6' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '7' : { piece: Pieces.WHITE_PAWN, side: 'white' },
    '8' : { piece: Pieces.WHITE_PAWN, side: 'white' },
  },
  'c' : {
    '1' : { piece: '', side: null },
    '2' : { piece: '', side: null },
    '3' : { piece: '', side: null },
    '4' : { piece: '', side: null },
    '5' : { piece: '', side: null },
    '6' : { piece: '', side: null },
    '7' : { piece: '', side: null },
    '8' : { piece: '', side: null },
  },
  'd' : {
    '1' : { piece: '', side: null },
    '2' : { piece: '', side: null },
    '3' : { piece: '', side: null },
    '4' : { piece: '', side: null },
    '5' : { piece: '', side: null },
    '6' : { piece: '', side: null },
    '7' : { piece: '', side: null },
    '8' : { piece: '', side: null },
  },
  'e' : {
    '1' : { piece: '', side: null },
    '2' : { piece: '', side: null },
    '3' : { piece: '', side: null },
    '4' : { piece: '', side: null },
    '5' : { piece: '', side: null },
    '6' : { piece: '', side: null },
    '7' : { piece: '', side: null },
    '8' : { piece: '', side: null },
  },
  'f' : {
    '1' : { piece: '', side: null },
    '2' : { piece: '', side: null },
    '3' : { piece: '', side: null },
    '4' : { piece: '', side: null },
    '5' : { piece: '', side: null },
    '6' : { piece: '', side: null },
    '7' : { piece: '', side: null },
    '8' : { piece: '', side: null },
  },
  'g' : {
    '1' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '2' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '3' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '4' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '5' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '6' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '7' : { piece: Pieces.BLACK_PAWN, side: 'black' },
    '8' : { piece: Pieces.BLACK_PAWN, side: 'black' },
  },
  'h' : {
    '1' : { piece: Pieces.BLACK_ROOK, side: 'black' },
    '2' : { piece: Pieces.BLACK_KNIGHT, side: 'black' },
    '3' : { piece: Pieces.BLACK_BISHOP, side: 'black' },
    '4' : { piece: Pieces.BLACK_QUEEN, side: 'black' },
    '5' : { piece: Pieces.BLACK_KING, side: 'black' },
    '6' : { piece: Pieces.BLACK_BISHOP, side: 'black' },
    '7' : { piece: Pieces.BLACK_KNIGHT, side: 'black' },
    '8' : { piece: Pieces.BLACK_ROOK, side: 'black' },
  },
};

function clearSelection() {
  _.each(_board, function(rank){
    _.each(rank, function(square) {
      square.selected = false;
    });
  });
}

function setSelected(rank, file) {
  clearSelection();
  _board[rank][file].selected = true;
  console.log('set selected: ' + rank + file);
}

var GameBoardStore = assign({}, EventEmitter.prototype, {
  getBoardState: function() {
    return _board;
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
    case Actions.SELECT_PIECE:
      setSelected(action.rank, action.file);
      _board[action.rank][action.file].selected = true;
      break;

    default:
      return;
  }

  GameBoardStore.emitChange();
});

module.exports = GameBoardStore;
