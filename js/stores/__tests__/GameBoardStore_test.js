jest.dontMock('../GameBoardStore');
jest.dontMock('../../constants/Actions');
jest.dontMock('keymirror');
jest.dontMock('object-assign');
jest.dontMock('lodash');

describe('GameBoardStore', function() {
  var handleAction;
  var AppDispatcher;
  var Actions;
  var GameBoardStore;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    Actions = require('../../constants/Actions');
    GameBoardStore = require('../GameBoardStore');
    handleAction = AppDispatcher.register.mock.calls[0][0];
  });

  describe('when given a PIECE_SELECTED action', function(){
    it('marks the appropriate square as selected', function(){
      handleAction({
        actionType: Actions.SELECT_PIECE,
        rank: 'a',
        file: '1'
      });

      expect(GameBoardStore.getBoardState()['a']['1'].selected).toBeTruthy();
    });

    it('clears previous selection', function(){
      handleAction({
        actionType: Actions.SELECT_PIECE,
        rank: 'a',
        file: '1'
      });

      handleAction({
        actionType: Actions.SELECT_PIECE,
        rank: 'a',
        file: '3'
      });

      expect(GameBoardStore.getBoardState()['a']['1'].selected).toBeFalsy();
    });
  });
});
