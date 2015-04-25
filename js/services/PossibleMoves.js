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
