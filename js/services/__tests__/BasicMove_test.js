jest.autoMockOff();

var _ = require('lodash');
var BasicMove = require('../BasicMove');
var BoardModel = require('../../models/Board');

describe('BasicMove', function(){
  var board, start, destination, executeMove;
  beforeEach(function(){
    board = new BoardModel();
    start = 'b1';
    destination = 'c1';
    executeMove = BasicMove(start, destination);
  });

  it('removes the piece from the starting postion', function(){
    expect(board.isOccupied(start)).toBeTruthy();
    executeMove(board);
    expect(board.isOccupied(start)).toBeFalsy();
  });

  it('places the piece at its new location, marked as moved', function(){
    var piece = board.info(start);

    expect(board.info(destination)).not.toEqual(piece);
    executeMove(board);
    expect(board.info(destination)).toEqual(_.merge(piece, {hasMoved: true}));
  });

  it('clears the board\'s lastPawnJump', function() {
    board.setLastPawnJump('h4');
    executeMove(board);
    expect(board.lastPawnJump()).toBeUndefined();
  });

  describe('when start and destination are the same', function() {
    beforeEach(function(){
      executeMove = BasicMove(start, start);
    });

    it('does not destroy the piece', function(){
      expect(board.isOccupied(start)).toBeTruthy();
      executeMove(board);
      expect(board.isOccupied(start)).toBeTruthy();
    });
  });
});

