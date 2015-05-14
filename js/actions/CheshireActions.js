var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/Actions');

var CheshireActions = {
  selectSquare: function(rank, file) {
    AppDispatcher.dispatch({
      actionType: Actions.SELECT_SQUARE,
      rank: rank,
      file: file
    });
  },

  promotePawn: function(position, newType) {
    AppDispatcher.dispatch({
      actionType: Actions.PROMOTE_PAWN,
      position: position,
      newType: newType
    });
  },
};

module.exports = CheshireActions;
