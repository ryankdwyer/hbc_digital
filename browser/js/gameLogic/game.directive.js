'use strict';
app.directive('game', function() {
  return {
    restrict: 'E',
    templateUrl: 'browser/js/gameLogic/game.html',
    controller: 'GameLogicCtrl'
  }
});