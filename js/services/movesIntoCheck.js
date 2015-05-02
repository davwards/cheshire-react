var _ = require('lodash');

var detectThreats = require('./detectThreats');

module.exports = function movesIntoCheck(position, board) {
  return function(availableMove) {
    if(!availableMove) return false;
    var resultingBoard = board.draftMove(position, availableMove);
    var kingsPosition = resultingBoard.findKing(board.info(position).side);
    return _.any(detectThreats(kingsPosition, resultingBoard));
  };
};
