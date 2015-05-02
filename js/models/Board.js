var _ = require('lodash');

var Pieces = require('../constants/Pieces');
var BasicMove = require('../services/BasicMove');

var Board = function Board() {
  this.positions = initialPosition();
};

Board.prototype.info = function info(positionName) {
  var rank = positionName[0];
  var file = positionName[1];

  return _.clone(this.positions[file][rank]);
};

Board.prototype.move = function move(start, destination){
  BasicMove(start, destination)(this);
};

Board.prototype.draftMove = function draftMove(position, move){
  var possibleWorld = new Board();
  possibleWorld.positions = _.clone(this.positions, true);

  move(possibleWorld);
  return possibleWorld;
};

Board.prototype.select = function select(position) {
  this.clearSelection();
  setInfo(this, position, 'selected', true)
};

Board.prototype.setPossibleMove = function setPossibleMove(position) {
  setInfo(this, position, 'possibleMove', true)
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
  this.positions[position[1]][position[0]] = piece;
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
  return _.chain(this.positions)
    .map(function(file, fileName) {
      return _.map(file, function(squareInfo, rankName) {
        return {info: squareInfo, position: rankName + fileName};
      })
    })
    .flatten()
    .value();
};

Board.prototype.findKing = function findKing(side) {
  return this.filterSquares(function(square) {
    return square.info.piece == Pieces.KING && square.info.side == side;
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

function clearSquareInfo(board, squarePosition) {
  squareInfo = board.positions[squarePosition[1]][squarePosition[0]];
  _.each(Object.keys(squareInfo), function(key) {
    squareInfo[key] = undefined;
  });
};

function setInfo(board, position, key, value) {
  board.positions[position[1]][position[0]][key] = value;
}

module.exports = Board;
