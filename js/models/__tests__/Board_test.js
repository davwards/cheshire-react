jest.autoMockOff();

var _ = require('lodash');

var Pieces = require('../../constants/Pieces');

var BoardModel = require('../Board');

describe('Board model', function() {

  describe('initial state', function() {
    var board = new BoardModel();

    it('has all the pieces marked as unmoved', function() {
      expect(board.filterSquares(function(square) {
        return square.hasMoved;
      })).toEqual([]);
    });

    it('has all the positions marked as unselected', function() {
      expect(board.filterSquares(function(square) {
        return square.selected;
      })).toEqual([]);
    });
  });

  describe('moving pieces', function(){
    var board, start, destination;
    beforeEach(function(){
      board = new BoardModel();
      start = 'b1';
      destination = 'c1';
    });

    it('removes the piece from the starting postion', function(){
      expect(board.position(start).piece).toBeTruthy();
      board.move(start, destination);
      expect(board.position(start).piece).toBeFalsy();
    });

    it('places the piece at its new location', function(){
      var piece = board.position(start);

      expect(board.position(destination)).not.toEqual(piece);
      board.move(start, destination);
      expect(board.position(destination)).toEqual(piece);
    });

    describe('when start and destination are the same', function() {
      beforeEach(function(){
        destination = start;
      });

      it('does not destroy the piece', function(){
        expect(board.position(start).piece).toBeTruthy();
        board.move(start, destination);
        expect(board.position(start).piece).toBeTruthy();
      });
    });
  });

  describe('setting selection', function() {
    var board, selectedPosition;
    beforeEach(function(){
      board = new BoardModel();
      selectedPosition = 'a1';
    });

    it('sets the given position as selected', function() {
      expect(board.position(selectedPosition).selected).toBeFalsy();
      board.select(selectedPosition);
      expect(board.position(selectedPosition).selected).toBeTruthy();
    });

    it('clears the previous selection', function() {
      var previousSelection = 'h8';
      expect(previousSelection).not.toEqual(selectedPosition);
      board.select(previousSelection);

      expect(board.position(previousSelection).selected).toBeTruthy();
      board.select(selectedPosition);
      expect(board.position(previousSelection).selected).toBeFalsy();
    });
  });

  describe('clearSelection', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('unmarks any selected and possible move squares', function() {
      board.select('a4');
      board.setPossibleMove('c1');
      board.setPossibleMove('d8');

      expect(board.filterSquares(function(square) {
        return square.selected || square.possibleMove;
      })).not.toEqual([]);

      board.clearSelection();

      expect(board.filterSquares(function(square) {
        return square.selected || square.possibleMove;
      })).toEqual([]);
    });
  });

  describe('clearBoard', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('removes all pieces from the board', function() {
      expect(board.filterSquares(function(square, position) {
        return board.isOccupied(position);
      })).not.toEqual([]);

      board.clearBoard();

      expect(board.filterSquares(function(square, position) {
        return board.isOccupied(position);
      })).toEqual([]);
    });
  });

  describe('placePiece', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('puts the given piece at the given position', function() {
      var piece = { piece: Pieces.ROOK, side: Pieces.sides.BLACK }

      expect(board.position('e4')).not.toEqual(piece);
      board.placePiece(piece, 'e4');
      expect(board.position('e4')).toEqual(piece);
    });
  });

  describe('filterSquares', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('returns a list of positions for which the given predicate is true', function(){
      expect(
        board.filterSquares(function(square) {
          return square.piece == Pieces.ROOK;
        }).sort()
      ).toEqual(['a1', 'a8', 'h1', 'h8']);
    });

    it('provides the position of the square to the predicate', function(){
      expect(
        board.filterSquares(function(square, position) {
          return position[0] == 'a' && parseInt(position[1]) < 4;
        })
      ).toEqual(['a1', 'a2', 'a3']);
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
