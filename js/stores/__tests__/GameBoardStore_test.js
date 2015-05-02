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
        var selectedRank = 'a';
        var selectedFile = '1';
        beforeEach(function() {
          PossibleMoves = require('../../services/PossibleMoves');
          expect(
            GameBoardStore.getBoardState()[selectedFile][selectedRank].piece
          ).toBeTruthy();
        });

        it('marks the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[selectedFile][selectedRank].selected).toBeTruthy();
        });

        it('highlights the selected piece\'s possible moves', function() {
          PossibleMoves.mockReturnValue({
            g4: 'MOVE TO g4',
            c3: 'MOVE TO c3'
          });

          expect(GameBoardStore.getBoardState()['4']['g'].possibleMove).toBeFalsy();
          expect(GameBoardStore.getBoardState()['3']['c'].possibleMove).toBeFalsy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()['4']['g'].possibleMove).toEqual('MOVE TO g4');
          expect(GameBoardStore.getBoardState()['3']['c'].possibleMove).toEqual('MOVE TO c3');
        });
      });

      describe('and the selected square is not occupied', function() {
        var selectedRank = 'c';
        var selectedFile = '4';
        beforeEach(function() {
          expect(
            GameBoardStore.getBoardState()[selectedFile][selectedRank].piece
          ).toBeFalsy();
        });

        it('does not mark the appropriate square as selected', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[selectedFile][selectedRank].selected).toBeFalsy();
        });
      });
    });

    describe('and another square is already selected', function() {
      var sourceRank = 'a';
      var sourceFile = '2';
      var movedPiece;

      var possibleMoveFunction;

      beforeEach(function(){
        PossibleMoves = require('../../services/PossibleMoves');
        possibleMoveFunction = jest.genMockFunction();
        PossibleMoves.mockReturnValue({ a3: possibleMoveFunction });

        movedPiece = GameBoardStore.getBoardState()[sourceFile][sourceRank];
        expect(movedPiece.piece).toBeTruthy();

        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: sourceRank,
          file: sourceFile
        });

        expect(movedPiece.selected).toBeTruthy();
      });

      describe('and the target square is a possible move', function() {
        var selectedRank = 'a', selectedFile = '3';
        beforeEach(function() {
          expect(GameBoardStore.getBoardState()[selectedFile][selectedRank].possibleMove).toBeTruthy();
        });

        it('invokes the square\'s move function on the board', function(){
          expect(possibleMoveFunction).not.toBeCalled();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(possibleMoveFunction).toBeCalled();
        });

        it('clears the selected status on the new and previous selections', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.selected; });
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.selected; });
          })).toBeFalsy();
        });

        it('clears any highlighted possible moves', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.possibleMove; });
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.possibleMove; });
          })).toBeFalsy();
        });
      });

      describe('and the target square is not a possible move', function() {
        var selectedRank = 'g';
        var selectedFile = '1';
        beforeEach(function() {
          expect(GameBoardStore.getBoardState()[selectedFile][selectedRank].possibleMove).toBeFalsy();
        });

        it('does not move the previously selected piece to the new square, replacing the current occupant', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[sourceFile][sourceRank]).toEqual(movedPiece);
          expect(GameBoardStore.getBoardState()[selectedFile][selectedRank]).not.toEqual(movedPiece);
        });

        it('clears the selected status on the new and previous selections', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.selected; });
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.selected; });
          })).toBeFalsy();
        });

        it('clears any highlighted possible moves', function() {
          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.possibleMove; });
          })).toBeTruthy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(_.any(GameBoardStore.getBoardState(), function(rank) {
            return _.any(rank, function(square) { return square.possibleMove; });
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
          rank: 'd',
          file: '2'
        });
        // Move white pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'd',
          file: '3'
        });

        // Select black pawn
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'd',
          file: '7'
        });
        // Move black pawn forward
        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: 'd',
          file: '6'
        });

        expect(GameBoardStore.getBoardState()['2']['d'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['3']['d'].piece).toEqual(Pieces.PAWN);
        expect(GameBoardStore.getBoardState()['3']['d'].side).toEqual(Pieces.sides.WHITE);

        expect(GameBoardStore.getBoardState()['7']['d'].piece).toBeFalsy();
        expect(GameBoardStore.getBoardState()['6']['d'].piece).toEqual(Pieces.PAWN);
        expect(GameBoardStore.getBoardState()['6']['d'].side).toEqual(Pieces.sides.BLACK);
      });
    });
  });
});
