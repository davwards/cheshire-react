jest.autoMockOff();
jest.mock('../movesIntoCheck');
jest.mock('../movementPredicate');

var _ = require('lodash');

var BoardModel = require('../../models/Board');
var PossibleMoves;
var movementPredicate;
var movesIntoCheck;
var board;

describe('Possible Moves', function() {
  beforeEach(function(){
    movementPredicate = require('../movementPredicate');
    movesIntoCheck = require('../movesIntoCheck');
    PossibleMoves = require('../PossibleMoves');

    board = new BoardModel();
    board.clearBoard();
    movementPredicate.mockClear();
    movesIntoCheck.mockClear();
  });

  it('returns a map of positions to available moves that do not result in check', function() {
    // Imaginary chess piece that can only move vertically
    movementPredicate.mockImpl(function(position, board) {
      return function(destination) {
        if(destination.position[0] == position[0])
          return 'MOVE TO ' + destination.position;
      };
    });

    // Any move south results in check
    movesIntoCheck.mockImpl(function(position, board){
      return function(possibleMove) {
        return possibleMove && /([a-h][1-8])/.exec(possibleMove)[1][1] >= position[1];
      };
    });

    expect(PossibleMoves(board, 'd5')).toEqual({
      d1: 'MOVE TO d1',
      d2: 'MOVE TO d2',
      d3: 'MOVE TO d3',
      d4: 'MOVE TO d4',
    });
  });
});
