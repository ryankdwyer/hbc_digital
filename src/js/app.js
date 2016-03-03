'use strict';

var app = angular.module('hbc', []);
'use strict';

app.directive('card', function () {
  return {
    restrict: 'E',
    scope: {
      value: '='
    },
    templateUrl: '../views/card.html'
  };
});
'use strict';

app.directive('game', function () {
  return {
    restrict: 'E',
    templateUrl: '../views/game.html',
    controller: 'GameLogicCtrl'
  };
});
'use strict';

app.controller('GameLogicCtrl', function ($scope, GameState) {
  $scope.cards = GameState.getCardsLeft();
  $scope.dieValues = GameState.getDieValues();
  $scope.message = 'Welcome to Shut the Box. Click \'Start Game\' to begin.';
  $scope.gameStarted = GameState.getGameState();
  $scope.cardsToRemove = {};

  // Runs the game - intitiates all of the logic for each step of the game
  $scope.startTurn = function () {
    GameState.gameStarted = true;
    GameState.validCards = true;
    $scope.gameStarted = GameState.getGameState();
    $scope.cards = GameState.getCardsLeft();
    $scope.cardsToRemove = {};

    clearMessage();
    roll();

    if (isGameOver()) {
      $scope.message = 'I\'m sorry, you\'re out of turns!';
      alert('Please click \'Reset Game\' to play again!');
    } else {
      $scope.message = 'Pick a set of cards that sums to a total of ' + ($scope.dieValues.one + $scope.dieValues.two) + '.';
    }
  };

  // Adds or removes card from cardsToRemove obj
  // This also enables dynamic css class changes to change opacity
  $scope.toggleCardRemoval = function (idx) {
    if ($scope.cardsToRemove[idx + 1]) {
      $scope.cardsToRemove[idx + 1] = false;
    } else {
      if (validChoice(idx + 1)) {
        $scope.cardsToRemove[idx + 1] = true;
      }
    }
  };

  // Validates the set of cards and passes to GameState to remove the cards
  $scope.removeCards = function () {
    var total = $scope.dieValues.one + $scope.dieValues.two;
    if (sum($scope.cardsToRemove) === total) {
      GameState.removeCards($scope.cardsToRemove);
      $scope.startTurn();
    } else {
      $scope.message = 'That is not a valid combination. Please pick a different set.';
    }
  };

  // Helper function to reset game variables
  $scope.reset = function () {
    clearMessage();
    GameState.reset();
    $scope.cards = GameState.getCardsLeft();
    $scope.dieValues = GameState.getDieValues();
    $scope.gameStarted = GameState.getGameState();
    $scope.message = 'Welcome to Shut the Box. Click \'Start Game\' to begin.';
    $scope.cardsToRemove = {};
  };

  // Generates 2 random numbers between 1 and 6
  var roll = function roll() {
    $scope.dieValues.one = Math.floor(Math.random() * (6 - 1 + 1) + 1);

    // If there is only the '1' card left - only roll one die
    if ($scope.cards[0] !== 1 || $scope.cards.length !== 1) {
      $scope.dieValues.two = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    } else {
      $scope.dieValues.two = 0;
    }
    GameState.dieValues = $scope.dieValues;
  };

  // Validates the choice the user makes when they click on a card
  var validChoice = function validChoice(card) {
    if ($scope.cards.indexOf(card) === -1) {
      $scope.message = 'You already chose that card. Please pick another card.';
      return false;
    }
    var total = $scope.dieValues.one + $scope.dieValues.two;
    if (card + sum($scope.cardsToRemove) > total) {
      $scope.message = 'That is not a valid choice. Please pick another card.';
      return false;
    }
    return true;
  };

  // Used to sum up the object of cardsToRemove
  var sum = function sum(obj) {
    var count = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) count += Number(key);
    }
    return count;
  };

  // Helper function to clear the scope message
  var clearMessage = function clearMessage() {
    $scope.message = '';
  };

  // Helper function to check if there are any valid choices left
  var isGameOver = function isGameOver() {
    GameState.buildValidCards();
    return GameState.getValidChoices() === false;
  };
});
'use strict';

app.directive('die', function () {
  return {
    restrict: 'E',
    scope: {
      die: '=die'
    },
    templateUrl: '../views/dice.html'
  };
});
'use strict';

app.service('GameState', function () {
  var _this = this;

  // Game state variables
  this.gameStarted = false;
  this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.dieValues = { one: 0, two: 0 };
  this.validCards = false;

  // Builds an array of valid choices the user can make
  // As soon as it find 1 valid match - it exits to lessen run time
  this.buildValidCards = function () {
    var powerSet = _this.buildPowerSet();
    var value = _this.dieValues.one + _this.dieValues.two;
    _this.validCards = powerSet.some(function (set) {
      if (set[0] > value) return false;
      return value === set.reduce(function (prev, next) {
        return prev + next;
      }, 0);
    });
  };

  this.buildPowerSet = function () {
    if (_this.cards.length === 1) return [_this.cards[0]];
    var powerSet = [[]];
    for (var i = 0; i < _this.cards.length; i++) {
      for (var j = 0, len = powerSet.length; j < len; j++) {
        powerSet.push(powerSet[j].concat(_this.cards[i]));
      }
    }
    return powerSet;
  };

  this.removeCards = function (cards) {
    for (var key in cards) {
      if (cards.hasOwnProperty(key) && cards[key]) {
        _this.cards.splice(key - 1, 1, '');
      }
    }
  };

  this.getCardsLeft = function () {
    return _this.cards;
  };

  this.getDieValues = function () {
    return _this.dieValues;
  };

  this.getValidChoices = function () {
    return _this.validCards;
  };

  this.getGameState = function () {
    return _this.gameStarted;
  };

  this.reset = function () {
    _this.gameStarted = false;
    _this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    _this.dieValues = { one: 0, two: 0 };
    _this.validCards = false;
  };
});