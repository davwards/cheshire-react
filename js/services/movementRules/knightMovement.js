var utils = require('./MovementUtils');
var BasicMove = require('../moves/BasicMove');

module.exports = function knightMovement(position, board) {
  return function(candidate) {
    if(board.info(position).side == candidate.info.side) return false;

    var distance = utils.getDistance(candidate.position, position);

    if(Math.abs(distance.file * distance.rank) == 2)
      return BasicMove(position, candidate.position);
  }
};
