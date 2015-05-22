jest.autoMockOff();

jest.mock('../../moves/BasicMove');
jest.mock('../../moves/CastleMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');
var CastleMove = require('../../moves/CastleMove');

var kingMovement = require('../kingMovement');

describe('A king', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
    CastleMove.mockImpl(function(start, dest) { return 'CASTLE MOVE'; });
  });

  function expectMoves(position, moveSet, moveType) {
    expect(
      _.chain(board.listSquares())
        .select(function(square) {
          return kingMovement(position, board)(square) == moveType; })
        .map(function(square) {
          return square.position; })
        .value().sort()
    ).toEqual(moveSet.sort());
  }

  function expectBasicMoves(position, moveSet)    { expectMoves(position, moveSet, 'BASIC MOVE'); };
  function expectCastleMoves(position, moveSet)   { expectMoves(position, moveSet, 'CASTLE MOVE'); };

  function expectToHaveMove(start, end) {
    expect(kingMovement(start, board)({info: board.info(end), position: end})).toBeTruthy();
  }

  function expectNotToHaveMove(start, end) {
    expect(kingMovement(start, board)({info: board.info(end), position: end})).toBeFalsy();
  }

  var whiteKing = { piece: Pieces.KING, side: Pieces.sides.WHITE };

  it('can move one step in any direction', function() {
    board.placePiece(whiteKing, 'c2');
    expectBasicMoves('c2', ['b1', 'b2', 'b3', 'c1', 'c3', 'd1', 'd2', 'd3']);
  });

  it('can capture opposing but not allied pieces', function() {
    board.placePiece(whiteKing, 'c2');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'b2');

    expectToHaveMove('c2', 'd3');
    expectNotToHaveMove('c2', 'b2');
  });

  describe('that meets the criteria for castling', function() {
    var rook1, rook2;

    beforeEach(function() {
      whiteKing.hasMoved = false;
      rook1 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      rook2 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(rook1, 'h1');
      board.placePiece(rook2, 'a1');
    });

    it('can castle', function() {
      expectCastleMoves('e1', ['g1', 'c1']);
    });
  });

  describe('that has moved', function() {
    var rook1, rook2;

    beforeEach(function() {
      whiteKing.hasMoved = true;
      rook1 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      rook2 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(rook1, 'h1');
      board.placePiece(rook2, 'a1');
    });

    it('cannot castle', function() {
      expectCastleMoves('e1', []);
    });
  });

  describe('with a rook that has moved', function() {
    var rook1, rook2;

    beforeEach(function() {
      whiteKing.hasMoved = false;
      rook1 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: true };
      rook2 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(rook1, 'h1');
      board.placePiece(rook2, 'a1');
    });

    it('cannot castle', function() {
      expectCastleMoves('e1', ['c1']);
    });
  });

  describe('that is in check', function() {
    var allyRook, enemyRook;

    beforeEach(function() {
      whiteKing.hasMoved = false;
      allyRook = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      enemyRook = { piece: Pieces.ROOK, side: Pieces.sides.BLACK, hasMoved: true };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(allyRook, 'h1');
      board.placePiece(enemyRook, 'e4');
    });

    it('cannot castle', function() {
      expectCastleMoves('e1', []);
    });
  });

  describe('that has another piece between itself and the rook', function() {
    var rook1, rook2, alliedBlocker, enemyBlocker;

    beforeEach(function() {
      whiteKing.hasMoved = false;
      rook1 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      rook2 = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      alliedBlocker = { piece: Pieces.BISHOP, side: Pieces.sides.WHITE, hasMoved: false };
      enemyBlocker = { piece: Pieces.BISHOP, side: Pieces.sides.BLACK, hasMoved: false };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(rook1, 'h1');
      board.placePiece(rook2, 'a1');
      board.placePiece(alliedBlocker, 'f1');
      board.placePiece(enemyBlocker, 'b1');
    });

    it('cannot castle', function() {
      expectCastleMoves('e1', []);
    });
  });

  describe('when castling would require moving through check', function() {
    var allyRook, enemyRook;

    beforeEach(function() {
      whiteKing.hasMoved = false;
      allyRook = { piece: Pieces.ROOK, side: Pieces.sides.WHITE, hasMoved: false };
      enemyRook = { piece: Pieces.ROOK, side: Pieces.sides.BLACK, hasMoved: true };

      board.placePiece(whiteKing, 'e1');
      board.placePiece(allyRook, 'h1');
      board.placePiece(enemyRook, 'f4');
    });

    it('cannot castle', function() {
      expectCastleMoves('e1', []);
    });
  });
});

