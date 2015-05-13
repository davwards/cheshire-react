jest.autoMockOff();

var _ = require('lodash');
var PawnPromotionMove = require('../PawnPromotionMove');
var Pieces = require('../../constants/Pieces');
var BoardModel = require('../../models/Board');

describe('PawnPromotionMove', function(){
  var board, start, destination, executeMove;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();
    start = 'b7';
    destination = 'b8';
    board.placePiece({piece: Pieces.PAWN, side: Pieces.sides.WHITE}, start);
    executeMove = PawnPromotionMove(start, destination);
  });

  it('moves the pawn to the destination square', function(){
    expect(board.isOccupied(start)).toBeTruthy();
    expect(board.isOccupied(destination)).toBeFalsy();

    executeMove(board);

    expect(board.isOccupied(start)).toBeFalsy();
    expect(board.isOccupied(destination)).toBeTruthy();
  });

  it('flags the promoting pawn on the board', function(){
    expect(board.promotingPawn()).toBeFalsy();

    executeMove(board);

    expect(board.promotingPawn()).toEqual('b8');
  });

  it('clears the board\'s lastPawnJump', function() {
    board.setLastPawnJump('h4');
    executeMove(board);
    expect(board.lastPawnJump()).toBeUndefined();
  });
});

