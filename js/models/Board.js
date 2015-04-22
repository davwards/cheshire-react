var Pieces = require('../constants/Pieces');

var Board = function Board() {
  this._squares = initialPosition();
};

Board.prototype.position = function position(positionName) {
  var rank = positionName[0];
  var file = positionName[1];

  return this._squares[rank][file];
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
      '7' : { piece: Pieces.BLACK_PAWN, side: 'black', hasMoved: true },
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
    }
  }
}

module.exports = Board;
