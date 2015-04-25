jest.dontMock('../GameBoardStore');
jest.dontMock('../../models/Board');

var _ = require('lodash');

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

        it('highlights the selected piece\'s possible moves', function() {
          PossibleMoves.mockReturnValue(['g4', 'c3']);

          expect(GameBoardStore.getBoardState()['g']['4'].possibleMove).toBeFalsy();
          expect(GameBoardStore.getBoardState()['c']['3'].possibleMove).toBeFalsy();

          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()['g']['4'].possibleMove).toBeTruthy();
          expect(GameBoardStore.getBoardState()['c']['3'].possibleMove).toBeTruthy();
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

      var possibleMove1 = 'h8';
      var possibleMove2 = 'a7';

      beforeEach(function(){
        PossibleMoves = require('../../services/PossibleMoves');
        PossibleMoves.mockReturnValue([possibleMove1, possibleMove2]);

        movedPiece = GameBoardStore.getBoardState()[sourceRank][sourceFile];
        expect(movedPiece.piece).toBeTruthy();

        handleAction({
          actionType: Actions.SELECT_SQUARE,
          rank: sourceRank,
          file: sourceFile
        });

        expect(movedPiece.selected).toBeTruthy();
      });

      describe('and the target square is a possible move', function() {
        var selectedRank = possibleMove1[0];
        var selectedFile = possibleMove1[1];
        beforeEach(function() {
          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].possibleMove).toBeTruthy();
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
          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile].possibleMove).toBeFalsy();
        });

        it('does not move the previously selected piece to the new square, replacing the current occupant', function(){
          handleAction({
            actionType: Actions.SELECT_SQUARE,
            rank: selectedRank,
            file: selectedFile
          });

          expect(GameBoardStore.getBoardState()[sourceRank][sourceFile]).toEqual(movedPiece);
          expect(GameBoardStore.getBoardState()[selectedRank][selectedFile]).not.toEqual(movedPiece);
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
      beforeEach(function(){
        PossibleMoves = require('../../services/PossibleMoves');
        PossibleMoves.mockImplementation(function(board, position){
          if(position == 'b4') {
            return ['c4'];
          }
          if(position == 'g4') {
            return ['f4'];
          }
        });
      });

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
