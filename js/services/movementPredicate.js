var movementPredicates = {};

module.exports = function movementPredicate(position, board) {
  return movementPredicates[board.info(position).piece](position, board);
};

var _ = require('lodash');
var utils = require('./MovementUtils');
var Pieces = require('../constants/Pieces');
var detectThreats = require('./detectThreats');
var BasicMove = require('./BasicMove');
var CastleMove = require('./CastleMove');
var PawnJumpMove = require('./PawnJumpMove');
var EnPassantMove = require('./EnPassantMove');

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

    var enPassantOpportunity = (rankDistance == 1 && fileDistance == 1 &&
                                candidate.position[0]+position[1] == board.lastPawnJump)
    var captureOpportunity = (rankDistance == 1 && fileDistance == 1 &&
                              candidate.info.side == opposingSide);
    var blocked = board.isOccupied(candidate.position) ||
                  board.isOccupied(rank + (parseInt(file)+direction));
    var tooFar = rankDistance != 0 || fileDistance <= 0 || fileDistance > range;

    if(enPassantOpportunity) return EnPassantMove(position, candidate.position);
    if(captureOpportunity || (!blocked && !tooFar))
      return fileDistance == 2 ?
        PawnJumpMove(position, candidate.position) :
        BasicMove(position, candidate.position);
  };
};

movementPredicates[Pieces.KNIGHT] = function knight(position, board) {
  return function(candidate) {
    if(board.info(position).side == candidate.info.side) return false;

    var rankDistance = Math.abs(utils.getDistance(candidate.position, position).rank);
    var fileDistance = Math.abs(utils.getDistance(candidate.position, position).file);

    if((rankDistance == 2 && fileDistance == 1) || (rankDistance == 1 && fileDistance == 2))
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
  var homeFile = (king.side == Pieces.sides.WHITE ? '1' : '8');

  var castleOpportunity = function(candidate) {
    var distance = utils.getDistance(position, candidate.position);
    var rankDirection = distance.rank / Math.abs(distance.rank);

    if(
      Math.abs(distance.file) != 0 ||
      Math.abs(distance.rank) != 2 ||
      position[1] != homeFile ||
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

    var rookPosition = (rankDirection == 1 ? 'a'+homeFile : 'h'+homeFile);
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

