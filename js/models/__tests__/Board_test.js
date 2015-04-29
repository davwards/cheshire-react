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

    it('has all the positions marked as unselected', function() {
      expect(board.filterSquares(function(square) {
        return square.info.selected;
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
      expect(board.info(start).piece).toBeTruthy();
      board.move(start, destination);
      expect(board.info(start).piece).toBeFalsy();
    });

    it('places the piece at its new location', function(){
      var piece = board.info(start);

      expect(board.info(destination)).not.toEqual(piece);
      board.move(start, destination);
      expect(board.info(destination)).toEqual(piece);
    });

    describe('when start and destination are the same', function() {
      beforeEach(function(){
        destination = start;
      });

      it('does not destroy the piece', function(){
        expect(board.info(start).piece).toBeTruthy();
        board.move(start, destination);
        expect(board.info(start).piece).toBeTruthy();
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
      expect(board.info(selectedPosition).selected).toBeFalsy();
      board.select(selectedPosition);
      expect(board.info(selectedPosition).selected).toBeTruthy();
    });

    it('clears the previous selection', function() {
      var previousSelection = 'h8';
      expect(previousSelection).not.toEqual(selectedPosition);
      board.select(previousSelection);

      expect(board.info(previousSelection).selected).toBeTruthy();
      board.select(selectedPosition);
      expect(board.info(previousSelection).selected).toBeFalsy();
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
        return square.info.selected || square.info.possibleMove;
      })).not.toEqual([]);

      board.clearSelection();

      expect(board.filterSquares(function(square) {
        return square.info.selected || square.info.possibleMove;
      })).toEqual([]);
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
