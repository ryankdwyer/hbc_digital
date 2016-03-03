'use strict';

app.directive('die', function() {
  return {
    restrict: 'E',
    scope: {
      die: '=die'
    },
    templateUrl: 'browser/js/dice/dice.html'
  }
});