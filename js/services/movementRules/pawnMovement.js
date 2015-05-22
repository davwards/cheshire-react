var _ = require('lodash');
var utils = require('../MovementUtils');
var Pieces = require('../../constants/Pieces');
var detectThreats = require('../detectThreats');

var BasicMove = require('../moves/BasicMove');
var PawnJumpMove = require('../moves/PawnJumpMove');
var EnPassantMove = require('../moves/EnPassantMove');
var PawnPromotionMove = require('../moves/PawnPromotionMove');

module.exports = function pawnMovement(position, board) {
  var file = position[0], rank = position[1];
  var direction, startingRank, promotionRank, opposingSide;

  if(board.info(position).side == Pieces.sides.BLACK)
    direction = -1, startingRank = '7', promotionRank = '1', opposingSide = Pieces.sides.WHITE;
  else
    direction = 1, startingRank = '2', promotionRank = '8', opposingSide = Pieces.sides.BLACK;

  return function(candidate) {
    var fileDistance = Math.abs(utils.getDistance(candidate.position, position).file);
    var rankDistance = utils.getDistance(candidate.position, position).rank * direction;

    var enPassantOpportunity = fileDistance == 1 && rankDistance == 1 &&
                               candidate.position[0]+position[1] == board.lastPawnJump();

    var jumpOpportunity = fileDistance == 0 && rankDistance == 2 && rank == startingRank &&
                          !board.isOccupied(candidate.position) &&
                          !board.isOccupied(file + (parseInt(rank)+direction));

    var captureOpportunity = fileDistance == 1 && rankDistance == 1 &&
                             candidate.info.side == opposingSide;

    var stepOpportunity = fileDistance == 0 && rankDistance == 1 &&
                          !board.isOccupied(candidate.position);

    var promotionOpportunity = (captureOpportunity || stepOpportunity) &&
                               candidate.position[1] == promotionRank;


    if(promotionOpportunity) return PawnPromotionMove(position, candidate.position);
    if(enPassantOpportunity) return EnPassantMove(position, candidate.position);
    if(jumpOpportunity) return PawnJumpMove(position, candidate.position);
    if(captureOpportunity || stepOpportunity) return BasicMove(position, candidate.position);
  };
};
