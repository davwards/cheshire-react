var linePiece = require('./linePiece');
var utils = require('./MovementUtils');

module.exports = function bishop(position, board) {
  return linePiece(position, board, utils.clearDiagonalPath);
};
