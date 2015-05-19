jest.autoMockOff();

var Pieces = require('../../constants/Pieces');
var Game = require('../../constants/Game');
var BoardModel = require('../../models/Board');

var _ = require('lodash');

var gameOver = require('../gameOver');

describe('gameOver', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();
  });

  describe('for a checkmate position', function() {
    beforeEach(function() {
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'd1');
      board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.BLACK}, 'd2');
      board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');
    });

    it('returns CHECKMATE', function() {
      expect(gameOver(board, Pieces.sides.WHITE)).toEqual(Game.CHECKMATE);
    });
  });

  describe('when the game is not over', function() {
    beforeEach(function() {
      board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'd1');
      board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.WHITE}, 'd2');

      board.placePiece({piece: Pieces.KING, side: Pieces.sides.BLACK}, 'e6');
      board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.BLACK}, 'e7');
    });

    it('returns CONTINUE', function() {
      expect(gameOver(board, Pieces.sides.WHITE)).toEqual(Game.CONTINUE);
    });
  });
});
