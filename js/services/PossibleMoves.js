function incrementRank(rank, increment) {
  return String.fromCharCode(
    rank.charCodeAt() + increment
  );
}

module.exports = function(board, position){
  var piece = board.position(position);
  var rank = position[0];
  var file = position[1];

  var moves = [];

  if(piece.side == 'black') {
    moves.push(incrementRank(rank, -1) + file);
    if(rank == 'g') moves.push(incrementRank(rank, -2) + file);
  }

  if(piece.side == 'white') {
    moves.push(incrementRank(rank, 1) + file);
    if(rank == 'b') moves.push(incrementRank(rank, 2) + file);
  }

  return moves;
};
