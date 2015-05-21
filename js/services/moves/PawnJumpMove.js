var BasicMove = require('./BasicMove');

module.exports = function(start, end) {
  return function(board) {
    BasicMove(start, end)(board);
    board.setLastPawnJump(end);
  };
};
