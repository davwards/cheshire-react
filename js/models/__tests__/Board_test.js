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
      expect(_.all(board.rank('b'), function(square) { return square.piece == Pieces.WHITE_PAWN; })).toBeTruthy();
      expect(_.all(board.rank('a'), function(square) { return square.side == 'white'; })).toBeTruthy();
      expect(_.all(board.rank('b'), function(square) { return square.side == 'white'; })).toBeTruthy();

      expect(_.all(board.rank('c'), function(square) { return square.piece == ''; })).toBeTruthy();
      expect(_.all(board.rank('d'), function(square) { return square.piece == ''; })).toBeTruthy();
      expect(_.all(board.rank('e'), function(square) { return square.piece == ''; })).toBeTruthy();
      expect(_.all(board.rank('f'), function(square) { return square.piece == ''; })).toBeTruthy();

      expect(_.all(board.rank('g'), function(square) { return square.piece == Pieces.BLACK_PAWN; })).toBeTruthy();
      expect(board.position('h1').piece).toEqual(Pieces.BLACK_ROOK);
      expect(board.position('h2').piece).toEqual(Pieces.BLACK_KNIGHT);
      expect(board.position('h3').piece).toEqual(Pieces.BLACK_BISHOP);
      expect(board.position('h4').piece).toEqual(Pieces.BLACK_QUEEN);
      expect(board.position('h5').piece).toEqual(Pieces.BLACK_KING);
      expect(board.position('h6').piece).toEqual(Pieces.BLACK_BISHOP);
      expect(board.position('h7').piece).toEqual(Pieces.BLACK_KNIGHT);
      expect(board.position('h8').piece).toEqual(Pieces.BLACK_ROOK);
      expect(_.all(board.rank('g'), function(square) { return square.side == 'black'; })).toBeTruthy();
      expect(_.all(board.rank('h'), function(square) { return square.side == 'black'; })).toBeTruthy();
    });

    it('has all the pieces marked as unmoved', function() {
      expect(_.all(board.ranks, function(rank){
        return _.all(rank, function(square) {
          return !square.hasMoved
        });
      })).toBeTruthy();
    });

    it('has all the positions marked as unselected', function() {
      expect(_.all(board.ranks, function(rank){
        return _.all(rank, function(square) {
          return !square.selected
        });
      })).toBeTruthy();
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

      expect(_.any(board.ranks, function(rank) {
        return _.any(rank, function(square) {
          return square.selected || square.possibleMove;
        });
      })).toBeTruthy();

      board.clearSelection();

      expect(_.any(board.ranks, function(rank) {
        return _.any(rank, function(square) {
          return square.selected || square.possibleMove;
        });
      })).toBeFalsy();
    });
  });

  describe('clearBoard', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('removes all pieces from the board', function() {
      expect(_.any(board.ranks, function(rank) {
        return _.any(rank, function(square) { return square.piece; });
      })).toBeTruthy();

      board.clearBoard();

      expect(_.any(board.ranks, function(rank) {
        return _.any(rank, function(square) { return square.piece; });
      })).toBeFalsy();
    });
  });

  describe('placePiece', function() {
    var board;
    beforeEach(function() { board = new BoardModel(); });

    it('puts the given piece at the given position', function() {
      var piece = { piece: Pieces.BLACK_ROOK, side: 'black' }

      expect(board.position('e4')).not.toEqual(piece);
      board.placePiece(piece, 'e4');
      expect(board.position('e4')).toEqual(piece);
    });
  });
});
