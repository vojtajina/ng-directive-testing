angular.module("tpl/pane.html", []).run(function($templateCache) {
  $templateCache.put("tpl/pane.html",
    "<div class=\"tab-pane\" ng-class=\"{active: selected}\" ng-transclude></div>" +
    "");
});
