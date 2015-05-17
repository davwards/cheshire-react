var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/Actions');

var CheshireActions = {
  selectSquare: function(position) {
    AppDispatcher.dispatch({
      actionType: Actions.SELECT_SQUARE,
      position: position
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
