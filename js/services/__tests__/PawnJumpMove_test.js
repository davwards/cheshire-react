jest.autoMockOff();

var _ = require('lodash');
var PawnJumpMove = require('../PawnJumpMove');
var BoardModel = require('../../models/Board');

describe('PawnJumpMove', function(){
  var board, start, end, executeMove;
  beforeEach(function(){
    board = new BoardModel();
    start = 'b2';
    end = 'b4';
    executeMove = PawnJumpMove(start, end);
  });

  it('moves the pawn to the destination square', function(){
    expect(board.isOccupied(start)).toBeTruthy();
    expect(board.isOccupied(end)).toBeFalsy();
    executeMove(board);
    expect(board.isOccupied(start)).toBeFalsy();
    expect(board.isOccupied(end)).toBeTruthy();
  });

  it.only('sets the lastPawnJump on the board', function(){
    expect(board.lastPawnJump()).toBeUndefined();
    executeMove(board);
    expect(board.lastPawnJump()).toEqual(end);
  });
});

