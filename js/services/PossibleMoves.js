var _ = require('lodash');

var Pieces = require('../constants/Pieces');

var pieceTypePredicates = {};

module.exports = function(board, position){
  var pieceType = board.position(position).piece;
  var predicateForPieceType = pieceTypePredicates[pieceType](position, board);

  return board.filterSquares(predicateForPieceType);
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
    var piece = board.position(position);
    var rankDistance = Math.abs(distance(candidatePosition, position).rank);
    var fileDistance = Math.abs(distance(candidatePosition, position).file);

    if(board.isOccupied(candidatePosition) && candidateSquare.side == piece.side)
      return false;
    return (rankDistance == 2 && fileDistance == 1) || (rankDistance == 1 && fileDistance == 2);
  }
};

pieceTypePredicates[Pieces.ROOK] = function(position, board) {
  return linePiecePredicate(position, board,
                            isHorizontalOrVerticalPath,
                            isHorizontallyOrVerticallyBetween);
};

pieceTypePredicates[Pieces.BISHOP] = function(position, board) {
  return linePiecePredicate(position, board, isDiagonalPath, isDiagonallyBetween);
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
  if(!isDiagonalPath(position1, betweenPosition)) return false;
  if(!isDiagonalPath(betweenPosition, position2)) return false;
  if(!(
    (betweenPosition[0] < position1[0] && betweenPosition[0] > position2[0]) ||
    (betweenPosition[0] > position1[0] && betweenPosition[0] < position2[0])
  )) return false;
  if(!(
    (betweenPosition[1] < position1[1] && betweenPosition[1] > position2[1]) ||
    (betweenPosition[1] > position1[1] && betweenPosition[1] < position2[1])
  )) return false;
  return true;
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
