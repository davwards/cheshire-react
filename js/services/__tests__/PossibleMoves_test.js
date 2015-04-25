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

  describe('for a pawn', function() {
    var whitePawn1 = { piece: Pieces.WHITE_PAWN, side: 'white' };
    var blackPawn1 = { piece: Pieces.BLACK_PAWN, side: 'black' };
    var whitePawn2 = { piece: Pieces.WHITE_PAWN, side: 'white' };
    var blackPawn2 = { piece: Pieces.BLACK_PAWN, side: 'black' };

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
          board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'c4');
          board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'f1');
          board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'd5');
          board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'e8');
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
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd4');
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd5');
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd6');

        board.placePiece(whitePawn1, 'e4');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'f3');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'f4');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'f5');

        board.placePiece(whitePawn2, 'c2');
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd1');
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd2');
        board.placePiece({ piece: Pieces.WHITE_PAWN, side: 'white' }, 'd3');

        board.placePiece(blackPawn2, 'c7');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'b6');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'b7');
        board.placePiece({ piece: Pieces.BLACK_PAWN, side: 'black' }, 'b8');
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

});

function matchingSet(array1, array2) {
  return _.isEmpty(_.xor(array1, array2));
}
