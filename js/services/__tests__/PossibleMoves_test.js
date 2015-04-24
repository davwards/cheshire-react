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
        _.each([whitePawn1, blackPawn1, whitePawn2, blackPawn2], function(piece) {
          piece.hasMoved = false;
        });
      });

      it('can move one or two spaces toward the opponent\'s side', function() {
        board.placePiece(whitePawn1, 'b4');
        board.placePiece(blackPawn1, 'g1');
        board.placePiece(whitePawn2, 'b5');
        board.placePiece(blackPawn2, 'g8');

        expect(PossibleMoves(board, 'b4')).toEqual(['c4', 'd4']);
        expect(PossibleMoves(board, 'g1')).toEqual(['f1', 'e1']);
        expect(PossibleMoves(board, 'b5')).toEqual(['c5', 'd5']);
        expect(PossibleMoves(board, 'g8')).toEqual(['f8', 'e8']);
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
      var capturablePiece = { piece: Pieces.WHITE_PAWN, side: 'white' }

    });

  });

});
