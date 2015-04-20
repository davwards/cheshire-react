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
};

module.exports = CheshireActions;
