'use strict';
app.directive('card', function() {
  return {
    restrict: 'E',
    scope: {
      value: '='
    },
    templateUrl: '../views/card.html'
  }
});
