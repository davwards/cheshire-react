jest.autoMockOff();

var _ = require('lodash');
var EnPassantMove = require('../EnPassantMove');
var BoardModel = require('../../models/Board');
var Pieces = require('../../constants/Pieces');

describe('EnPassantMove', function(){
  var board, start, end, executeMove;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();

    start = 'd4';
    end = 'e3';
    capturePosition = 'e4';

    board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.BLACK }, start);
    board.placePiece({ piece: Pieces.PAWN, side: Pieces.sides.WHITE }, capturePosition);
    board.lastPawnJump = 'e4';

    executeMove = EnPassantMove(start, end);
  });

  it('moves the capturing piece', function(){
    expect(board.isOccupied(start)).toBeTruthy();
    expect(board.isOccupied(end)).toBeFalsy();
    executeMove(board);
    expect(board.isOccupied(start)).toBeFalsy();
    expect(board.isOccupied(end)).toBeTruthy();
  });

  it('removes the captured piece', function(){
    expect(board.isOccupied(capturePosition)).toBeTruthy();
    executeMove(board);
    expect(board.isOccupied(capturePosition)).toBeFalsy();
  });

  it('clears the board\'s lastPawnJump', function() {
    board.lastPawnJump = 'h4';
    executeMove(board);
    expect(board.lastPawnJump).toBeUndefined();
  });
});

