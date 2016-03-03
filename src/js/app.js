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

  this.gameStarted = false;
  this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.dieValues = { one: 0, two: 0 };
  this.validCards = [];

  this.buildValidCards = function () {
    var powerSet = _this.buildPowerSet();
    var value = _this.dieValues.one + _this.dieValues.two;
    _this.validCards = powerSet.filter(function (set) {
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
    _this.validCards = [];
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

  $scope.startTurn = function () {
    GameState.gameStarted = true;
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

  $scope.toggleCardRemoval = function (idx) {
    if ($scope.cardsToRemove[idx + 1]) {
      $scope.cardsToRemove[idx + 1] = false;
    } else {
      if (validChoice(idx + 1)) {
        $scope.cardsToRemove[idx + 1] = true;
      }
    }
  };

  $scope.removeCards = function () {
    var total = $scope.dieValues.one + $scope.dieValues.two;
    if (sum($scope.cardsToRemove) === total) {
      GameState.removeCards($scope.cardsToRemove);
      $scope.startTurn();
    } else {
      $scope.message = 'That is not a valid combination. Please pick a different set.';
    }
  };

  $scope.reset = function () {
    clearMessage();
    GameState.reset();
    $scope.cards = GameState.getCardsLeft();
    $scope.dieValues = GameState.getDieValues();
    $scope.gameStarted = GameState.getGameState();
    $scope.message = 'Welcome to Shut the Box. Click \'Start Game\' to begin.';
    $scope.cardsToRemove = {};
  };

  var roll = function roll() {
    $scope.dieValues.one = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    if ($scope.cards[0] !== 1 || $scope.cards.length !== 1) {
      $scope.dieValues.two = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    } else {
      $scope.dieValues.two = 0;
    }
    GameState.dieValues = $scope.dieValues;
  };

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

  var sum = function sum(obj) {
    var count = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) count += Number(key);
    }
    return count;
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