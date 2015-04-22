jest.dontMock('../GameBoardStore');

describe('GameBoardStore', function() {
  var handleAction;
  var AppDispatcher;
  var Actions;
  var Pieces;
  var GameBoardStore;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    Actions = require('../../constants/Actions');
    Pieces = require('../../constants/Pieces');
    GameBoardStore = require('../GameBoardStore');
    handleAction = AppDispatcher.register.mock.calls[0][0];
  });

  describe('when given a SELECT_SQUARE action', function(){
    describe('and no square is currently selected', function() {
      describe('and the selected square is occupied', function() {
        var selectedRank = 'a';
        var selectedFile = '1';
        beforeEach(function() {
          expect(
            GameBoardStore.getBoardState()[selectedRank][selectedFile].piece
          ).toBeTruthy();
        });

        it('marks the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].selected).toBeTruthy();
        });
      });

      describe('and the selected square is not occupied', function() {
        var selectedRank = 'c';
        var selectedFile = '1';
        beforeEach(function() {
          expect(
            GameBoardStore.getBoardState()[selectedRank][selectedFile].piece
          ).toBeFalsy();
        });

        it('does not mark the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].selected).toBeFalsy();
        });
      });
    });

    describe('and another square is already selected', function() {
      var sourceRank = 'b';
      var sourceFile = '1';
      var movedPiece;

      var selectedRank = 'g';
      var selectedFile = '1';

      beforeEach(function(){
        movedPiece = GameBoardStore.getBoardState()[sourceRank][sourceFile];
        expect(movedPiece.piece).toBeTruthy();

        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: sourceRank,
          file: sourceFile
        });
      });

      it('moves the previously selected piece to the new square, replacing the current occupant', function(){
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: selectedRank,
          file: selectedFile
        });

        expect(GameBoardStore.getBoardState()[sourceRank][sourceFile].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()[selectedRank][selectedFile]).toEqual(movedPiece);
      });

      it('clears the selected status on the new and previous selections', function() {
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: selectedRank,
          file: selectedFile
        });

        expect(GameBoardStore.getBoardState()[sourceRank][sourceFile].selected).toBeFalsy();
        expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].selected).toBeFalsy();
      });

      describe('and the new selection is the same as the old selection', function() {
        var selectedRank = sourceRank;
        var selectedFile = sourceFile;

        it('does not delete the contents of the square', function() {
          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].piece).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].piece).toBeTruthy();
        });
      });
    });

    describe('Scenario: a sequence of moves', function() {
      it('results in having pieces at the right destination', function() {
        // Select white pawn
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'b',
          file: '4'
        });
        // Move white pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'c',
          file: '4'
        });

        // Select black pawn
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'g',
          file: '4'
        });
        // Move black pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'f',
          file: '4'
        });

        expect(GameBoardStore.getBoardState()['b']['4'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['c']['4'].piece).toEqual(Pieces.WHITE_PAWN);
        expect(GameBoardStore.getBoardState()['c']['4'].side).toEqual('white');

        expect(GameBoardStore.getBoardState()['g']['4'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['f']['4'].piece).toEqual(Pieces.BLACK_PAWN);
        expect(GameBoardStore.getBoardState()['f']['4'].side).toEqual('black');
      });
    });
  });
});
