jest.autoMockOff();
jest.mock('../../dispatcher/AppDispatcher');
jest.mock('../../services/PossibleMoves');

var _ = require('lodash');
var BasicMove = require('../../services/BasicMove');

describe('GameBoardStore', function() {
  var handleAction;
  var AppDispatcher;
  var PossibleMoves;
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
        var selectedPosition = 'a1';
        beforeEach(function() {
          PossibleMoves = require('../../services/PossibleMoves');
          expect(
            GameBoardStore.getBoardState()[selectedPosition].piece
          ).toBeTruthy();
        });

        it('marks the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            position: selectedPosition
          });

          expect(GameBoardStore.getBoardState()[selectedPosition].selected).toBeTruthy();
        });

        it('highlights the selected piece\'s possible moves', function() {
          PossibleMoves.mockReturnValue({
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
      });
    });

    describe('and another square is already selected', function() {
      var sourcePosition = 'a2';
      var movedPiece;

      var possibleMoveFunction;

      beforeEach(function(){
        PossibleMoves = require('../../services/PossibleMoves');
        possibleMoveFunction = jest.genMockFunction();
        PossibleMoves.mockReturnValue({ a3: possibleMoveFunction });

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
      });
    });

    describe('Scenario: a sequence of moves', function() {
      beforeEach(function(){
        PossibleMoves = require('../../services/PossibleMoves');
        PossibleMoves.mockImplementation(function(board, position){
          if(position == 'd2') {
            return {d3: BasicMove('d2', 'd3')};
          }
          if(position == 'd7') {
            return {d6: BasicMove('d7', 'd6')};
          }
        });
      });

      it('results in having pieces at the right destination', function() {
        // Select white pawn
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          position: 'd2'
        });
        // Move white pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          position: 'd3'
        });

        // Select black pawn
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          position: 'd7'
        });
        // Move black pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          position: 'd6'
        });

        expect(GameBoardStore.getBoardState()['d2'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['d3'].piece).toEqual(Pieces.PAWN);
        expect(GameBoardStore.getBoardState()['d3'].side).toEqual(Pieces.sides.WHITE);

        expect(GameBoardStore.getBoardState()['d7'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['d6'].piece).toEqual(Pieces.PAWN);
        expect(GameBoardStore.getBoardState()['d6'].side).toEqual(Pieces.sides.BLACK);
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
