var BasicMove = require('../moves/BasicMove');

module.exports = function linePiece(position, board, findClearPath) {
  return function(candidate) {
    if(
      candidate.position != position &&
      board.info(position).side != candidate.info.side &&
      findClearPath(position, candidate.position, board)
    ) return BasicMove(position, candidate.position);
  };
};

