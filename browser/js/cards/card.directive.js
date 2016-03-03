'use strict';
app.directive('card', function() {
  return {
    restrict: 'E',
    scope: {
      value: '='
    },
    templateUrl: 'browser/js/cards/card.html'
  }
});
