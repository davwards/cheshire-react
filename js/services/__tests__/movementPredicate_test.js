jest.autoMockOff();

var Pieces = require('../../constants/Pieces');
var BoardModel = require('../../models/Board');
var movementPredicate = require('../movementPredicate');

describe('movementPredicate', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();
  });

  function expectMoveSet(position, moveSet) {
    expect(board.filterSquares(movementPredicate(position, board)).sort()).toEqual(moveSet.sort());
  };

  function expectToHaveMove(start, end) {
    expect(movementPredicate(start, board)(board.info(end), end)).toBeTruthy();
  }

  function expectNotToHaveMove(start, end) {
    expect(movementPredicate(start, board)(board.info(end), end)).toBeFalsy();
  }

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
        expectMoveSet('b2', ['b3', 'b4']);
        expectMoveSet('g7', ['g5', 'g6']);
        expectMoveSet('d2', ['d3', 'd4']);
        expectMoveSet('e7', ['e5', 'e6']);
      });

      describe('that is blocked by other pieces', function() {
        beforeEach(function(){
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'b3');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'g6');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'd4');
          board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e5');
        });

        it('cannot move through obstacles', function() {
          expectMoveSet('b2', []);
          expectMoveSet('g7', []);
          expectMoveSet('d2', ['d3']);
          expectMoveSet('e7', ['e6']);
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
        expectMoveSet('b3', ['b4']);
        expectMoveSet('g6', ['g5']);
        expectMoveSet('d3', ['d4']);
        expectMoveSet('e6', ['e5']);
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
        expectMoveSet('e5', ['d4', 'f4']);
      });
    });
  });

  describe('A knight', function() {
    var whiteKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE };
    var blackKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK };

    it('can move in an L-shape', function() {
      board.placePiece(whiteKnight, 'c2');
      board.placePiece(blackKnight, 'e6');

      expectMoveSet('c2', ['a1', 'a3', 'b4', 'd4', 'e1', 'e3']);
      expectMoveSet('e6', ['c5', 'c7', 'd4', 'd8', 'f4', 'f8', 'g5', 'g7']);
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

      expectMoveSet('c2', ['a1', 'a3', 'b4', 'e1']);
      expectMoveSet('e6', ['c5', 'c7', 'd4', 'd8', 'f4', 'g7']);
    });
  });

  describe('A rook', function() {
    var whiteRook = { piece: Pieces.ROOK, side: Pieces.sides.WHITE };
    var blackRook = { piece: Pieces.ROOK, side: Pieces.sides.BLACK };

    it('can move along ranks or files', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece(blackRook, 'e6');

      expectMoveSet('c2', ['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2']);
      expectMoveSet('e6', ['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'a2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expectToHaveMove('c2', 'a2');
      expectNotToHaveMove('c2', 'c4');

      board.placePiece(blackRook, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'a6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');

      expectToHaveMove('e6', 'a6');
      expectNotToHaveMove('e6', 'e3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(whiteRook, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'b2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expectNotToHaveMove('c2', 'a2');
      expectToHaveMove('c2', 'c3');
      expectNotToHaveMove('c2', 'c5');
    });
  });

  describe('A bishop', function() {
    var whiteBishop = { piece: Pieces.BISHOP, side: Pieces.sides.WHITE };
    var blackBishop = { piece: Pieces.BISHOP, side: Pieces.sides.BLACK };

    it('can move diagonally', function() {
      board.placePiece(whiteBishop, 'c2');
      board.placePiece(blackBishop, 'e6');

      expectMoveSet('c2', ['a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7']);
      expectMoveSet('e6', ['f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteBishop, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'a4');

      expectToHaveMove('c2', 'd3');
      expectNotToHaveMove('c2', 'a4');

      board.placePiece(blackBishop, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'h3');

      expectToHaveMove('e6', 'f7');
      expectNotToHaveMove('e6', 'h3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(blackBishop, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd7');

      expectNotToHaveMove('e6', 'g8');
      expectNotToHaveMove('e6', 'c8');
    });
  });

  describe('A queen', function() {
    var whiteQueen = { piece: Pieces.QUEEN, side: Pieces.sides.WHITE };
    var blackQueen = { piece: Pieces.QUEEN, side: Pieces.sides.BLACK };

    it('can move diagonally, horizontally, or vertically', function() {
      board.placePiece(whiteQueen, 'c2');
      board.placePiece(blackQueen, 'e6');

      expectMoveSet('c2', ['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2', 'a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7']);
      expectMoveSet('e6', ['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6', 'f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteQueen, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

      expectToHaveMove('c2', 'd3');
      expectNotToHaveMove('c2', 'c4');

      board.placePiece(blackQueen, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');

      expectToHaveMove('e6', 'f7');
      expectNotToHaveMove('e6', 'e3');
    });

    it('cannot move past obstacles', function() {
      board.placePiece(blackQueen, 'e6');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd6');

      expectNotToHaveMove('e6', 'g8');
      expectNotToHaveMove('e6', 'c6');
    });
  });

  describe('A king', function() {
    var whiteKing = { piece: Pieces.KING, side: Pieces.sides.WHITE };

    it('can move one step in any direction', function() {
      board.placePiece(whiteKing, 'c2');
      expectMoveSet('c2', ['b1', 'b2', 'b3', 'c1', 'c3', 'd1', 'd2', 'd3']);
    });

    it('can capture opposing but not allied pieces', function() {
      board.placePiece(whiteKing, 'c2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'b2');

      expectToHaveMove('c2', 'd3');
      expectNotToHaveMove('c2', 'b2');
    });
  });
});

