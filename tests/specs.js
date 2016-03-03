describe('GameState Service', function () {
  var GameState;

  beforeEach(function () {
    module('hbc');

    inject(function(_GameState_) {
      GameState = _GameState_;
    })
  });

  it('should have a buildValidCards function', function () {
    expect(angular.isFunction(GameState.buildValidCards)).toBe(true)
  });
  it('should return an array of valid card choices when calling buildValidCards', function () {
    GameState.dieValues.one = 1;
    GameState.dieValues.two = 1;
    GameState.buildValidCards();
    expect(GameState.validCards.length).toBe(1);
  });
  it('should have a buildPowerSet function', function () {
    expect(angular.isFunction(GameState.buildPowerSet)).toBe(true)
  });
  it('should have a removeCards function', function () {
    expect(angular.isFunction(GameState.removeCards)).toBe(true)
  });
  it('should remove cards when calling removeCards function', function () {
    var cardsToRemove = {'1': true};
    GameState.removeCards(cardsToRemove);
    expect(GameState.cards.length).toBe(9);
    expect(GameState.cards.indexOf(1)).toBe(-1);
  });
  it('should have a getCardsLeft function', function () {
    expect(angular.isFunction(GameState.getCardsLeft)).toBe(true)
  });
  it('should return an array of cards when calling getCardsLeft function', function () {
    expect(Array.isArray(GameState.getCardsLeft())).toBe(true);
    expect(GameState.getCardsLeft().length).toBe(9);
  });
  it('should have a getDieValues function', function () {
    expect(angular.isFunction(GameState.getDieValues)).toBe(true)
  });
  it('should return an object when calling the getDieValues function', function () {
    expect(typeof GameState.getDieValues()).toBe('object');
    expect(GameState.getDieValues().one).toBe(0);
    expect(GameState.getDieValues().two).toBe(0);
  });
  it('should have a getGameState function', function () {
    expect(angular.isFunction(GameState.getGameState)).toBe(true)
  });
  it('should return a boolean when calling the getGameState function', function () {
    expect(GameState.getGameState()).toBe(false)
  });
  it('should have a reset function', function () {
    expect(angular.isFunction(GameState.reset)).toBe(true)
  });
  it('should reset all starting game variables when calling the reset function', function () {
    GameState.gameStarted = true;
    GameState.cards = [1,2,3,6,7,8,9];
    GameState.dieValues = {one: 5, two: 4};
    GameState.validCards = [1,2,3];
    GameState.reset();
    expect(GameState.gameStarted).toBe(false);
    expect(GameState.cards.length).toBe(9);
    expect(GameState.dieValues.one).toBe(0);
    expect(GameState.dieValues.two).toBe(0);
    expect(GameState.validCards.length).toBe(0);
  });
  it('should have a getValidChoices function', function () {
    expect(angular.isFunction(GameState.getValidChoices)).toBe(true)
  });
});

describe('GameLogic Controller', function () {
  var $scope,
      ctrl,
      GameStateMock;

  beforeEach(function () {
    GameStateMock = jasmine.createSpyObj('GameState', ['getCardsLeft', 'getDieValues', 'getGameState', 'removeCards', 'getValidChoices']);
    module('hbc');

    inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();

      GameStateMock.getCardsLeft.andReturn([1,2,3,4,5,6,7,8,9]);
      GameStateMock.getDieValues.andReturn({one: 0, two: 0});
      GameStateMock.getGameState.andReturn(false);
      GameStateMock.removeCards.andReturn();
      GameStateMock.getValidChoices.andReturn([[2]]);

      ctrl = $controller('GameLogicCtrl', {
        $scope: $scope,
        GameStateMock: GameStateMock
      })
    })
  });

  it('should start with the correct scope variables', function () {
    expect($scope.cards.length).toBe(9);
    expect($scope.dieValues.one).toBe(0);
    expect($scope.dieValues.two).toBe(0);
    expect($scope.message).toBe(`Welcome to Shut the Box. Click 'Start Game' to begin.`);
    expect($scope.gameStarted).toBe(false);
    expect($scope.cardsToRemove).toEqual(jasmine.any(Object));
  });
  it('should have a startTurn function', function () {
    expect(angular.isFunction($scope.startTurn)).toBe(true);
  });
  it('should have a toggleCardRemoval function', function () {
    expect(angular.isFunction($scope.toggleCardRemoval)).toBe(true);
  });
  it('should add a card to the cardsToRemove object when calling toggleCardRemoval', function () {
    $scope.startTurn();
    $scope.toggleCardRemoval(0);
    expect($scope.cardsToRemove[1]).toBe(true);
  });
  it('should have a removeCards function', function () {
    expect(angular.isFunction($scope.removeCards)).toBe(true);
  });
  it('should update $scope.message when calling the startTurn function', function () {
    $scope.startTurn();
    expect($scope.message).toNotEqual(`Welcome to Shut the Box. Click 'Start Game' to begin.`)
  });
  it('should have a reset function', function () {
    expect(angular.isFunction($scope.reset)).toBe(true);
  });
  it('should reset all scope variables when calling reset', function () {
    $scope.cards = [1]
    $scope.dieValues = {one: 5, two: 6}
    $scope.message = `TEST TEST`;
    $scope.gameStarted = true;
    $scope.cardsToRemove = 'not an object';

    $scope.reset();
    expect($scope.cards.length).toBe(9);
    expect($scope.dieValues.one).toBe(0);
    expect($scope.dieValues.two).toBe(0);
    expect($scope.gameStarted).toBe(false);
    expect($scope.message).toBe(`Welcome to Shut the Box. Click 'Start Game' to begin.`);
    expect($scope.cardsToRemove).toEqual(jasmine.any(Object));
  })
});

describe('Card directive', function () {
  var element,
      scope;
  beforeEach(function () {
    module('hbc');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      element = "<div class='card'><div>{{value}}</div> </div>"
      scope.value = 5;
      element = $compile(element)(scope);
      scope.$digest();
    })
  });

  it('should have a value of 5', function () {
    expect(Number(element.text())).toBe(5);
  })
});

describe('Dice directive', function () {
  var element,
    scope;
  beforeEach(function () {
    module('hbc');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      element = "<span> {{die}}</span>";
      scope.die = 5;
      element = $compile(element)(scope);
      scope.$digest();
    })
  });

  it('should have a die value of 5', function () {
    expect(Number(element.text())).toBe(5);
  })
});
