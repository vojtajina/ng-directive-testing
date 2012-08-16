describe('tabs', function() {

  // load the app code
  beforeEach(module('app'));

  // load the templates
  beforeEach(module('tpl/tabs.html', 'tpl/pane.html'));

  it('should just work', inject(function($compile, $rootScope) {
    // we might move this tpl into an html file as well...
    var elm = angular.element('<div>' +
    '<tabs>' +
      '<pane title="Localization">' +
        'Date: {{ \'2012-04-01\' | date:\'fullDate\' }} <br>' +
        'Currency: {{ 123456 | currency }} <br>' +
        'Number: {{ 98765.4321 | number }} <br>' +
      '</pane>' +
      '<pane title="Pluralization">' +
        '<div ng-controller="BeerCounter">' +
          '<div ng-repeat="beerCount in beers">' +
            '<ng-pluralize count="beerCount" when="beerForms"></ng-pluralize>' +
          '</div>' +
        '</div>' +
      '</pane>' +
    '</tabs>' +
    '</div>');

    $compile(elm)($rootScope);

    // to resolve the promise...
    $rootScope.$digest();

    expect(elm.find('ul').find('li').length).toBe(2);
  }));
});
