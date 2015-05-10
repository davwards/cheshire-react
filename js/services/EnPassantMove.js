var BasicMove = require('./BasicMove');

module.exports = function(start, end) {
  return function(board) {
    board.removePiece(end[0] + start[1]);
    BasicMove(start, end)(board);
  };
};
