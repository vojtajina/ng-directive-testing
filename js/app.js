(function () {
  'use strict';

  angular.module('app', ['tabs'])

    .controller('BeerCounter', function($scope, $locale) {
      $scope.beers = [0, 1, 2, 3, 4, 5, 6];
      if ($locale.id == 'en-us') {
        $scope.beerForms = {
          0: 'no beers',
          one: '{} beer',
          other: '{} beers'
        };
      } else {
        $scope.beerForms = {
          0: 'žiadne pivo',
          one: '{} pivo',
          few: '{} pivá',
          other: '{} pív'
        };
      }
    });
})();