var linePiece = require('./linePiece');
var utils = require('../MovementUtils');

module.exports = function rook(position, board) {
  return linePiece(position, board, utils.clearHorizontalOrVerticalPath);
};
