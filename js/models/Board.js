var _ = require('lodash');

var Pieces = require('../constants/Pieces');

var Board = function Board() {
  this.positions = initialPosition();
};

Board.prototype.position = function position(positionName) {
  var rank = positionName[0];
  var file = positionName[1];

  return this.positions[file][rank];
};

Board.prototype.move = function move(start, destination){
  var piece = this.position(start);
  this.placePiece({}, start);
  this.placePiece(piece, destination);
};

Board.prototype.draftMove = function draftMove(start, destination){
  var possibleWorld = new Board();
  possibleWorld.positions = _.clone(this.positions, true);

  possibleWorld.move(start, destination);
  return possibleWorld;
};

Board.prototype.file = function rank(fileName) {
  return this.positions[fileName];
};

Board.prototype.select = function select(selectedPosition) {
  this.clearSelection();
  this.position(selectedPosition).selected = true
};

Board.prototype.setPossibleMove = function setPossibleMove(position) {
  this.position(position).possibleMove = true;
};

Board.prototype.clearSelection = function clearSelection() {
  _.each(this.positions, function(file) {
    _.each(file, function(square) {
      square.selected = false;
      square.possibleMove = false;
    })
  });
};

Board.prototype.clearBoard = function clearBoard() {
  _.each(this.positions, function(file) {
    _.each(file, function(square) {
      _.each(Object.keys(square), function(key) {
        square[key] = undefined;
      });
    });
  });
};

Board.prototype.placePiece = function placePiece(piece, position) {
  this.positions[position[1]][position[0]] = piece;
};

Board.prototype.isOccupied = function isOccupied(position) {
  return this.position(position) && this.position(position).piece
}

Board.prototype.filterSquares = function filterSquares(predicate) {
  return _.chain(this.positions)
    .map(function(file, fileName) {
      return _.map(file, function(square, rankName) {
        return {square: square, position: rankName + fileName};
      })
    })
    .flatten()
    .select(function(candidate) { return predicate(candidate.square, candidate.position); })
    .map(function(square) { return square.position; })
    .value();
};

Board.prototype.findKing = function findKing(side) {
  return this.filterSquares(function(square) {
    return square.piece == Pieces.KING && square.side == side;
  })[0];
};

function initialPosition() {
  return {
    '1' : {
      'a' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },
      'b' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
      'c' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
      'd' : { piece: Pieces.QUEEN,  side: Pieces.sides.WHITE },
      'e' : { piece: Pieces.KING,   side: Pieces.sides.WHITE },
      'f' : { piece: Pieces.BISHOP, side: Pieces.sides.WHITE },
      'g' : { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE },
      'h' : { piece: Pieces.ROOK,   side: Pieces.sides.WHITE },
    },
    '2' : {
      'a' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'b' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'c' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'd' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'e' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'f' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'g' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
      'h' : { piece: Pieces.PAWN,   side: Pieces.sides.WHITE },
    },
    '3' : {
      'a' : { piece: '', side: null },
      'b' : { piece: '', side: null },
      'c' : { piece: '', side: null },
      'd' : { piece: '', side: null },
      'e' : { piece: '', side: null },
      'f' : { piece: '', side: null },
      'g' : { piece: '', side: null },
      'h' : { piece: '', side: null },
    },
    '4' : {
      'a' : { piece: '', side: null },
      'b' : { piece: '', side: null },
      'c' : { piece: '', side: null },
      'd' : { piece: '', side: null },
      'e' : { piece: '', side: null },
      'f' : { piece: '', side: null },
      'g' : { piece: '', side: null },
      'h' : { piece: '', side: null },
    },
    '5' : {
      'a' : { piece: '', side: null },
      'b' : { piece: '', side: null },
      'c' : { piece: '', side: null },
      'd' : { piece: '', side: null },
      'e' : { piece: '', side: null },
      'f' : { piece: '', side: null },
      'g' : { piece: '', side: null },
      'h' : { piece: '', side: null },
    },
    '6' : {
      'a' : { piece: '', side: null },
      'b' : { piece: '', side: null },
      'c' : { piece: '', side: null },
      'd' : { piece: '', side: null },
      'e' : { piece: '', side: null },
      'f' : { piece: '', side: null },
      'g' : { piece: '', side: null },
      'h' : { piece: '', side: null },
    },
    '7' : {
      'a' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'b' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'c' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'd' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'e' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'f' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'g' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
      'h' : { piece: Pieces.PAWN,   side: Pieces.sides.BLACK },
    },
    '8' : {
      'a' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
      'b' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
      'c' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
      'd' : { piece: Pieces.QUEEN,  side: Pieces.sides.BLACK },
      'e' : { piece: Pieces.KING,   side: Pieces.sides.BLACK },
      'f' : { piece: Pieces.BISHOP, side: Pieces.sides.BLACK },
      'g' : { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK },
      'h' : { piece: Pieces.ROOK,   side: Pieces.sides.BLACK },
    }
  }
}

module.exports = Board;
