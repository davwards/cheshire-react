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

  it('returns available moves that do not result in check', function() {
    // Imaginary chess piece that can only move vertically
    movementPredicate.mockImpl(function(position, board) {
      return function(destinationInfo, destinationPosition) {
        return destinationPosition[0] == position[0];
      };
    });

    // Any move south results in check
    movesIntoCheck.mockImpl(function(board, position){
      return function(possibleMove) {
        return possibleMove[1] >= position[1];
      };
    });

    expect(PossibleMoves(board, 'd5').sort()).toEqual(['d1','d2','d3','d4']);
  });
});

function matchingSet(array1, array2) {
  return _.isEmpty(_.xor(array1, array2));
}
