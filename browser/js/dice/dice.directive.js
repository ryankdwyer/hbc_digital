'use strict';

app.directive('die', function() {
  return {
    restrict: 'E',
    scope: {
      die: '=die'
    },
    templateUrl: '../views/dice.html'
  }
});