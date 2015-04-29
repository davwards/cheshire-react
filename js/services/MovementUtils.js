var _ = require('lodash');

function between(a, b, c) {
  return (b > a && b < c) || (b < a && b > c);
}

function getDistance(square1, square2) {
  return {
    rank: square1[0].charCodeAt() - square2[0].charCodeAt(),
    file: parseInt(square1[1]) - parseInt(square2[1])
  };
}

function clearDiagonalPath(position1, position2, board) {
  var distance = getDistance(position1, position2);
  if(Math.abs(distance.rank) != Math.abs(distance.file)) return false;

  return _.all(
    board.filterSquares(function(square) {
      var position = square.position;
      distance = getDistance(position1, position);

      return (
        Math.abs(distance.rank) == Math.abs(distance.file) &&
        between(position1[0], position[0], position2[0]) &&
        between(position1[1], position[1], position2[1])
      );
    }), function(position) { return !board.isOccupied(position); }
  );
}

function clearHorizontalOrVerticalPath(position1, position2, board) {
  if(!(position1[0] == position2[0] ^ position1[1] == position2[1])) return false;

  var commonCoordinate   = (position1[0] == position2[0] ? 0 : 1);
  var uncommonCoordinate = (position1[0] == position2[0] ? 1 : 0);

  return _.all(
    board.filterSquares(function(square) {
      return (
        square.position[commonCoordinate] == position1[commonCoordinate] &&
        between(position1[uncommonCoordinate],
                square.position[uncommonCoordinate],
                position2[uncommonCoordinate])
      );
    }), function(position) { return !board.isOccupied(position); }
  );
}

module.exports = {
  getDistance: getDistance,
  clearDiagonalPath: clearDiagonalPath,
  clearHorizontalOrVerticalPath: clearHorizontalOrVerticalPath
};
