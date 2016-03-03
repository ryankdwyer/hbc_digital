'use strict';
app.directive('game', function() {
  return {
    restrict: 'E',
    templateUrl: '../views/game.html',
    controller: 'GameLogicCtrl'
  }
});