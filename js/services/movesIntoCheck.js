var _ = require('lodash');

var detectThreats = require('./detectThreats');

module.exports = function movesIntoCheck(board, position) {
  return function(availableMove) {
    var resultingBoard = board.draftMove(position, availableMove);
    var kingsPosition = resultingBoard.findKing(board.position(position).side);
    return _.any(detectThreats(kingsPosition, resultingBoard));
  };
}
