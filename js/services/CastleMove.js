var BasicMove = require('./BasicMove');

module.exports = function(start, destination){
  return function(board) {
    BasicMove(start, destination)(board);
    destination[0] > start[0] ?
      BasicMove('h' + start[1], 'f' + start[1])(board):
      BasicMove('a' + start[1], 'd' + start[1])(board);
  };
};
