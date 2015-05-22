jest.autoMockOff();

jest.mock('../../moves/BasicMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');

var utils = require('./MoveRuleTestUtils');

var rookMovement = require('../rookMovement');

describe('A rook', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
  });

  function expectBasicMoves(position, moveSet) {
    utils.expectMoves(rookMovement, position, board, moveSet, 'BASIC MOVE');
  };

  function expectToHaveMove(start, end) {
    utils.expectToHaveMove(rookMovement, board, start, end);
  }

  function expectNotToHaveMove(start, end) {
    utils.expectNotToHaveMove(rookMovement, board, start, end);
  }

  var whiteRook = { piece: Pieces.ROOK, side: Pieces.sides.WHITE };
  var blackRook = { piece: Pieces.ROOK, side: Pieces.sides.BLACK };

  it('can move along ranks or files', function() {
    board.placePiece(whiteRook, 'c2');
    board.placePiece(blackRook, 'e6');

    expectBasicMoves('c2', ['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2']);
    expectBasicMoves('e6', ['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6']);
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

