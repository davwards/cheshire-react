var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/Actions');

var CheshireActions = {
  selectPiece: function(rank, file) {
    console.log('selecting piece: ' + rank + file);
    AppDispatcher.dispatch({
      actionType: Actions.SELECT_PIECE,
      rank: rank,
      file: file
    });
  },
};

module.exports = CheshireActions;
