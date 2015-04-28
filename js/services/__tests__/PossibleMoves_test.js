jest.dontMock('../PossibleMoves');
jest.dontMock('../../models/Board');
jest.dontMock('../../constants/Pieces');
jest.dontMock('../MovementUtils');
jest.dontMock('../movementPredicate');
jest.dontMock('../detectThreats');

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

    describe('on its side\'s second file', function() {
      beforeEach(function() {
        board.placePiece(whitePawn1, 'b2');
        board.placePiece(blackPawn1, 'g7');
        board.placePiece(whitePawn2, 'd2');
        board.placePiece(blackPawn2, 'e7');
      });

      it('can move one or two spaces toward the opponent\'s side', function() {
        expect(PossibleMoves(board, 'b2').sort()).toEqual(['b3', 'b4']);
        expect(PossibleMoves(board, 'g7').sort()).toEqual(['g5', 'g6']);
        expect(PossibleMoves(board, 'd2').sort()).toEqual(['d3', 'd4']);
        expect(PossibleMoves(board, 'e7').sort()).toEqual(['e5', 'e6']);
      });

      describe('that is blocked by other pieces', function() {
        beforeEach(function(){
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'b3');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'g6');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'd4');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e5');
        });

        it('cannot move through obstacles', function() {
          expect(PossibleMoves(board, 'b2')).toEqual([]);
          expect(PossibleMoves(board, 'g7')).toEqual([]);
          expect(PossibleMoves(board, 'd2')).toEqual(['d3']);
          expect(PossibleMoves(board, 'e7')).toEqual(['e6']);
        });
      });
    });

    describe('not on its side\'s second file', function() {
      beforeEach(function() {
        board.placePiece(whitePawn1, 'b3');
        board.placePiece(blackPawn1, 'g6');
        board.placePiece(whitePawn2, 'd3');
        board.placePiece(blackPawn2, 'e6');
      });

      it('can move one space toward the opponent\'s side', function() {
        expect(PossibleMoves(board, 'b3')).toEqual(['b4']);
        expect(PossibleMoves(board, 'g6')).toEqual(['g5']);
        expect(PossibleMoves(board, 'd3')).toEqual(['d4']);
        expect(PossibleMoves(board, 'e6')).toEqual(['e5']);
      });
    });

    describe('that has an opportunity to capture', function() {
      beforeEach(function(){
        board.placePiece(blackPawn1, 'e5');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'f4');
      });

      it('can move to capture enemy pieces', function() {
        expect(PossibleMoves(board, 'e5')).toEqual(['d4', 'f4']);
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

    it('cannot make a move that would put its own king in check', function() {
      board.placePiece(whiteKnight, 'd5');
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f5');
      board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'a5');

      expect(PossibleMoves(board, 'd5')).toEqual([]);
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

    it('cannot make a move that would put its own king in check', function() {
      board.placePiece(whiteRook, 'd5');
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'd7');
      board.placePiece(blackRook, 'd3');

      expect(PossibleMoves(board, 'd5')).toEqual(['d3', 'd4', 'd6']);
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

    it('cannot make a move that would put its own king in check', function() {
      board.placePiece(whiteBishop, 'd5');
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece(blackBishop, 'b3');

      expect(PossibleMoves(board, 'd5')).toEqual(['b3', 'c4', 'e6']);
    });
  });

  describe('A queen', function() {
    var whiteQueen = { piece: Pieces.QUEEN, side: Pieces.sides.WHITE };
    var blackQueen = { piece: Pieces.QUEEN, side: Pieces.sides.BLACK };

    it('can move diagonally, horizontally, or vertically', function() {
      board.placePiece(whiteQueen, 'c2');
      board.placePiece(blackQueen, 'e6');

      expect(PossibleMoves(board, 'c2').sort()).toEqual(['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2', 'a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7'].sort());
      expect(PossibleMoves(board, 'e6').sort()).toEqual(['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6', 'f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2'].sort());
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteQueen, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expect(PossibleMoves(board, 'c2')).toContain('d3');
      expect(PossibleMoves(board, 'c2')).not.toContain('c4');

      board.placePiece(blackQueen, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');

      expect(PossibleMoves(board, 'e6')).toContain('f7');
      expect(PossibleMoves(board, 'e6')).not.toContain('e3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(blackQueen, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd6');

      expect(PossibleMoves(board, 'e6')).not.toContain('g8');
      expect(PossibleMoves(board, 'e6')).not.toContain('c6');
    });

    it('cannot make a move that would put its own king in check', function() {
      board.placePiece(whiteQueen, 'd5');
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece(blackQueen, 'b3');

      expect(PossibleMoves(board, 'd5')).toEqual(['b3', 'c4', 'e6']);
    });
  });

  describe('A king', function() {
    var whiteKing = { piece: Pieces.KING, side: Pieces.sides.WHITE };

    it('can move one step in any direction', function() {
      board.placePiece(whiteKing, 'c2');
      expect(PossibleMoves(board, 'c2').sort()).toEqual(['b1', 'b2', 'b3', 'c1', 'c3', 'd1', 'd2', 'd3'].sort());
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteKing, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'b2');

      expect(PossibleMoves(board, 'c2')).toContain('d3');
      expect(PossibleMoves(board, 'c2')).not.toContain('b2');
    });

    it('cannot make a move that leaves it in check', function() {
      board.placePiece(whiteKing, 'd5');
      board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.BLACK}, 'c4');
      board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'a6');

      expect(PossibleMoves(board, 'd5')).toEqual(['c4', 'e5']);
    });
  });
});

function matchingSet(array1, array2) {
  return _.isEmpty(_.xor(array1, array2));
}
