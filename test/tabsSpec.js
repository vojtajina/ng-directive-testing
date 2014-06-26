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

  // NOTE: All these tests take into account that the directive has been "replaced"
  // with the tpl code provided to the directive
  // =========================================================================

  /**
   * This test checks that the title attribute was correctly applied to the <a> links
   * inside the panes.
   * 
   *   - Looks up the [DOM element] nav tab <a> links
   *   - Checks that the links exist with .length
   *   - Checks the .text() to confirm that the title text is correctly bound inside
   *   
   */
  it('should create clickable titles', inject(function($compile, $rootScope) {
    var titles = elm.find('ul.nav-tabs li a');

    expect(titles.length).toBe(2);
    expect(titles.eq(0).text()).toBe('First Tab');
    expect(titles.eq(1).text()).toBe('Second Tab');
  }));


  /**
   * This test checks that the tab pane content was correctly bound to the dom.
   * The way it checks the bindings:
   * 
   *   - Looks up the [DOM element] pane content that should contain the inner bindings
   *   - Checks to see that the elements exist with .length
   *   - Checks to see that there is no content when no model is available
   *   - Creates two variables on the scope that will be bound in the directive
   *   - Checks that the directive contains the correct binding
   *   
   */
  it('should bind the content', function() {
    var contents = elm.find('.tab-pane');

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

  /**
   * This test checks that the active class was correctly set on the title with ng-class.
   *
   *  - Looks up the [DOM element] pane title that should contain the active class, "li"
   *  - Checks that the first element contains the .active class
   *  - Checks that the second element does not contain the .active class
   *  
   */
  it('should set active class on title', function() {
    var titles = elm.find('ul.nav-tabs li');

    expect(titles.eq(0)).toHaveClass('active');
    expect(titles.eq(1)).not.toHaveClass('active');
  });

  /**
   * This test checks that the active class was correctly set on the tab content.
   *   
   *   - Looks up the [DOM element] tab pane that should contain the active class
   *   - Checks that the first element contains the active classs
   *   - Checks that the second element does not contain the active class
   *   
   */
  it('should set active class on content', function() {
    var contents = elm.find('div.tab-content div.tab-pane');

    expect(contents.eq(0)).toHaveClass('active');
    expect(contents.eq(1)).not.toHaveClass('active');
  });


  /**
   * This test checks that the active pane was changed when a different title was selected.
   *   
   *   - Looks up the [DOM element] titles that should contain the active class
   *   - Looks up the [DOM element] contents that should contain the active class
   *   - Dispatches a click event on the second tab
   *   - Checks that first title does not contain the active class
   *   - Checks that second title does contain the active class
   *   - Checks that the first contents does not contain the active class
   *   - Ckecks that the second contents does contain the active class
   *   
   */
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


/**
 * This suite of tests checks whether the tabs controller works as expected against the inside panes
 */
describe('tabs controller', function() {
  var scope, ctrl;

  // inject the $controller and $rootscope service
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope;

    // instantiate the controller stand-alone, without the directive
    ctrl = $controller(TabsController, {$scope: scope, $element: null});
  }));


  describe('select', function() {
    /**
     * This test checks that a pane has been selected correctly.
     * 
     *   - Mocks a pane scope
     *   - Selects the pane from the controller scope
     *   - Checks that the pane has a {selected} property that equals {true}
     *   
     */
    it('should mark given pane selected', function() {
      var pane = {};

      scope.select(pane);
      expect(pane.selected).toBe(true);
    });

    /**
     * This test checks that panes are de-selected correctly
     * 
     *   - Create multiple mock scopes that should each be de-selected
     *   - Create multiple panes using the controller utiltiy method
     *   - Select the first pane
     *   - Check that other panes are de-selected
     *   - Select the second pane
     *   - Check that the other panes are de-selected
     *   - Select the third pane
     *   - Check that the other panes are de-selected
     *   
     */
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

    /**
     * This test checks the a pane has been correctly appended to tabs scope
     * 
     *   - Create multiple mock scopes that should be appended to the tabs scope
     *   - Add the first pane to the tabs scope with the utility method
     *   - Check that the first pane was correctly added to the tabs scope
     *   - Add the second pane to the tabs scope with the utility method
     *   - Check that the second pane was correctly added the the tabs scope
     *   
     */
    it('should append pane', function() {
      var pane1 = {}, pane2 = {};

      expect(scope.panes).toEqual([]);

      ctrl.addPane(pane1);
      expect(scope.panes).toEqual([pane1]);

      ctrl.addPane(pane2);
      expect(scope.panes).toEqual([pane1, pane2]);
    });

    /**
     * This test checks the first pane is and remains selected when adding multiple panes
     *
     *  - Creates multiple mocks scopes that should be appended to the tabs scope
     *  - Add the first pane to the tabs scope
     *  - Check that the first pane is selected
     *  - Add the second pane to the tabs scope
     *  - Check that the second pane is still selected
     *  
     */
    it('should select the first one', function() {
      var pane1 = {}, pane2 = {};

      ctrl.addPane(pane1);
      expect(pane1.selected).toBe(true);

      ctrl.addPane(pane2);
      expect(pane1.selected).toBe(true);
    });
  });
});
