jest.autoMockOff();

var _ = require('lodash');

var Pieces = require('../../constants/Pieces');

var BoardModel = require('../Board');

describe('Board model', function() {

  describe('initial state', function() {
    var board = new BoardModel();

    it('has all the pieces marked as unmoved', function() {
      expect(board.filterSquares(function(square) {
        return square.info.hasMoved;
      })).toEqual([]);
    });

    it('has the lastPawnJump blank', function() {
      expect(board.lastPawnJump()).toBeUndefined();
    });

    it('has the promotingPawn blank', function() {
      expect(board.promotingPawn()).toBeUndefined();
    });
  });

  describe('clearBoard', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('removes all pieces from the board', function() {
      expect(board.filterSquares(function(square) {
        return board.isOccupied(square.position);
      })).not.toEqual([]);

      board.clearBoard();

      expect(board.filterSquares(function(square) {
        return board.isOccupied(square.position);
      })).toEqual([]);
    });
  });

  describe('placePiece', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('puts the given piece at the given position', function() {
      var piece = { piece: Pieces.ROOK, side: Pieces.sides.BLACK }

      expect(board.info('e4')).not.toEqual(piece);
      board.placePiece(piece, 'e4');
      expect(board.info('e4')).toEqual(piece);
    });
  });

  describe('removePiece', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('removes the piece at the given position', function() {
      var piece = { piece: Pieces.ROOK, side: Pieces.sides.BLACK }
      board.placePiece(piece, 'e4');

      expect(board.isOccupied('e4')).toBeTruthy();
      board.removePiece('e4');
      expect(board.isOccupied('e4')).toBeFalsy();
    });
  });

  describe('promotePawn', function() {
    var board;
    beforeEach(function() {
      board = new BoardModel();
      board.clearBoard();
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'h1');
    });

    it('changes the type of the specified pawn to the specified type', function() {
      expect(board.info('h1')).toEqual({piece: Pieces.PAWN, side: Pieces.sides.BLACK});
      board.promotePawn('h1', Pieces.QUEEN);
      expect(board.info('h1')).toEqual({piece: Pieces.QUEEN, side: Pieces.sides.BLACK});
    });

    it('clears the promotingPawn', function() {
      board.setPromotingPawn('a2');

      expect(board.promotingPawn()).toEqual('a2');
      board.promotePawn('a2', Pieces.QUEEN);
      expect(board.promotingPawn()).toBeFalsy();
    });
  });

  describe('listSquares', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('provides a list of all squares with their positions and data', function(){
      var list = board.listSquares();
      expect(list.length).toEqual(64);
      expect(list).toContain({position: 'a1', info: {piece: Pieces.ROOK, side: Pieces.sides.WHITE}});
      expect(list).toContain({position: 'h8', info: {piece: Pieces.ROOK, side: Pieces.sides.BLACK}});
    });
  });

  describe('filterSquares', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('returns a list of positions for which the given predicate is true', function(){
      expect(
        board.filterSquares(function(square) {
          return square.info.piece == Pieces.ROOK;
        }).sort()
      ).toEqual(['a1', 'a8', 'h1', 'h8']);
    });

    it('provides the position of the square and info about it to the predicate', function(){
      expect(
        board.filterSquares(function(square) {
          return square.position[0] == 'a' && square.info.piece == Pieces.ROOK
        })
      ).toEqual(['a1', 'a8']);
    });
  });

  describe('isOccupied', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    describe('for an occupied square', function() {
      it('returns true', function() {
        board.clearBoard();

        expect(board.isOccupied('c4')).toBeFalsy();
        board.placePiece({piece: Pieces.KNIGHT, side: Pieces.sides.WHITE}, 'c4');
        expect(board.isOccupied('c4')).toBeTruthy();
      });
    });
  });
});
