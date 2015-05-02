jest.autoMockOff();

var Pieces = require('../../constants/Pieces');
var BoardModel = require('../../models/Board');
var movementPredicate = require('../movementPredicate');

var _ = require('lodash');

var movesIntoCheck = require('../movesIntoCheck');

describe('movesIntoCheck', function() {
  var board;
  beforeEach(function(){
    board = new BoardModel();
    board.clearBoard();
  });

  function expectMovesNotResultingInCheck(position, moves) {
    var candidates = _.chain(board.listSquares())
                      .reduce(function(map, square) {
                        map[square.position] = movementPredicate(position, board)(square);
                        return map; }, {})
                      .pick(function(move) { return move; })
                      .value();
    expect(
      _.omit(candidates, movesIntoCheck(position, board))
    ).toEqual(moves);
  }

  it.only('detects when a knight moves into check', function() {
    board.placePiece({piece: Pieces.KNIGHT, side: Pieces.sides.WHITE}, 'd5');
    board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f5');
    board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'a5');

    expectMovesNotResultingInCheck('d5', []);
  });

  it('detects when a rook moves into check', function() {
    board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.WHITE}, 'd5');
    board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'd7');
    board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'd3');

    expectMovesNotResultingInCheck('d5', ['d3', 'd4', 'd6']);
  });

  it('detects when a bishop moves into check', function() {
    board.placePiece({piece: Pieces.BISHOP, side: Pieces.sides.WHITE}, 'd5');
    board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.BISHOP, side: Pieces.sides.BLACK}, 'b3');

    expectMovesNotResultingInCheck('d5', ['b3', 'c4', 'e6']);
  });

  it('detects when a queen moves into check', function() {
    board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.WHITE}, 'd5');
    board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'f7');
    board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.BLACK}, 'b3');

    expectMovesNotResultingInCheck('d5', ['b3', 'c4', 'e6']);
  });

  it('detects when a king moves into check', function() {
    board.placePiece({piece: Pieces.KING, side: Pieces.sides.WHITE}, 'd5');
    board.placePiece({piece: Pieces.QUEEN, side: Pieces.sides.BLACK}, 'c4');
    board.placePiece({piece: Pieces.ROOK, side: Pieces.sides.BLACK}, 'a6');

    expectMovesNotResultingInCheck('d5', ['c4', 'e5']);
  });
});
