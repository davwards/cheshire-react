var _ = require('lodash');

var Pieces = require('../constants/Pieces');

var pieceTypePredicates = {};

module.exports = function(board, position){
  var pieceType = board.position(position).piece;
  var predicateForPieceType = pieceTypePredicates[pieceType](position, board);

  var allAvailableMoves = board.filterSquares(predicateForPieceType);
  return _.reject(allAvailableMoves, function(availableMove) {
    var resultingBoard = board.draftMove(position, availableMove);
    var kingsPosition = resultingBoard.findKing(board.position(position).side);
    return _.any(detectThreats(kingsPosition, resultingBoard));
  });
};

pieceTypePredicates[Pieces.PAWN] = function pawn(position, board) {
  var rank = position[0], file = position[1];
  var direction, startingFile, opposingSide;

  if(board.position(position).side == Pieces.sides.BLACK)
    direction = -1, startingFile = '7', opposingSide = Pieces.sides.WHITE;
  else
    direction = 1, startingFile = '2', opposingSide = Pieces.sides.BLACK;

  var range = (file == startingFile ? 2 : 1);

  return function(candidateSquare, candidatePosition) {
    var rankDistance = Math.abs(distance(candidatePosition, position).rank);
    var fileDistance = distance(candidatePosition, position).file * direction;

    var captureOpportunity = (rankDistance == 1 && fileDistance == 1 &&
                              candidateSquare.side == opposingSide);
    var blocked = board.isOccupied(candidatePosition) ||
                  board.isOccupied(rank + (parseInt(file)+direction));
    var tooFar = rankDistance != 0 || fileDistance <= 0 || fileDistance > range;

    return captureOpportunity || (!blocked && !tooFar)
  };
}

pieceTypePredicates[Pieces.KNIGHT] = function(position, board) {
  return function(candidateSquare, candidatePosition) {
    if(board.position(position).side == candidateSquare.side) return false;

    var rankDistance = Math.abs(distance(candidatePosition, position).rank);
    var fileDistance = Math.abs(distance(candidatePosition, position).file);

    return (rankDistance == 2 && fileDistance == 1) || (rankDistance == 1 && fileDistance == 2);
  }
};

pieceTypePredicates[Pieces.ROOK] = function(position, board) {
  return linePiece(position, board, horizontalOrVerticalPath);
};

pieceTypePredicates[Pieces.BISHOP] = function(position, board) {
  return linePiece(position, board, diagonalPath);
};

pieceTypePredicates[Pieces.QUEEN] = function(position, board) {
  return linePiece(position, board,
    function diagonalHorizontalOrVerticalPath(position1, position2) {
      return diagonalPath(position1, position2, board) ||
             horizontalOrVerticalPath(position1, position2, board);
    }
  );
};

pieceTypePredicates[Pieces.KING] = function(position, board) {
  return linePiece(position, board,
    function oneStepInAnyDirection(position, candidatePosition, board) {
      if(_.all(distance(candidatePosition, position), function(steps) {
        return Math.abs(steps) <=1;
      })) return [];
    }
  );
};

function detectThreats(positionToThreaten, board) {
  if(!positionToThreaten) return [];
  var squareToThreaten = board.position(positionToThreaten);

  return board.filterSquares(function(potentialThreatSquare, potentialThreatPosition) {
    if(!board.isOccupied(potentialThreatPosition)) return false;
    if(board.position(positionToThreaten).side == potentialThreatSquare.side) return false;

    var isThreatTo = pieceTypePredicates[potentialThreatSquare.piece](potentialThreatPosition, board);
    return isThreatTo(squareToThreaten, positionToThreaten);
  });
};

function linePiece(position, board, findPath) {
  return function(candidateSquare, candidatePosition) {
    if(candidatePosition == position) return false;
    if(board.position(position).side == candidateSquare.side) return false;

    var path = findPath(position, candidatePosition, board);
    if(!path) return false;

    return !_.any(path, function(passedThroughPosition) {
      return board.isOccupied(passedThroughPosition);
    });
  };
};

function diagonalPath(position1, position2, board) {
  var rankDistance = distance(position1, position2).rank;
  var fileDistance = distance(position1, position2).file;

  if(Math.abs(rankDistance) != Math.abs(fileDistance)) return false;

  return board.filterSquares(function(square, position) {
    rankDistance = distance(position1, position).rank;
    fileDistance = distance(position1, position).file;

    return (
      Math.abs(rankDistance) == Math.abs(fileDistance) &&
      between(position1[0], position[0], position2[0]) &&
      between(position1[1], position[1], position2[1])
    );
  });
}

function horizontalOrVerticalPath(position1, position2, board) {
  if(!(position1[0] == position2[0] ^ position1[1] == position2[1])) return false;

  var commonCoordinate   = (position1[0] == position2[0] ? 0 : 1);
  var uncommonCoordinate = (position1[0] == position2[0] ? 1 : 0);

  return board.filterSquares(function(square, position) {
    return (
      position[commonCoordinate] == position1[commonCoordinate] &&
      between(position1[uncommonCoordinate],
              position[uncommonCoordinate],
              position2[uncommonCoordinate])
    );
  });
}

function between(a, b, c) {
  return (b > a && b < c) || (b < a && b > c);
}

function distance(square1, square2) {
  return {
    rank: square1[0].charCodeAt() - square2[0].charCodeAt(),
    file: parseInt(square1[1]) - parseInt(square2[1])
  }
};
