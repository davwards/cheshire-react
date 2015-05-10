var movementPredicate = require('./movementPredicate');

module.exports = function detectThreats(position, board, alliedSide) {
  if(!position) return [];
  var positionInfo = board.info(position);
  if(!alliedSide) alliedSide = positionInfo.side;

  return board.filterSquares(function(threat) {
    return (
      board.isOccupied(threat.position) &&
      alliedSide != threat.info.side &&
      movementPredicate(threat.position, board)({info: positionInfo, position: position})
    );
  });
}
