module.exports = function BasicMove(start, end) {
  return function(board) {
    var piece = board.info(start);
    board.removePiece(start);
    board.placePiece(piece, end);
    board.setMoved(end);
    board.lastPawnJump = undefined;
  };
};
