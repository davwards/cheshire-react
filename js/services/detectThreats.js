var movementPredicate = require('./movementPredicate');

module.exports = function detectThreats(position, board) {
  if(!position) return [];
  var positionInfo = board.info(position);

  return board.filterSquares(function(threat) {
    return (
      board.isOccupied(threat.position) &&
      positionInfo.side != threat.info.side &&
      movementPredicate(threat.position, board)({info: positionInfo, position: position})
    );
  });
}
