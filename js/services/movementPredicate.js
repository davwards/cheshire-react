var movementPredicates = {};

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};

var _ = require('lodash');
var utils = require('./MovementUtils');
var Pieces = require('../constants/Pieces');
var linePiece = require('./movementRules/linePiece');
var BasicMove = require('./moves/BasicMove');

movementPredicates[Pieces.PAWN] = require('./movementRules/pawnMovement');

movementPredicates[Pieces.KNIGHT] = function knight(position, board) {
  return function(candidate) {
    if(board.info(position).side == candidate.info.side) return false;

    var distance = utils.getDistance(candidate.position, position);

    if(Math.abs(distance.file * distance.rank) == 2)
      return BasicMove(position, candidate.position);
  }
};

movementPredicates[Pieces.ROOK] = function rook(position, board) {
  return linePiece(position, board, utils.clearHorizontalOrVerticalPath);
};

movementPredicates[Pieces.BISHOP] = function bishop(position, board) {
  return linePiece(position, board, utils.clearDiagonalPath);
};

movementPredicates[Pieces.QUEEN] = function queen(position, board) {
  return linePiece(position, board,
    function clearDiagonalHorizontalOrVerticalPath(position1, position2) {
      return utils.clearDiagonalPath(position1, position2, board) ||
             utils.clearHorizontalOrVerticalPath(position1, position2, board);
    }
  );
};

movementPredicates[Pieces.KING] = require('./movementRules/kingMovement');

