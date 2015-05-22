jest.autoMockOff();

jest.mock('../../moves/BasicMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');

var utils = require('./MoveRuleTestUtils');

var bishopMovement = require('../bishopMovement');

describe('A bishop', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
  });

  function expectBasicMoves(position, moveSet) {
    utils.expectMoves(bishopMovement, position, board, moveSet, 'BASIC MOVE');
  };

  function expectToHaveMove(start, end) {
    utils.expectToHaveMove(bishopMovement, board, start, end);
  }

  function expectNotToHaveMove(start, end) {
    utils.expectNotToHaveMove(bishopMovement, board, start, end);
  }

  var whiteBishop = { piece: Pieces.BISHOP, side: Pieces.sides.WHITE };
  var blackBishop = { piece: Pieces.BISHOP, side: Pieces.sides.BLACK };

  it('can move diagonally', function() {
    board.placePiece(whiteBishop, 'c2');
    board.placePiece(blackBishop, 'e6');

    expectBasicMoves('c2', ['a4', 'b1', 'b3', 'd1', 'd3', 'e4', 'f5', 'g6', 'h7']);
    expectBasicMoves('e6', ['f7', 'g8', 'f5', 'g4', 'h3', 'd7', 'c8', 'd5', 'c4', 'b3', 'a2']);
  });

  it('can capture opposing but not allied pieces', function() {
    board.placePiece(whiteBishop, 'c2');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd3');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'a4');

    expectToHaveMove('c2', 'd3');
    expectNotToHaveMove('c2', 'a4');

    board.placePiece(blackBishop, 'e6');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'h3');

    expectToHaveMove('e6', 'f7');
    expectNotToHaveMove('e6', 'h3');
  });

  it('cannot move past obstacles', function() {
    board.placePiece(blackBishop, 'e6');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'd7');

    expectNotToHaveMove('e6', 'g8');
    expectNotToHaveMove('e6', 'c8');
  });
});
