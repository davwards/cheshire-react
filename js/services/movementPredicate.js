var movementPredicates = {};

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};

var utils = require('./MovementUtils');
var Pieces = require('../constants/Pieces');
var linePiece = require('./movementRules/linePiece');
var BasicMove = require('./moves/BasicMove');

movementPredicates[Pieces.PAWN] = require('./movementRules/pawnMovement');

movementPredicates[Pieces.KNIGHT] = require('./movementRules/knightMovement');

movementPredicates[Pieces.ROOK] = require('./movementRules/rookMovement');

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

