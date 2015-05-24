var _ = require('lodash');

var Game = require('../constants/Game');
var possibleMoves = require('./possibleMoves');
var detectThreats = require('./detectThreats');
var move = require('./movementPredicate');

module.exports = function(board, sideToMove) {
  if(_.chain(board.listSquares())
      .select(function(square) { return square.info.side === sideToMove; })
      .select(function(square) { return _.any(possibleMoves(board, square.position)); })
      .any().value())
    return Game.CONTINUE;

  if(_.any(detectThreats(board.findKing(sideToMove), board)))
    return Game.CHECKMATE;
  else
    return Game.STALEMATE;
};
