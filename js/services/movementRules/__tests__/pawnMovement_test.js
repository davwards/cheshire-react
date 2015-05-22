jest.autoMockOff();

jest.mock('../../moves/BasicMove');
jest.mock('../../moves/PawnJumpMove');
jest.mock('../../moves/EnPassantMove');
jest.mock('../../moves/PawnPromotionMove');

var _ = require('lodash');

var Pieces = require('../../../constants/Pieces');
var BoardModel = require('../../../models/Board');
var BasicMove = require('../../moves/BasicMove');
var PawnJumpMove = require('../../moves/PawnJumpMove');
var EnPassantMove = require('../../moves/EnPassantMove');
var PawnPromotionMove = require('../../moves/PawnPromotionMove');

var pawnMovement = require('../pawnMovement');

describe('A pawn', function() {

  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    BasicMove.mockImpl(function(start, dest) { return 'BASIC MOVE'; });
    PawnJumpMove.mockImpl(function(start, dest) { return 'PAWN JUMP MOVE'; });
    EnPassantMove.mockImpl(function(start, dest) { return 'EN PASSANT MOVE'; });
    PawnPromotionMove.mockImpl(function(start, dest) { return 'PAWN PROMOTION MOVE'; });
  });

  function expectMoves(rule, position, moveSet, moveType) {
    expect(
      _.chain(board.listSquares())
        .select(function(square) {
          return rule(position, board)(square) == moveType; })
        .map(function(square) {
          return square.position; })
        .value().sort()
    ).toEqual(moveSet.sort());
  }

  function expectToHaveMove(start, end) {
    expect(pawnMovement(start, board)({info: board.info(end), position: end})).toBeTruthy();
  }

  function expectNotToHaveMove(start, end) {
    expect(pawnMovement(start, board)({info: board.info(end), position: end})).toBeFalsy();
  }

  function expectBasicMoves(position, moveSet) {
    expectMoves(pawnMovement, position, moveSet, 'BASIC MOVE');
  };

  function expectPawnJumpMoves(position, moveSet) {
    expectMoves(pawnMovement, position, moveSet, 'PAWN JUMP MOVE');
  }

  function expectEnPassantMoves(position, moveSet) {
    expectMoves(pawnMovement, position, moveSet, 'EN PASSANT MOVE');
  }

  function expectPawnPromotionMoves(position, moveSet) {
    expectMoves(pawnMovement, position, moveSet, 'PAWN PROMOTION MOVE');
  }

  var whitePawn1 = { piece: Pieces.PAWN, side: Pieces.sides.WHITE };
  var blackPawn1 = { piece: Pieces.PAWN, side: Pieces.sides.BLACK };
  var whitePawn2 = { piece: Pieces.PAWN, side: Pieces.sides.WHITE };
  var blackPawn2 = { piece: Pieces.PAWN, side: Pieces.sides.BLACK };

  describe('on its side\'s second file', function() {
    beforeEach(function() {
      board.placePiece(whitePawn1, 'b2');
      board.placePiece(blackPawn1, 'g7');
      board.placePiece(whitePawn2, 'd2');
      board.placePiece(blackPawn2, 'e7');
    });

    it('can move one or two spaces toward the opponent\'s side', function() {
      expectBasicMoves('b2', ['b3']);
      expectPawnJumpMoves('b2', ['b4']);

      expectBasicMoves('g7', ['g6']);
      expectPawnJumpMoves('g7', ['g5']);

      expectBasicMoves('d2', ['d3']);
      expectPawnJumpMoves('d2', ['d4']);

      expectBasicMoves('e7', ['e6']);
      expectPawnJumpMoves('e7', ['e5']);
    });

    describe('that is blocked by other pieces', function() {
      beforeEach(function(){
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'b3');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'g6');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, 'd4');
        board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e5');
      });

      it('cannot move through obstacles', function() {
        expectBasicMoves('b2', []);
        expectBasicMoves('g7', []);
        expectBasicMoves('d2', ['d3']);
        expectBasicMoves('e7', ['e6']);
      });
    });
  });

  describe('not on its side\'s second file', function() {
    beforeEach(function() {
      board.placePiece(whitePawn1, 'b3');
      board.placePiece(blackPawn1, 'g6');
      board.placePiece(whitePawn2, 'd3');
      board.placePiece(blackPawn2, 'e6');
    });

    it('can move one space toward the opponent\'s side', function() {
      expectBasicMoves('b3', ['b4']);
      expectBasicMoves('g6', ['g5']);
      expectBasicMoves('d3', ['d4']);
      expectBasicMoves('e6', ['e5']);
    });
  });

  describe('that has an opportunity to capture', function() {
    beforeEach(function(){
      board.placePiece(blackPawn1, 'e5');
      board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'd4');
      board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'e4');
      board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, 'f4');
    });

    it('can move to capture enemy pieces', function() {
      expectBasicMoves('e5', ['d4', 'f4']);
    });
  });

  describe('with an en passant opportunity', function() {
    beforeEach(function(){
      board.setLastPawnJump('e4');
      board.placePiece(blackPawn1, 'd4');
      board.placePiece(whitePawn1, 'e4');
    });

    it('can capture en passant', function() {
      expectEnPassantMoves('d4', ['e3']);
    });
  });

  describe('with an opportunity to promote', function() {
    beforeEach(function(){
      board.placePiece(blackPawn1, 'd2');
      board.placePiece(whitePawn1, 'e7');

      board.placePiece(blackPawn2, 'h2');
      board.placePiece(whitePawn2, 'h7');
      board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.WHITE}, 'h1');
      board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'g8');
    });

    it('can promote', function() {
      expectPawnPromotionMoves('d2', ['d1']);
      expectPawnPromotionMoves('e7', ['e8']);
    });

    it('does not consider the moves to be BasicMoves', function() {
      expectBasicMoves('d2', []);
      expectBasicMoves('e7', []);
    });

    it('cannot promote when blocked', function() {
      expectPawnPromotionMoves('h2', []);
    });

    it('can promote while capturing', function() {
      expectPawnPromotionMoves('h7', ['h8', 'g8']);
    });
  });
});

