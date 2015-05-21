var _ = require('lodash');

var Game = require('../constants/Game');
var PossibleMoves = require('./PossibleMoves');
var detectThreats = require('./detectThreats');
var move = require('./movementPredicate');

module.exports = function(board, sideToMove) {
  if(_.chain(board.listSquares())
      .select(function(square) { return square.info.side === sideToMove; })
      .select(function(square) { return _.any(PossibleMoves(board, square.position)); })
      .any().value())
    return Game.CONTINUE;

  if(_.any(detectThreats(board.findKing(sideToMove), board)))
    return Game.CHECKMATE;
  else
    return Game.STALEMATE;
};
