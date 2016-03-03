'use strict';
app.service('GameState', function() {
  this.gameStarted = false;
  this.cards = [1,2,3,4,5,6,7,8,9];
  this.dieValues = {one: 0, two: 0};
  this.validCards = [];
  this.cardsToRemove = [];

  this.buildValidCards = () => {
    var powerSet = this.buildPowerSet();
    var value = this.dieValues.one + this.dieValues.two;
    this.validCards = powerSet.filter(function(set) {
      if (set[0] > value) return false;
      return value === set.reduce(function(prev, next) {
          return prev + next;
        }, 0)
    });
  };

  this.buildPowerSet = () => {
    if (this.cards.length === 1) return [this.cards[0]];
    var powerSet = [[]];
    for (var i = 0; i < this.cards.length; i++) {
      for (var j = 0, len = powerSet.length; j < len; j++) {
        powerSet.push(powerSet[j].concat(this.cards[i]));
      }
    }
    return powerSet;
  };

  this.removeCards = (cards) => {
    for (var i = 0; i < cards.length; i++) {
      this.cards.splice(cards[i] - 1, 1, '');
    }
  };

  this.getCardsLeft = () => {
    return this.cards;
  };

  this.getDieValues = () => {
    return this.dieValues;
  };

  this.getValidChoices = () => {
    return this.validCards;
  };

  this.getGameState = () => {
    return this.gameStarted;
  };

  this.reset = () => {
    this.gameStarted = false;
    this.cards = [1,2,3,4,5,6,7,8,9];
    this.dieValues = {one: 0, two: 0};
    this.validCards = [];
    this.cardsToRemove = [];
  };
});