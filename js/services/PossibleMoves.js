var _ = require('lodash');

var Pieces = require('../constants/Pieces');
var utils = require('./MovementUtils');
var movementPredicate = require('./movementPredicate');

module.exports = function PossibleMoves(board, position){
  var allAvailableMoves = board.filterSquares(movementPredicate(position, board));
  return _.reject(allAvailableMoves, movesIntoCheck(board, position));
};

function detectThreats(positionToThreaten, board) {
  if(!positionToThreaten) return [];
  var squareToThreaten = board.position(positionToThreaten);

  return board.filterSquares(function(potentialThreatSquare, potentialThreatPosition) {
    if(!board.isOccupied(potentialThreatPosition)) return false;
    if(board.position(positionToThreaten).side == potentialThreatSquare.side) return false;

    var isThreatTo = pieceTypePredicates[potentialThreatSquare.piece](potentialThreatPosition, board);
    return isThreatTo(squareToThreaten, positionToThreaten);
  });
}

function movesIntoCheck(board, position) {
  return function(availableMove) {
    var resultingBoard = board.draftMove(position, availableMove);
    var kingsPosition = resultingBoard.findKing(board.position(position).side);
    return _.any(detectThreats(kingsPosition, resultingBoard));
  };
}
