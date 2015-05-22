var _ = require('lodash');

module.exports = {
  expectMoves: function expectMoves(rule, position, board, moveSet, moveType) {
    expect(
      _.chain(board.listSquares())
        .select(function(square) {
          return rule(position, board)(square) == moveType; })
        .map(function(square) {
          return square.position; })
        .value().sort()
    ).toEqual(moveSet.sort());
  },
  expectToHaveMove: function expectToHaveMove(rule, board, start, end) {
    expect(rule(start, board)({info: board.info(end), position: end})).toBeTruthy();
  },
  expectNotToHaveMove: function expectNotToHaveMove(rule, board, start, end) {
    expect(rule(start, board)({info: board.info(end), position: end})).toBeFalsy();
  }
};
