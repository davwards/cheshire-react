var _ = require('lodash');

var movementPredicate = require('./movementPredicate');
var movesIntoCheck = require('./movesIntoCheck');

module.exports = function PossibleMoves(board, position){
  var allAvailableMoves = board.filterSquares(movementPredicate(position, board));
  return _.reject(allAvailableMoves, movesIntoCheck(board, position));
};
