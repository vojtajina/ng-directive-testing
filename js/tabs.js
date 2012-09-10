var tabs = angular.module('tabs', []);


var TabsController = function($scope, $element) {
  var panes = $scope.panes = [];

  $scope.select = function(pane) {
    angular.forEach(panes, function(pane) {
      pane.selected = false;
    });
    pane.selected = true;
  };

  this.addPane = function(pane) {
    if (!panes.length) $scope.select(pane);
    panes.push(pane);
  };
};

tabs.directive('tabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: TabsController,
    templateUrl: 'tpl/tabs.html',
    replace: true
  };
});


tabs.directive('pane', function() {
  return {
    require: '^tabs',
    restrict: 'E',
    transclude: true,
    scope: { title: '@' },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    templateUrl: 'tpl/pane.html',
    replace: true
  };
});
