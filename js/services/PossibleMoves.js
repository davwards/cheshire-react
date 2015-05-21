var _ = require('lodash');

var movementPredicate = require('./movementPredicate');
var movesIntoCheck = require('./movesIntoCheck');

module.exports = function PossibleMoves(board, position){
  var moveTo = movementPredicate(position, board);

  var allAvailableMoves = _.reduce(board.listSquares(), function(moveMap, destination){
    moveMap[destination.position] = moveTo(destination);
    return moveMap;
  }, {});

  return _.omit(
    allAvailableMoves, movesIntoCheck(position, board)
  );
};
