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
  this.ranks[selectedPosition[0]][selectedPosition[1]].selected = true
};

Board.prototype.clearSelection = function clearSelection() {
  _.each(this.ranks, function(rank) {
    _.each(rank, function(square) {
      square.selected = false;
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

function initialPosition() {
  return {
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
      '1' : { piece: Pieces.BLACK_ROOK,   side: 'black' },
      '2' : { piece: Pieces.BLACK_KNIGHT, side: 'black' },
      '3' : { piece: Pieces.BLACK_BISHOP, side: 'black' },
      '4' : { piece: Pieces.BLACK_QUEEN,  side: 'black' },
      '5' : { piece: Pieces.BLACK_KING,   side: 'black' },
      '6' : { piece: Pieces.BLACK_BISHOP, side: 'black' },
      '7' : { piece: Pieces.BLACK_KNIGHT, side: 'black' },
      '8' : { piece: Pieces.BLACK_ROOK,   side: 'black' },
    }
  }
}

module.exports = Board;
