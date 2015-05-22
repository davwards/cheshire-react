var movementPredicates = {};

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};

var Pieces = require('../constants/Pieces');

movementPredicates[Pieces.PAWN]   = require('./movementRules/pawnMovement');
movementPredicates[Pieces.KNIGHT] = require('./movementRules/knightMovement');
movementPredicates[Pieces.ROOK]   = require('./movementRules/rookMovement');
movementPredicates[Pieces.BISHOP] = require('./movementRules/bishopMovement');
movementPredicates[Pieces.QUEEN]  = require('./movementRules/queenMovement');
movementPredicates[Pieces.KING]   = require('./movementRules/kingMovement');

