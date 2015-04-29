var movementPredicate = require('./movementPredicate');

module.exports = function detectThreats(position, board) {
  if(!position) return [];
  var positionInfo = board.info(position);

  return board.filterSquares(function(threatInfo, threatPosition) {
    return (
      board.isOccupied(threatPosition) &&
      positionInfo.side != threatInfo.side &&
      movementPredicate(threatPosition, board)(positionInfo, position)
    );
  });
}
