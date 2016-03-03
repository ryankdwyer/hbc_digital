'use strict';
app.controller('GameLogicCtrl', function($scope, GameState) {
  $scope.cards = GameState.getCardsLeft();
  $scope.dieValues = GameState.getDieValues();
  $scope.message = `Welcome to Shut the Box. Click 'Start Game' to begin.`;
  $scope.gameStarted = GameState.getGameState();
  $scope.cardsToRemove = {};

  // Runs the game - intitiates all of the logic for each step of the game
  $scope.startTurn = () => {
    GameState.gameStarted = true;
    GameState.validCards = true;
    $scope.gameStarted = GameState.getGameState();
    $scope.cards = GameState.getCardsLeft();
    $scope.cardsToRemove = {};

    clearMessage();
    roll();

    if (isGameOver()) {
      let total = tallyTotal();
      $scope.message = `I'm sorry, you're out of turns! You scored: ${total} points!`;
      alert(`Please click 'Reset Game' to play again!`)
    } else {
      $scope.message = `Pick a set of cards that sums to a total of ${$scope.dieValues.one + $scope.dieValues.two}.`;
    }
  };

  // Adds or removes card from cardsToRemove obj
  // This also enables dynamic css class changes to change opacity
  $scope.toggleCardRemoval = (idx) => {
    if ($scope.cardsToRemove[idx + 1]) {
      $scope.cardsToRemove[idx + 1] = false;
    } else {
      if(validChoice(idx + 1)) {
        $scope.cardsToRemove[idx + 1] = true;
      }
    }
  };

  // Validates the set of cards and passes to GameState to remove the cards
  $scope.removeCards = () => {
    let total = $scope.dieValues.one + $scope.dieValues.two;
    if (sum($scope.cardsToRemove) === total) {
      GameState.removeCards($scope.cardsToRemove);
      $scope.startTurn();
    } else {
      $scope.message = `That is not a valid combination. Please pick a different set.`;
    }
  };

  // Helper function to reset game variables
  $scope.reset = () => {
    clearMessage();
    GameState.reset();
    $scope.cards = GameState.getCardsLeft();
    $scope.dieValues = GameState.getDieValues();
    $scope.gameStarted = GameState.getGameState();
    $scope.message = `Welcome to Shut the Box. Click 'Start Game' to begin.`;
    $scope.cardsToRemove = {};
  };

  // Generates 2 random numbers between 1 and 6
  let roll = () => {
    $scope.dieValues.one = Math.floor(Math.random() * ((6 - 1) + 1) + 1);

    // If there is only the '1' card left - only roll one die
    if ($scope.cards[0] !== 1 || $scope.cards.length !== 1) {
      $scope.dieValues.two = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    } else {
      $scope.dieValues.two = 0;
    }
    GameState.dieValues = $scope.dieValues;
  };

  // Validates the choice the user makes when they click on a card
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


  // Used to sum up the object of cardsToRemove
  let sum = (obj) => {
    let count = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) count += Number(key);
    }
    return count;
  };

  // Helper function to clear the scope message
  let clearMessage = () => {
    $scope.message = '';
  };

  // Helper function to check if there are any valid choices left
  let isGameOver = () => {
    GameState.buildValidCards();
    return GameState.getValidChoices() === false;
  };

  // Tallys the final score to display to the user.
  let tallyTotal = () => {
    return $scope.cards.reduce(function (prev, next) {
      if (next !== '') return prev + next;
      return prev;
    }, 0)
  };

});
