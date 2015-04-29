var _ = require('lodash');
var utils = require('./MovementUtils');
var Pieces = require('../constants/Pieces');

var movementPredicates = {};

movementPredicates[Pieces.PAWN] = function pawn(position, board) {
  var rank = position[0], file = position[1];
  var direction, startingFile, opposingSide;

  if(board.info(position).side == Pieces.sides.BLACK)
    direction = -1, startingFile = '7', opposingSide = Pieces.sides.WHITE;
  else
    direction = 1, startingFile = '2', opposingSide = Pieces.sides.BLACK;

  var range = (file == startingFile ? 2 : 1);

  return function(candidate) {
    var rankDistance = Math.abs(utils.getDistance(candidate.position, position).rank);
    var fileDistance = utils.getDistance(candidate.position, position).file * direction;

    var captureOpportunity = (rankDistance == 1 && fileDistance == 1 &&
                              candidate.info.side == opposingSide);
    var blocked = board.isOccupied(candidate.position) ||
                  board.isOccupied(rank + (parseInt(file)+direction));
    var tooFar = rankDistance != 0 || fileDistance <= 0 || fileDistance > range;

    return captureOpportunity || (!blocked && !tooFar)
  };
};

movementPredicates[Pieces.KNIGHT] = function knight(position, board) {
  return function(candidate) {
    if(board.info(position).side == candidate.info.side) return false;

    var rankDistance = Math.abs(utils.getDistance(candidate.position, position).rank);
    var fileDistance = Math.abs(utils.getDistance(candidate.position, position).file);

    return (rankDistance == 2 && fileDistance == 1) || (rankDistance == 1 && fileDistance == 2);
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
  return linePiece(position, board,
    function oneStepInAnyDirection(position, candidatePosition, board) {
      return (_.all(utils.getDistance(candidatePosition, position), function(steps) {
        return Math.abs(steps) <=1;
      }));
    }
  );
};

function linePiece(position, board, findClearPath) {
  return function(candidate) {
    var path;
    return(
      candidate.position != position &&
      board.info(position).side != candidate.info.side &&
      findClearPath(position, candidate.position, board)
    );
  };
}

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};
