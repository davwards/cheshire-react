var _ = require('lodash');

var Pieces = require('../constants/Pieces');
var utils = require('./MovementUtils');
var movementPredicate = require('./movementPredicate');
var detectThreats = require('./detectThreats');

module.exports = function PossibleMoves(board, position){
  var allAvailableMoves = board.filterSquares(movementPredicate(position, board));
  return _.reject(allAvailableMoves, movesIntoCheck(board, position));
};

function movesIntoCheck(board, position) {
  return function(availableMove) {
    var resultingBoard = board.draftMove(position, availableMove);
    var kingsPosition = resultingBoard.findKing(board.position(position).side);
    return _.any(detectThreats(kingsPosition, resultingBoard));
  };
}
