var movementPredicates = {};

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};

var _ = require('lodash');
var utils = require('./MovementUtils');
var Pieces = require('../constants/Pieces');
var detectThreats = require('./detectThreats');
var BasicMove = require('./moves/BasicMove');
var CastleMove = require('./moves/CastleMove');
var PawnJumpMove = require('./moves/PawnJumpMove');
var EnPassantMove = require('./moves/EnPassantMove');
var PawnPromotionMove = require('./moves/PawnPromotionMove');

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

movementPredicates[Pieces.KING] = function king(position, board) {
  var oneStepInAnyDirection = linePiece(position, board, function(start, destination, board) {
    return (_.all(utils.getDistance(destination, start), function(steps) {
      return Math.abs(steps) <=1;
    }));
  });

  var king = board.info(position);
  var homeRank = (king.side == Pieces.sides.WHITE ? '1' : '8');

  var castleOpportunity = function(candidate) {
    var distance = utils.getDistance(position, candidate.position);
    var fileDirection = distance.file / Math.abs(distance.file);

    if(
      Math.abs(distance.rank) != 0 ||
      Math.abs(distance.file) != 2 ||
      position[1] != homeRank ||
      king.hasMoved ||
      _.any(detectThreats(position, board)) ||
      _.chain(board.listSquares())
        .select(function(square) {
          return square.position[1] == position[1] &&
            utils.between(position[0], square.position[0], candidate.position[0]); })
        .any(function(square) {
          return detectThreats(square.position, board, king.side).length > 0; })
        .value()
    ) return false;

    var rookPosition = (fileDirection == 1 ? 'a'+homeRank : 'h'+homeRank);
    var rookSpace = board.info(rookPosition);

    if(
      !rookSpace.hasMoved &&
      rookSpace.piece == Pieces.ROOK &&
      rookSpace.side == king.side &&
      utils.clearHorizontalOrVerticalPath(position, rookPosition, board)
    ) return CastleMove(position, candidate.position);
  };

  return function(candidate) {
    return oneStepInAnyDirection(candidate) || castleOpportunity(candidate);
  }
};

function linePiece(position, board, findClearPath) {
  return function(candidate) {
    var path;
    if(
      candidate.position != position &&
      board.info(position).side != candidate.info.side &&
      findClearPath(position, candidate.position, board)
    ) return BasicMove(position, candidate.position);
  };
}

