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
  var piece = board.position(position);
  var rank = position[0];
  var file = position[1];

  var direction, startingRank, opposingSide;

  if(piece.side == Pieces.sides.BLACK) {
    direction = -1, startingRank = 'g', opposingSide = Pieces.sides.WHITE;
  } else {
    direction = 1, startingRank = 'b', opposingSide = Pieces.sides.BLACK;
  }

  return function(candidateSquare, candidatePosition) {
    var rankDistance = distance(candidatePosition, position).rank * direction;
    var fileDistance = Math.abs(distance(candidatePosition, position).file);

    if(rankDistance > 2 || rankDistance < 1 || fileDistance > 1)
      return false;
    if(fileDistance == 1 && rankDistance == 1 && candidateSquare.side == opposingSide)
      return true;
    if(blockedPath(position, candidatePosition, board))
      return false;
    if(rankDistance > 1 && rank != startingRank)
      return false;
    if(fileDistance != 0)
      return false
    return true;
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
  return linePiecePredicate(position, board,
                            isHorizontalOrVerticalPath,
                            isHorizontallyOrVerticallyBetween);
};

pieceTypePredicates[Pieces.BISHOP] = function(position, board) {
  return linePiecePredicate(position, board,
                            isDiagonalPath,
                            isDiagonallyBetween);
};

pieceTypePredicates[Pieces.QUEEN] = function(position, board) {
  return linePiecePredicate(position, board,
                            function(pos1, pos2) {
                              return isDiagonalPath(pos1, pos2) ||
                                     isHorizontalOrVerticalPath(pos1, pos2);
                            },
                            function(pos1, pos2, pos3) {
                              return isDiagonallyBetween(pos1, pos2, pos3) ||
                                     isHorizontallyOrVerticallyBetween(pos1, pos2, pos3);
                            });
};

pieceTypePredicates[Pieces.KING] = function(position, board) {
  return linePiecePredicate(position, board,
                            function(candidatePosition, position) {
                              return(Math.abs(distance(candidatePosition, position).rank) < 2 &&
                                     Math.abs(distance(candidatePosition, position).file) < 2);
                            },
                            function() { return false; });
};

function detectThreats(positionToThreaten, board) {
  if(!positionToThreaten) return false;
  var squareToThreaten = board.position(positionToThreaten);

  return board.filterSquares(function(potentialThreatSquare, potentialThreatPosition) {
    if(!board.isOccupied(potentialThreatPosition)) return false;
    if(board.position(positionToThreaten).side == potentialThreatSquare.side) return false;

    var potentialThreatCanMoveTo = pieceTypePredicates[potentialThreatSquare.piece](potentialThreatPosition, board);
    return potentialThreatCanMoveTo(squareToThreaten, positionToThreaten);
  });
};

function linePiecePredicate(position, board, isPath, isBetween) {
  return function(candidateSquare, candidatePosition) {
    if(candidatePosition == position) return false;
    if(board.position(position).side == candidateSquare.side) return false;
    if(!isPath(candidatePosition, position)) return false;

    return !_.any(board.filterSquares(function(square, squarePosition){
      return board.isOccupied(squarePosition) &&
             isBetween(position, squarePosition, candidatePosition);
    }));
  };
};

function isHorizontalOrVerticalPath(position1, position2) {
  var rankDistance = Math.abs(distance(position1, position2).rank);
  var fileDistance = Math.abs(distance(position1, position2).file);

  return (rankDistance == 0) ^ (fileDistance == 0);
}

function isHorizontallyOrVerticallyBetween(position1, betweenPosition, position2) {
  var a, b, c;
  if(position1[0] == betweenPosition[0] && betweenPosition[0] == position2[0]){
    a = position1[1], b = betweenPosition[1], c = position2[1];
  } else if(position1[1] == betweenPosition[1] && betweenPosition[1] == position2[1]){
    a = position1[0], b = betweenPosition[0], c = position2[0];
  } else { return false; }

  return (b < a && b > c) || (b > a && b < c);
}

function isDiagonalPath(position1, position2) {
  var rankDistance = Math.abs(distance(position1, position2).rank);
  var fileDistance = Math.abs(distance(position1, position2).file);

  return rankDistance == fileDistance;
}

function isDiagonallyBetween(position1, betweenPosition, position2) {
  if(
    !isDiagonalPath(position1, betweenPosition) ||
    !isDiagonalPath(position2, betweenPosition) ||
    !isDiagonalPath(position1, position2)
  ) return false;

  return _.chain(_.zip(position1, betweenPosition, position2))
    .map(function(coords) {
      var a = coords[0], b = coords[1], c = coords[2];
      return (b < a && b > c) || (b > a && b < c); })
    .all().value();
}

function incrementRank(rank, increment) {
  return String.fromCharCode(
    rank.charCodeAt() + increment
  );
}

function incrementFile(file, increment) {
  return (parseInt(file) + increment) + ''
}

function distance(square1, square2) {
  return {
    rank: square1[0].charCodeAt() - square2[0].charCodeAt(),
    file: parseInt(square1[1]) - parseInt(square2[1])
  }
};

function blockedPath(startPosition, endPosition, board) {
  if(startPosition[1] != endPosition[1]) return [];

  return _.chain('abcdefgh')
    .select(function(rankName) {
      return (rankName > startPosition[0] && rankName <= endPosition[0]) ||
             (rankName < startPosition[0] && rankName >= endPosition[0]);
    })
    .map(function(rankName) { return rankName + startPosition[1]; })
    .any(function(position) { return board.isOccupied(position); })
    .value();
};
