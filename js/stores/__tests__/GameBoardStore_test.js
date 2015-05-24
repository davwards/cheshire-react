jest.autoMockOff();
jest.mock('../../dispatcher/AppDispatcher');
jest.mock('../../services/possibleMoves');
jest.mock('../../services/gameOver');

var _ = require('lodash');

describe('GameBoardStore', function() {
  var handleAction;
  var AppDispatcher;
  var possibleMoves;
  var gameOver;
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

  describe('initial state', function() {
    it('is white to play', function() {
      expect(
        GameBoardStore.getBoardState().sideToPlay
      ).toEqual(Pieces.sides.WHITE);
    });
  });

  describe('when given a SELECT_SQUARE action', function(){
    describe('and no square is currently selected', function() {
      describe('and the selected square is a piece belonging to the player', function() {
        var selectedPosition = 'a1';
        beforeEach(function() {
          possibleMoves = require('../../services/possibleMoves');
          expect(
            GameBoardStore.getBoardState()[selectedPosition].piece
          ).toBeTruthy();
          expect(
            GameBoardStore.getBoardState()[selectedPosition].side
          ).toEqual(Pieces.sides.WHITE);
        });

        it('marks the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState()[selectedPosition].selected).toBeTruthy();
        });

        it('highlights the selected piece\'s possible moves', function() {
          possibleMoves.mockReturnValue({
            a1: undefined,
            a2: undefined,
            g4: 'MOVE TO g4',
            c3: 'MOVE TO c3'
          });

          expect(Object.keys(
            _.pick(GameBoardStore.getBoardState(), function(square) {
              return square && square.possibleMove;
            })
          )).toEqual([]);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(Object.keys(
            _.pick(GameBoardStore.getBoardState(), function(square) {
              return square && square.possibleMove;
            })
          ).sort()).toEqual(['c3', 'g4']);
        });

        it('does not advance to the next turn', function() {
          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);
        });
      });

      describe('and the selected square is a piece belonging to the opponent', function() {
        var selectedPosition = 'a8';
        beforeEach(function() {
          possibleMoves = require('../../services/possibleMoves');
          expect(
            GameBoardStore.getBoardState()[selectedPosition].piece
          ).toBeTruthy();
          expect(
            GameBoardStore.getBoardState()[selectedPosition].side
          ).toEqual(Pieces.sides.BLACK);
        });

        it('does not mark the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState()[selectedPosition].selected).toBeFalsy();
        });

        it('does not advance to the next turn', function() {
          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);
        });
      });

      describe('and the selected square is not occupied', function() {
        var selectedPosition = 'c4';
        beforeEach(function() {
          expect(
            GameBoardStore.getBoardState()[selectedPosition].piece
          ).toBeFalsy();
        });

        it('does not mark the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState()[selectedPosition].selected).toBeFalsy();
        });

        it('does not advance to the next turn', function() {
          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);
        });
      });
    });

    describe('and another square is already selected', function() {
      var sourcePosition = 'a2';
      var movedPiece;

      var possibleMoveFunction;

      beforeEach(function(){
        gameOver = require('../../services/gameOver');

        possibleMoves = require('../../services/possibleMoves');
        possibleMoveFunction = jest.genMockFunction();
        possibleMoves.mockReturnValue({ a3: possibleMoveFunction });

        expect(GameBoardStore.getBoardState()[sourcePosition].piece).toBeTruthy();

        handleAction({
          actionType: Actions.SELECT_SQUARE,
          position: sourcePosition
        });

        expect(GameBoardStore.getBoardState()[sourcePosition].selected).toBeTruthy();
      });

      describe('and the target square is a possible move', function() {
        var selectedPosition = 'a3';
        beforeEach(function() {
          expect(GameBoardStore.getBoardState()[selectedPosition].possibleMove).toBeTruthy();
        });

        it('invokes the square\'s move function on the board', function(){
          expect(possibleMoveFunction).not.toBeCalled();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(possibleMoveFunction).toBeCalled();
        });

        it('clears the selected status on the new and previous selections', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.selected;
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.selected;
          })).toBeFalsy();
        });

        it('clears any highlighted possible moves', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.possibleMove;
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.possibleMove;
          })).toBeFalsy();
        });

        it('advances to the next turn', function() {
          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.BLACK);
        });

        it('sets the game state according to the gameOver result', function() {
          gameOver.mockReturnValue('MORTALCOMBAT');

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().gameState).toEqual('MORTALCOMBAT');
        });
      });

      describe('and the target square is not a possible move', function() {
        var selectedPosition = 'g1';
        beforeEach(function() {
          expect(GameBoardStore.getBoardState()[selectedPosition].possibleMove).toBeFalsy();
        });

        it('clears the selected status on the new and previous selections', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.selected;
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.selected;
          })).toBeFalsy();
        });

        it('clears any highlighted possible moves', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.possibleMove;
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(_.any(GameBoardStore.getBoardState(), function(square) {
            return square && square.possibleMove;
          })).toBeFalsy();
        });

        it('does not advance to the next turn', function() {
          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState().sideToPlay).toEqual(Pieces.sides.WHITE);
        });
      });
    });
  });

  describe('when given a PROMOTE_PAWN action', function() {
    it('promotes the piece at the given position to the given type', function() {
      expect(GameBoardStore.getBoardState()['a2'].piece).toEqual(Pieces.PAWN);

      handleAction({
        actionType: Actions.PROMOTE_PAWN,
        position: 'a2',
        newType: Pieces.QUEEN
      });

      expect(GameBoardStore.getBoardState()['a2'].piece).toEqual(Pieces.QUEEN);
    });
  });
});
