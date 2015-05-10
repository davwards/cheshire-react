jest.autoMockOff();

var _ = require('lodash');
var Pieces = require('../../constants/Pieces');
var BoardModel = require('../../models/Board');
var CastleMove = require('../CastleMove');

describe('CastleMove', function() {
  var board, king, rook;
  beforeEach(function() { board = new BoardModel(); board.clearBoard(); });

  describe('for a black king-side castle', function() {
    beforeEach(function() {
      king = {piece: Pieces.KING, side: Pieces.sides.BLACK};
      rook = {piece: Pieces.ROOK, side: Pieces.sides.BLACK};
      board.placePiece(king, 'e8');
      board.placePiece(rook, 'h8');
    });

    it('moves the king and rook to the correct positions, marked as moved', function(){
      expect(board.info('e8')).toEqual(king);
      expect(board.isOccupied('f8')).toBeFalsy();
      expect(board.isOccupied('g8')).toBeFalsy();
      expect(board.info('h8')).toEqual(rook);

      CastleMove('e8', 'g8')(board);

      expect(board.isOccupied('e8')).toBeFalsy();
      expect(board.info('f8')).toEqual(_.merge(rook, {hasMoved: true}));
      expect(board.info('g8')).toEqual(_.merge(king, {hasMoved: true}));
      expect(board.isOccupied('h8')).toBeFalsy();
    });

    it('clears the board\'s lastPawnJump', function() {
      board.lastPawnJump = 'h4';
      CastleMove('e8', 'g8')(board);
      expect(board.lastPawnJump).toBeUndefined();
    });
  });

  describe('for a white king-side castle', function() {
    beforeEach(function() {
      king = {piece: Pieces.KING, side: Pieces.sides.WHITE};
      rook = {piece: Pieces.ROOK, side: Pieces.sides.WHITE};
      board.placePiece(king, 'e1');
      board.placePiece(rook, 'h1');
    });

    it('moves the king and rook to the correct positions', function(){
      expect(board.info('e1')).toEqual(king);
      expect(board.isOccupied('f1')).toBeFalsy();
      expect(board.isOccupied('g1')).toBeFalsy();
      expect(board.info('h1')).toEqual(rook);

      CastleMove('e1', 'g1')(board);

      expect(board.isOccupied('e1')).toBeFalsy();
      expect(board.info('f1')).toEqual(_.merge(rook, {hasMoved: true}));
      expect(board.info('g1')).toEqual(_.merge(king, {hasMoved: true}));
      expect(board.isOccupied('h1')).toBeFalsy();
    });

    it('clears the board\'s lastPawnJump', function() {
      board.lastPawnJump = 'h4';
      CastleMove('e1', 'g1')(board);
      expect(board.lastPawnJump).toBeUndefined();
    });
  });

  describe('for a black queen-side castle', function() {
    beforeEach(function() {
      king = {piece: Pieces.KING, side: Pieces.sides.BLACK};
      rook = {piece: Pieces.ROOK, side: Pieces.sides.BLACK};
      board.placePiece(king, 'e8');
      board.placePiece(rook, 'a8');
    });

    it('moves the king and rook to the correct positions', function(){
      expect(board.info('e8')).toEqual(king);
      expect(board.isOccupied('d8')).toBeFalsy();
      expect(board.isOccupied('c8')).toBeFalsy();
      expect(board.isOccupied('b8')).toBeFalsy();
      expect(board.info('a8')).toEqual(rook);

      CastleMove('e8', 'c8')(board);

      expect(board.isOccupied('e8')).toBeFalsy();
      expect(board.info('d8')).toEqual(_.merge(rook, {hasMoved: true}));
      expect(board.info('c8')).toEqual(_.merge(king, {hasMoved: true}));
      expect(board.isOccupied('b8')).toBeFalsy();
      expect(board.isOccupied('a8')).toBeFalsy();
    });

    it('clears the board\'s lastPawnJump', function() {
      board.lastPawnJump = 'h4';
      CastleMove('e8', 'c8')(board);
      expect(board.lastPawnJump).toBeUndefined();
    });
  });
});
