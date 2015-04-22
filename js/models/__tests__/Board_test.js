jest.dontMock('../Board');
jest.dontMock('../../constants/Pieces');

var _ = require('lodash');

var Pieces = require('../../constants/Pieces');

var BoardModel = require('../Board');

describe('Board model', function() {

  describe('initial state', function() {
    var board = new BoardModel();

    it('has all the pieces in starting position', function() {
      expect(board.position('a1').piece).toEqual(Pieces.WHITE_ROOK);
      expect(board.position('a2').piece).toEqual(Pieces.WHITE_KNIGHT);
      expect(board.position('a3').piece).toEqual(Pieces.WHITE_BISHOP);
      expect(board.position('a4').piece).toEqual(Pieces.WHITE_QUEEN);
      expect(board.position('a5').piece).toEqual(Pieces.WHITE_KING);
      expect(board.position('a6').piece).toEqual(Pieces.WHITE_BISHOP);
      expect(board.position('a7').piece).toEqual(Pieces.WHITE_KNIGHT);
      expect(board.position('a8').piece).toEqual(Pieces.WHITE_ROOK);
      expect(board.position('b1').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b2').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b3').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b4').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b5').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b6').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b7').piece).toEqual(Pieces.WHITE_PAWN);
      expect(board.position('b8').piece).toEqual(Pieces.WHITE_PAWN);

      expect(board.position('c1').piece).toBeFalsy();
      expect(board.position('c2').piece).toBeFalsy();
      expect(board.position('c3').piece).toBeFalsy();
      expect(board.position('c4').piece).toBeFalsy();
      expect(board.position('c5').piece).toBeFalsy();
      expect(board.position('c6').piece).toBeFalsy();
      expect(board.position('c7').piece).toBeFalsy();
      expect(board.position('c8').piece).toBeFalsy();
      expect(board.position('d1').piece).toBeFalsy();
      expect(board.position('d2').piece).toBeFalsy();
      expect(board.position('d3').piece).toBeFalsy();
      expect(board.position('d4').piece).toBeFalsy();
      expect(board.position('d5').piece).toBeFalsy();
      expect(board.position('d6').piece).toBeFalsy();
      expect(board.position('d7').piece).toBeFalsy();
      expect(board.position('d8').piece).toBeFalsy();
      expect(board.position('e1').piece).toBeFalsy();
      expect(board.position('e2').piece).toBeFalsy();
      expect(board.position('e3').piece).toBeFalsy();
      expect(board.position('e4').piece).toBeFalsy();
      expect(board.position('e5').piece).toBeFalsy();
      expect(board.position('e6').piece).toBeFalsy();
      expect(board.position('e7').piece).toBeFalsy();
      expect(board.position('e8').piece).toBeFalsy();
      expect(board.position('f1').piece).toBeFalsy();
      expect(board.position('f2').piece).toBeFalsy();
      expect(board.position('f3').piece).toBeFalsy();
      expect(board.position('f4').piece).toBeFalsy();
      expect(board.position('f5').piece).toBeFalsy();
      expect(board.position('f6').piece).toBeFalsy();
      expect(board.position('f7').piece).toBeFalsy();
      expect(board.position('f8').piece).toBeFalsy();

      expect(board.position('g1').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g2').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g3').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g4').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g5').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g6').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g7').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('g8').piece).toEqual(Pieces.BLACK_PAWN);
      expect(board.position('h1').piece).toEqual(Pieces.BLACK_ROOK);
      expect(board.position('h2').piece).toEqual(Pieces.BLACK_KNIGHT);
      expect(board.position('h3').piece).toEqual(Pieces.BLACK_BISHOP);
      expect(board.position('h4').piece).toEqual(Pieces.BLACK_QUEEN);
      expect(board.position('h5').piece).toEqual(Pieces.BLACK_KING);
      expect(board.position('h6').piece).toEqual(Pieces.BLACK_BISHOP);
      expect(board.position('h7').piece).toEqual(Pieces.BLACK_KNIGHT);
      expect(board.position('h8').piece).toEqual(Pieces.BLACK_ROOK);

    });

    it('has all the pieces marked as unmoved', function() {
      expect(_.all(board, function(rank){
        return _.all(rank, function(square) {
          return !square.hasMoved
        });
      })).toBeTruthy();
    });

    it('has all the positions marked as unselected', function() {

    });
  });
});
