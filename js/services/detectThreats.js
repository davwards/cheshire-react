var movementPredicate = require('./movementPredicate');

module.exports = function detectThreats(positionToThreaten, board) {
  if(!positionToThreaten) return [];
  var squareToThreaten = board.info(positionToThreaten);

  return board.filterSquares(function(potentialThreatSquare, potentialThreatPosition) {
    if(!board.isOccupied(potentialThreatPosition)) return false;
    if(board.info(positionToThreaten).side == potentialThreatSquare.side) return false;

    var isThreatTo = movementPredicate(potentialThreatPosition, board);
    return isThreatTo(squareToThreaten, positionToThreaten);
  });
}
