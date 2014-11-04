// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function () {
  jasmine.addMatchers({
    toHaveClass: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          return {
            pass: actual.hasClass(expected),
            message: "Expected '" + angular.mock.dump(actual) + "' to have class '" + expected + "'."
          };
        }
      };
    }
  });
});
