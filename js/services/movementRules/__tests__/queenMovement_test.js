jest.autoMockOff();

jest.mock('../../moves/BasicMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');

var utils = require('./MoveRuleTestUtils');

var queenMovement = require('../queenMovement');

describe('A queen', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
  });

  function expectBasicMoves(position, moveSet) {
    utils.expectMoves(queenMovement, position, board, moveSet, 'BASIC MOVE');
  };

  function expectToHaveMove(start, end) {
    utils.expectToHaveMove(queenMovement, board, start, end);
  }

  function expectNotToHaveMove(start, end) {
    utils.expectNotToHaveMove(queenMovement, board, start, end);
  }

  var whiteQueen = { piece: Pieces.QUEEN, side: Pieces.sides.WHITE };
  var blackQueen = { piece: Pieces.QUEEN, side: Pieces.sides.BLACK };

  it('can move diagonally, horizontally, or vertically', function() {
    board.placePiece(whiteQueen, 'c2');
    board.placePiece(blackQueen, 'e6');

    expectBasicMoves('c2', ['a2', 'b2', 'c1', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd2', 'e2', 'f2', 'g2', 'h2', 'a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7']);
    expectBasicMoves('e6', ['a6', 'b6', 'c6', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8', 'f6', 'g6', 'h6', 'f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2']);
  });

  it('can capture opposing but not allied pieces', function() {
    board.placePiece(whiteQueen, 'c2');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c4');

    expectToHaveMove('c2', 'd3');
    expectNotToHaveMove('c2', 'c4');

    board.placePiece(blackQueen, 'e6');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'e3');

    expectToHaveMove('e6', 'f7');
    expectNotToHaveMove('e6', 'e3');
  });

  it('cannot move past obstacles', function() {
    board.placePiece(blackQueen, 'e6');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd6');

    expectNotToHaveMove('e6', 'g8');
    expectNotToHaveMove('e6', 'c6');
  });
});
