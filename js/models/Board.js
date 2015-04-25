var _ = require('lodash');

var Pieces = require('../constants/Pieces');

var Board = function Board() {
  this.ranks = initialPosition();
};

Board.prototype.position = function position(positionName) {
  var rank = positionName[0];
  var file = positionName[1];

  return this.ranks[rank][file];
};

Board.prototype.move = function move(start, destination){
  var piece = this.ranks[start[0]][start[1]];
  this.ranks[start[0]][start[1]] = {};
  this.ranks[destination[0]][destination[1]] = piece;
};

Board.prototype.rank = function rank(rankName) {
  return this.ranks[rankName];
}

Board.prototype.select = function select(selectedPosition) {
  this.clearSelection();
  this.position(selectedPosition).selected = true
};

Board.prototype.setPossibleMove = function setPossibleMove(position) {
  this.position(position).possibleMove = true;
};

Board.prototype.clearSelection = function clearSelection() {
  _.each(this.ranks, function(rank) {
    _.each(rank, function(square) {
      square.selected = false;
      square.possibleMove = false;
    })
  });
};

Board.prototype.clearBoard = function clearBoard() {
  _.each(this.ranks, function(rank) {
    _.each(rank, function(square) {
      _.each(Object.keys(square), function(key) {
        square[key] = undefined;
      });
    });
  });
};

Board.prototype.placePiece = function placePiece(piece, position) {
  this.ranks[position[0]][position[1]] = piece;
};

Board.prototype.isOccupied = function isOccupied(position) {
  return this.position(position) && this.position(position).piece
}

Board.prototype.filterSquares = function filterSquares(predicate) {
  return _.chain(this.ranks)
    .map(function(rank, rankName) {
      return _.map(rank, function(square, fileName) {
        return {square: square, position: rankName + fileName};
      })
    })
    .flatten()
    .select(function(candidate) { return predicate(candidate.square, candidate.position); })
    .map(function(square) { return square.position; })
    .value();
};

function initialPosition() {
  return {
    'a' : {
      '1' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },
      '2' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
      '3' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
      '4' : { piece: Pieces.QUEEN,  side: Pieces.sides.WHITE },
      '5' : { piece: Pieces.KING,   side: Pieces.sides.WHITE },
      '6' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
      '7' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
      '8' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },
    },
    'b' : {
      '1' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '2' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '3' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '4' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '5' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '6' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '7' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      '8' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
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
      '1' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '2' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '3' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '4' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '5' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '6' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '7' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      '8' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    },
    'h' : {
      '1' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
      '2' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
      '3' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
      '4' : { piece: Pieces.QUEEN,  side: Pieces.sides.BLACK },
      '5' : { piece: Pieces.KING,   side: Pieces.sides.BLACK },
      '6' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
      '7' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
      '8' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
    }
  }
}

module.exports = Board;
