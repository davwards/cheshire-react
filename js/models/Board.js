var _ = require('lodash');

var Pieces = require('../constants/Pieces');
var BasicMove = require('../services/BasicMove');

var Board = function Board() {
  this.positions = initialPosition();
};

Board.prototype.info = function info(position) {
  return _.clone(this.positions[position]);
};

Board.prototype.draftMove = function draftMove(position, move){
  var possibleWorld = new Board();
  possibleWorld.positions = _.clone(this.positions, true);

  move(possibleWorld);
  return possibleWorld;
};

Board.prototype.select = function select(position) {
  if(!this.promotingPawn()) {
    this.clearSelection();
    setInfo(this, position, 'selected', true);
  }
};

Board.prototype.setPossibleMove = function setPossibleMove(position, move) {
  setInfo(this, position, 'possibleMove', move);
};

Board.prototype.setMoved = function setMoved(position) {
  setInfo(this, position, 'hasMoved', true);
};

Board.prototype.lastPawnJump = function lastPawnJump() {
  return this._lastPawnJump;
};

Board.prototype.setLastPawnJump = function setLastPawnJump(position) {
  this._lastPawnJump = position;
};

Board.prototype.promotingPawn = function promotingPawn() {
  return this._promotingPawn;
};

Board.prototype.setPromotingPawn = function setPromotingPawn(position) {
  this._promotingPawn = position;
};

Board.prototype.promotePawn = function promotePawn(position, newType) {
  setInfo(this, position, 'piece', newType);
  this.setPromotingPawn(undefined);
};

Board.prototype.clearSelection = function clearSelection() {
  var board = this;
  _.each(board.listSquares(), function(square) {
    setInfo(board, square.position, 'selected', false)
    setInfo(board, square.position, 'possibleMove', false)
  });
};

Board.prototype.clearBoard = function clearBoard() {
  var board = this;
  _.each(board.listSquares(), function(square) {
    clearSquareInfo(board, square.position);
  });
};

Board.prototype.placePiece = function placePiece(piece, position) {
  this.positions[position] = piece;
};

Board.prototype.removePiece = function removePiece(position) {
  clearSquareInfo(this, position);
};

Board.prototype.isOccupied = function isOccupied(position) {
  return this.info(position) && this.info(position).piece
}

Board.prototype.filterSquares = function filterSquares(predicate) {
  return _.chain(this.listSquares())
    .select(function(candidate) { return predicate(candidate); })
    .map(function(square) { return square.position; })
    .value();
};

Board.prototype.listSquares = function listSquares() {
  return _.map(this.positions, function(info, position) {
    return {info: info, position: position};
  });
};

Board.prototype.findKing = function findKing(side) {
  return this.filterSquares(function(square) {
    return square.info.piece == Pieces.KING && square.info.side == side;
  })[0];
};

function initialPosition() {
  return {
    'a1' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },
    'b1' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
    'c1' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
    'd1' : { piece: Pieces.QUEEN,  side: Pieces.sides.WHITE },
    'e1' : { piece: Pieces.KING,   side: Pieces.sides.WHITE },
    'f1' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
    'g1' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
    'h1' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },

    'a2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'b2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'c2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'd2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'e2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'f2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'g2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    'h2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },

    'a3' : { piece: '', side: null },
    'b3' : { piece: '', side: null },
    'c3' : { piece: '', side: null },
    'd3' : { piece: '', side: null },
    'e3' : { piece: '', side: null },
    'f3' : { piece: '', side: null },
    'g3' : { piece: '', side: null },
    'h3' : { piece: '', side: null },

    'a4' : { piece: '', side: null },
    'b4' : { piece: '', side: null },
    'c4' : { piece: '', side: null },
    'd4' : { piece: '', side: null },
    'e4' : { piece: '', side: null },
    'f4' : { piece: '', side: null },
    'g4' : { piece: '', side: null },
    'h4' : { piece: '', side: null },

    'a5' : { piece: '', side: null },
    'b5' : { piece: '', side: null },
    'c5' : { piece: '', side: null },
    'd5' : { piece: '', side: null },
    'e5' : { piece: '', side: null },
    'f5' : { piece: '', side: null },
    'g5' : { piece: '', side: null },
    'h5' : { piece: '', side: null },

    'a6' : { piece: '', side: null },
    'b6' : { piece: '', side: null },
    'c6' : { piece: '', side: null },
    'd6' : { piece: '', side: null },
    'e6' : { piece: '', side: null },
    'f6' : { piece: '', side: null },
    'g6' : { piece: '', side: null },
    'h6' : { piece: '', side: null },

    'a7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'b7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'c7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'd7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'e7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'f7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'g7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    'h7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },

    'a8' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
    'b8' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
    'c8' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
    'd8' : { piece: Pieces.QUEEN,  side: Pieces.sides.BLACK },
    'e8' : { piece: Pieces.KING,   side: Pieces.sides.BLACK },
    'f8' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
    'g8' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
    'h8' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
  }
}

function clearSquareInfo(board, position) {
  board.positions[position] = {};
};

function setInfo(board, position, key, value) {
  board.positions[position][key] = value;
}

module.exports = Board;
