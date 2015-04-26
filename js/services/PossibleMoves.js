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
    function diagonalHorizontalOrVerticalPath(position1, position2) {
      return isDiagonalPath(position1, position2) ||
             isHorizontalOrVerticalPath(position1, position2);
    },
    function diagonallyHorizontallyOrVerticallyBetween(position1, position2, position3) {
      return isDiagonallyBetween(position1, position2, position3) ||
             isHorizontallyOrVerticallyBetween(position1, position2, position3);
    }
  );
};

pieceTypePredicates[Pieces.KING] = function(position, board) {
  return linePiecePredicate(position, board,
    function oneStepInAnyDirection(candidatePosition, position) {
      return(Math.abs(distance(candidatePosition, position).rank) <= 1 &&
             Math.abs(distance(candidatePosition, position).file) <= 1);
    },
    function() { return false; });
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

function distance(square1, square2) {
  return {
    rank: square1[0].charCodeAt() - square2[0].charCodeAt(),
    file: parseInt(square1[1]) - parseInt(square2[1])
  }
};
