var BasicMove = require('./BasicMove');

module.exports = function(start, end) {
  return function(board) {
    board.setPromotingPawn(end);
    BasicMove(start, end)(board);
  };
};
