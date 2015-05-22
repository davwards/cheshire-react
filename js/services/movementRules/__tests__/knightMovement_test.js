jest.autoMockOff();

jest.mock('../../moves/BasicMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');

var utils = require('./MoveRuleTestUtils');

var knightMovement = require('../knightMovement');

describe('A knight', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
  });

  function expectBasicMoves(position, moveSet) {
    utils.expectMoves(knightMovement, position, board, moveSet, 'BASIC MOVE');
  }

  var whiteKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.WHITE };
  var blackKnight = { piece: Pieces.KNIGHT, side: Pieces.sides.BLACK };

  it('can move in an L-shape', function() {
    board.placePiece(whiteKnight, 'c2');
    board.placePiece(blackKnight, 'e6');

    expectBasicMoves('c2', ['a1', 'a3', 'b4', 'd4', 'e1', 'e3']);
    expectBasicMoves('e6', ['c5', 'c7', 'd4', 'd8', 'f4', 'f8', 'g5', 'g7']);
  });

  it('can capture opposing but not allied pieces', function() {
    board.placePiece(whiteKnight, 'c2');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'a1');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'b4');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'd4');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'e3');

    board.placePiece(blackKnight, 'e6');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c5');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, 'c7');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'f8');
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.BLACK}, 'g5');

    expectBasicMoves('c2', ['a1', 'a3', 'b4', 'e1']);
    expectBasicMoves('e6', ['c5', 'c7', 'd4', 'd8', 'f4', 'g7']);
  });
});

