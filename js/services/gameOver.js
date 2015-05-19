var _ = require('lodash');

var Game = require('../constants/Game');
var PossibleMoves = require('./PossibleMoves');

module.exports = function(board, sideToMove) {
  if(_.isEmpty(
    _.select(board.listSquares(), function(square) {
      return square.info.side === sideToMove && _.any(PossibleMoves(board, square.position))
    })
  )) return Game.CHECKMATE;

  return Game.CONTINUE;
};
