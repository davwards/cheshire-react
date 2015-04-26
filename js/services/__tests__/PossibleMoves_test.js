jest.dontMock('../PossibleMoves');
jest.dontMock('../../models/Board');
jest.dontMock('../../constants/Pieces');

var _ = require('lodash');

var Pieces = require('../../constants/Pieces');
var BoardModel = require('../../models/Board');
var PossibleMoves = require('../PossibleMoves');

describe('Possible Moves', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();
  });

  describe('A pawn', function() {
    var whitePawn1 = { piece: Pieces.PAWN, side: Pieces.sides.WHITE };
    var blackPawn1 = { piece: Pieces.PAWN, side: Pieces.sides.BLACK };
    var whitePawn2 = { piece: Pieces.PAWN, side: Pieces.sides.WHITE };
    var blackPawn2 = { piece: Pieces.PAWN, side: Pieces.sides.BLACK };

    describe('on its side\'s second rank', function() {
      beforeEach(function() {
        board.placePiece(whitePawn1, 'b4');
        board.placePiece(blackPawn1, 'g1');
        board.placePiece(whitePawn2, 'b5');
        board.placePiece(blackPawn2, 'g8');
      });

      it('can move one or two spaces toward the opponent\'s side', function() {
        expect(matchingSet(PossibleMoves(board, 'b4'), ['c4', 'd4'])).toBeTruthy();
        expect(matchingSet(PossibleMoves(board, 'g1'), ['f1', 'e1'])).toBeTruthy();
        expect(matchingSet(PossibleMoves(board, 'b5'), ['c5', 'd5'])).toBeTruthy();
        expect(matchingSet(PossibleMoves(board, 'g8'), ['f8', 'e8'])).toBeTruthy();
      });

      describe('that is blocked by other pieces', function() {
        beforeEach(function(){
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'c4');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'f1');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'd5');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e8');
        });

        it('cannot move through obstacles', function() {
          expect(PossibleMoves(board, 'b4')).toEqual([]);
          expect(PossibleMoves(board, 'g1')).toEqual([]);
          expect(PossibleMoves(board, 'b5')).toEqual(['c5']);
          expect(PossibleMoves(board, 'g8')).toEqual(['f8']);
        });
      });
    });

    describe('not on its side\'s second rank', function() {
      beforeEach(function() {
        board.placePiece(whitePawn1, 'e4');
        board.placePiece(blackPawn1, 'e5');
        board.placePiece(whitePawn2, 'c1');
        board.placePiece(blackPawn2, 'c8');
      });

      it('can move one space toward the opponent\'s side', function() {
        expect(PossibleMoves(board, 'e4')).toEqual(['f4']);
        expect(PossibleMoves(board, 'e5')).toEqual(['d5']);
        expect(PossibleMoves(board, 'c1')).toEqual(['d1']);
        expect(PossibleMoves(board, 'c8')).toEqual(['b8']);
      });
    });

    describe('that has an opportunity to capture', function() {
      beforeEach(function(){
        board.placePiece(blackPawn1, 'e5');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd5');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd6');

        board.placePiece(whitePawn1, 'e4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'f3');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'f4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'f5');

        board.placePiece(whitePawn2, 'c2');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd1');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd2');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd3');

        board.placePiece(blackPawn2, 'c7');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'b6');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'b7');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'b8');
      });

      it('can move to capture enemy pieces', function() {
        expect(PossibleMoves(board, 'e5')).toEqual(['d4', 'd6']);
        expect(PossibleMoves(board, 'e4')).toEqual(['f3', 'f5']);
        expect(PossibleMoves(board, 'c2')).toEqual([]);
        expect(PossibleMoves(board, 'c7')).toEqual([]);
      });
    });

    describe('on the edge of the board', function() {
      beforeEach(function(){
        board.placePiece(blackPawn1, 'h1');
        board.placePiece(whitePawn1, 'h8');
        board.placePiece(whitePawn2, 'a1');
        board.placePiece(blackPawn2, 'a8');
      });

      it('cannot move off the board', function() {
        expect(PossibleMoves(board, 'h1')).toEqual(['g1']);
        expect(PossibleMoves(board, 'h8')).toEqual([]);
        expect(PossibleMoves(board, 'a1')).toEqual(['b1']);
        expect(PossibleMoves(board, 'a8')).toEqual([]);
      });
    });
  });

  describe('A knight', function() {
    var whiteKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE };
    var blackKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK };

    it('can move in an L-shape', function() {
      board.placePiece(whiteKnight, 'c2');
      board.placePiece(blackKnight, 'e6');

      expect(PossibleMoves(board, 'c2').sort()).toEqual(['a1', 'a3', 'b4', 'd4', 'e1', 'e3']);
      expect(PossibleMoves(board, 'e6').sort()).toEqual(['c5', 'c7', 'd4', 'd8', 'f4', 'f8', 'g5', 'g7']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteKnight, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'a1');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'b4');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'd4');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'e3');

      board.placePiece(blackKnight, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c5');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'f8');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'g5');

      expect(PossibleMoves(board, 'c2').sort()).toEqual(['a1', 'a3', 'b4', 'e1']);
      expect(PossibleMoves(board, 'e6').sort()).toEqual(['c5', 'c7', 'd4', 'd8', 'f4', 'g7']);
    });
  });

  describe('A rook', function() {
    var whiteRook = { piece: Pieces.ROOK, side: Pieces.sides.WHITE };
    var blackRook = { piece: Pieces.ROOK, side: Pieces.sides.BLACK };

    it('can move along ranks or files', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece(blackRook, 'e6');

      expect(PossibleMoves(board, 'c2').sort()).toEqual(['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2']);
      expect(PossibleMoves(board, 'e6').sort()).toEqual(['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'a2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expect(PossibleMoves(board, 'c2')).toContain('a2');
      expect(PossibleMoves(board, 'c2')).not.toContain('c4');

      board.placePiece(blackRook, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'a6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');

      expect(PossibleMoves(board, 'e6')).toContain('a6');
      expect(PossibleMoves(board, 'e6')).not.toContain('e3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'b2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expect(PossibleMoves(board, 'c2')).not.toContain('a2');
      expect(PossibleMoves(board, 'c2')).toContain('c3');
      expect(PossibleMoves(board, 'c2')).not.toContain('c5');
    });
  });

  describe('A bishop', function() {
    var whiteBishop = { piece: Pieces.BISHOP, side: Pieces.sides.WHITE };
    var blackBishop = { piece: Pieces.BISHOP, side: Pieces.sides.BLACK };

    it('can move diagonally', function() {
      board.placePiece(whiteBishop, 'c2');
      board.placePiece(blackBishop, 'e6');

      expect(PossibleMoves(board, 'c2').sort()).toEqual(['a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7']);
      expect(PossibleMoves(board, 'e6').sort()).toEqual(['f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2'].sort());
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteBishop, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'a4');

      expect(PossibleMoves(board, 'c2')).toContain('d3');
      expect(PossibleMoves(board, 'c2')).not.toContain('a4');

      board.placePiece(blackBishop, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'h3');

      expect(PossibleMoves(board, 'e6')).toContain('f7');
      expect(PossibleMoves(board, 'e6')).not.toContain('h3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(blackBishop, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd7');

      expect(PossibleMoves(board, 'e6')).not.toContain('g8');
      expect(PossibleMoves(board, 'e6')).not.toContain('c8');
    });
  });
});

function matchingSet(array1, array2) {
  return _.isEmpty(_.xor(array1, array2));
}
