'use strict';
app.controller('GameLogicCtrl', function($scope, GameState) {
  $scope.cards = GameState.getCardsLeft();
  $scope.dieValues = GameState.getDieValues();
  $scope.message = `Welcome to Shut the Box. Click 'Start Game' to begin.`;
  $scope.gameStarted = GameState.getGameState();
  $scope.cardsToRemove = {};

  $scope.startTurn = () => {
    GameState.gameStarted = true;
    $scope.gameStarted = GameState.getGameState();
    $scope.cards = GameState.getCardsLeft();
    $scope.cardsToRemove = {};

    clearMessage();
    roll();

    if (isGameOver()) {
      $scope.message = `I'm sorry, you're out of turns!`;
      alert(`Please click 'Reset Game' to play again!`)
    } else {
      $scope.message = `Pick a set of cards that sums to a total of ${$scope.dieValues.one + $scope.dieValues.two}.`;
    }
  };

  $scope.toggleCardRemoval = (idx) => {
    if ($scope.cardsToRemove[idx + 1]) {
      $scope.cardsToRemove[idx + 1] = false;
    } else {
      if(validChoice(idx + 1)) {
        $scope.cardsToRemove[idx + 1] = true;
      }
    }
  };

  $scope.removeCards = () => {
    let total = $scope.dieValues.one + $scope.dieValues.two;
    if (sum($scope.cardsToRemove) === total) {
      GameState.removeCards($scope.cardsToRemove);
      $scope.startTurn();
    } else {
      $scope.message = `That is not a valid combination. Please pick a different set.`;
    }
  };

  $scope.reset = () => {
    clearMessage();
    GameState.reset();
    $scope.cards = GameState.getCardsLeft();
    $scope.dieValues = GameState.getDieValues();
    $scope.gameStarted = GameState.getGameState();
    $scope.message = `Welcome to Shut the Box. Click 'Start Game' to begin.`;
    $scope.cardsToRemove = {};
  };

  let roll = () => {
    $scope.dieValues.one = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    if ($scope.cards[0] !== 1 || $scope.cards.length !== 1) {
      $scope.dieValues.two = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    } else {
      $scope.dieValues.two = 0;
    }
    GameState.dieValues = $scope.dieValues;
  };

  let validChoice = (card) => {
    if ($scope.cards.indexOf(card) === -1)  {
      $scope.message = `You already chose that card. Please pick another card.`;
      return false;
    }
    let total = $scope.dieValues.one + $scope.dieValues.two;
    if (card + sum($scope.cardsToRemove) > total) {
      $scope.message = `That is not a valid choice. Please pick another card.`;
      return false;
    }
    return true;
  };

  let sum = (obj) => {
    let count = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) count += Number(key);
    }
    return count;
  };

  let clearMessage = () => {
    $scope.message = '';
  };

  let isGameOver = () => {
    GameState.buildValidCards();
    let choices = GameState.getValidChoices();
    return choices.length === 0;
  }
});
