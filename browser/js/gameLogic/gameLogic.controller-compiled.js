'use strict';
app.controller('GameLogicCtrl', function ($scope, GameState) {
  $scope.cards = GameState.getCardsLeft();
  $scope.dieValues = GameState.getDieValues();
  $scope.message = 'Welcome to Shut the Box. Click \'Start Game\' to begin.';
  $scope.gameStarted = GameState.getGameState();

  $scope.cardsToRemove = [];

  $scope.roll = function () {
    GameState.gameStarted = true;
    $scope.gameStarted = GameState.getGameState();
    clearMessage();
    $scope.dieValues.one = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    if ($scope.cards[0] !== 1 || $scope.cards.length !== 1) {
      $scope.dieValues.two = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    } else {
      $scope.dieValues.two = 0;
    }
    GameState.dieValues = $scope.dieValues;
    if (isGameOver()) {
      $scope.message = 'I\'m sorry, you\'re out of turns!';
    } else {
      $scope.message = 'Pick a set of cards that sums to the total of your die roll.';
    }
  };

  $scope.toggleCardRemoval = function (event, idx) {
    clearMessage();
    var cardElement = angular.element(event.target);
    if (cardElement.hasClass('translucent')) {
      cardElement.removeClass('translucent');
      $scope.cardsToRemove = $scope.cardsToRemove.filter(function (card) {
        return card !== idx + 1;
      });
    } else {
      if (validChoice(idx + 1)) {
        cardElement.addClass('translucent');
        $scope.cardsToRemove.push(idx + 1);
      }
    }
  };

  $scope.removeCards = function () {
    var total = $scope.dieValues.one + $scope.dieValues.two;
    if (sum($scope.cardsToRemove) === total) {
      GameState.removeCards($scope.cardsToRemove);
      $scope.reset();
      $scope.roll();
    } else {
      $scope.message = 'That is not a valid combination. Please pick a different set.';
    }
  };

  var validChoice = function validChoice(card) {
    var total = $scope.dieValues.one + $scope.dieValues.two;
    if (card > total || card + sum($scope.cardsToRemove) > total) {
      $scope.message = 'That is not a valid choice. Please pick another card.';
      return false;
    }
    return true;
  };

  $scope.reset = function () {
    clearMessage();
    GameState.reset();
    $scope.cardsToRemove = [];
    $scope.dieValues.one = 0;
    $scope.dieValues.two = 0;
  };

  var sum = function sum(arr) {
    return arr.reduce(function (prev, next) {
      return prev + next;
    }, 0);
  };

  var clearMessage = function clearMessage() {
    $scope.message = '';
  };

  var isGameOver = function isGameOver() {
    GameState.buildValidCards();
    var choices = GameState.getValidChoices();
    return choices.length === 0;
  };
});

//# sourceMappingURL=gameLogic.controller-compiled.js.map