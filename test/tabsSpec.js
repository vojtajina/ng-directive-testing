describe('tabs', function() {
  var elm, scope;

  // load the tabs code
  beforeEach(module('tabs'));

  // load the templates
  beforeEach(module('tpl/tabs.html', 'tpl/pane.html'));

  beforeEach(inject(function($rootScope, $compile) {
    // we might move this tpl into an html file as well...
    elm = angular.element(
      '<div>' +
        '<tabs>' +
          '<pane title="First Tab">' +
            'first content is {{first}}' +
          '</pane>' +
          '<pane title="Second Tab">' +
            'second content is {{second}}' +
          '</pane>' +
        '</tabs>' +
      '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
  }));


  it('should create clickable titles', function() {
    var titles = elm.find('ul.nav-tabs li a');

    expect(titles.length).toBe(2);
    expect(titles.eq(0).text()).toBe('First Tab');
    expect(titles.eq(1).text()).toBe('Second Tab');
  });


  it('should bind the content', function() {
    var contents = elm.find('div.tab-content div.tab-pane');

    expect(contents.length).toBe(2);
    expect(contents.eq(0).text()).toBe('first content is ');
    expect(contents.eq(1).text()).toBe('second content is ');

    scope.$apply(function() {
      scope.first = 123;
      scope.second = 456;
    });

    expect(contents.eq(0).text()).toBe('first content is 123');
    expect(contents.eq(1).text()).toBe('second content is 456');
  });


  it('should set active class on title', function() {
    var titles = elm.find('ul.nav-tabs li');

    expect(titles.eq(0)).toHaveClass('active');
    expect(titles.eq(1)).not.toHaveClass('active');
  });


  it('should set active class on content', function() {
    var contents = elm.find('div.tab-content div.tab-pane');

    expect(contents.eq(0)).toHaveClass('active');
    expect(contents.eq(1)).not.toHaveClass('active');
  });


  it('should change active pane when title clicked', function() {
    var titles = elm.find('ul.nav-tabs li');
    var contents = elm.find('div.tab-content div.tab-pane');

    // click the second tab
    titles.eq(1).find('a').click();

    // second title should be active
    expect(titles.eq(0)).not.toHaveClass('active');
    expect(titles.eq(1)).toHaveClass('active');

    // second content should be active
    expect(contents.eq(0)).not.toHaveClass('active');
    expect(contents.eq(1)).toHaveClass('active');
  });
});


describe('tabs controller', function() {
  var scope, ctrl;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope;

    // instantiate the controller stand-alone, without the directive
    ctrl = $controller(TabsController, {$scope: scope, $element: null});
  }));


  describe('select', function() {

    it('should mark given pane selected', function() {
      var pane = {};

      scope.select(pane);
      expect(pane.selected).toBe(true);
    });


    it('should deselect other panes', function() {
      var pane1 = {}, pane2 = {}, pane3 = {};

      ctrl.addPane(pane1);
      ctrl.addPane(pane2);
      ctrl.addPane(pane3);

      scope.select(pane1);
      expect(pane1.selected).toBe(true);
      expect(pane2.selected).toBe(false);
      expect(pane3.selected).toBe(false);

      scope.select(pane2);
      expect(pane1.selected).toBe(false);
      expect(pane2.selected).toBe(true);
      expect(pane3.selected).toBe(false);

      scope.select(pane3);
      expect(pane1.selected).toBe(false);
      expect(pane2.selected).toBe(false);
      expect(pane3.selected).toBe(true);
    });
  });


  describe('addPane', function() {

    it('should append pane', function() {
      var pane1 = {}, pane2 = {};

      expect(scope.panes).toEqual([]);

      ctrl.addPane(pane1);
      expect(scope.panes).toEqual([pane1]);

      ctrl.addPane(pane2);
      expect(scope.panes).toEqual([pane1, pane2]);
    });


    it('should select the first one', function() {
      var pane1 = {}, pane2 = {};

      ctrl.addPane(pane1);
      expect(pane1.selected).toBe(true);

      ctrl.addPane(pane2);
      expect(pane1.selected).toBe(true);
    });
  });
});
