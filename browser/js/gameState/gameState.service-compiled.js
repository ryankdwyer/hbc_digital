'use strict';
app.service('GameState', function () {
  var _this = this;

  this.gameStarted = false;
  this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.dieValues = { one: 0, two: 0 };
  this.validCards = [];
  this.cardsToRemove = [];

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

//# sourceMappingURL=gameState.service-compiled.js.map