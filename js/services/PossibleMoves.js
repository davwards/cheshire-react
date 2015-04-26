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
  return function(candidateSquare, candidatePosition) {
    var piece = board.position(position);
    var rankDistance = Math.abs(distance(candidatePosition, position).rank);
    var fileDistance = Math.abs(distance(candidatePosition, position).file);

    if(piece.side == candidateSquare.side) return false;
    if(!(
      (rankDistance == 0) ^ (fileDistance == 0)
    )) return false;

    var start, end, coordinates, buildFullCoordinates;

    if(rankDistance == 0) {
      start = position[1];
      end = candidatePosition[1];
      coordinates = '12345678';
      buildFullCoordinates = function(fileName) { return position[0] + fileName; };
    }

    if(fileDistance == 0) {
      start = position[0];
      end = candidatePosition[0];
      coordinates = 'abcdefgh';
      buildFullCoordinates = function(rankName) { return rankName + position[1]; };
    }

    return !(_.chain(coordinates)
      .select(function(line) {
        return (line < start && line > end) ||
               (line > start && line < end); })
      .map(buildFullCoordinates)
      .any(function(passedPosition) { return board.isOccupied(passedPosition); })
      .value());
  };
};

pieceTypePredicates[Pieces.BISHOP] = function(position, board) {
  return function(candidateSquare, candidatePosition) {
    if(candidatePosition == position) return false;
    if(board.position(position).side == candidateSquare.side) return false;
    if(!isDiagonalPath(candidatePosition, position)) return false;

    return !_.any(board.filterSquares(function(square, squarePosition){
      return board.isOccupied(squarePosition) &&
             isDiagonallyBetween(position, squarePosition, candidatePosition);
    }));
  };
};

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
