# Testing directive – the easy way

Directives in [AngularJS] encapsulate all of the custom DOM manipulation that happens in an AngularJS application.
This makes them very crucial part of a bigger Angular app.
DOM manipulation is often source of problems, especially when it comes to browser inconsistencies.
This is why it is important to cover the directive code with automated tests.
Unfortunately many developers consider any kind of DOM manipulation to be too hard to test so this code more often than not lives a sad life of untested code full of creepy bugs.

The goal of this example is to show how to test directives easily and become confident that the directive code works and works on all targeted browsers.


Let’s take the tabs component from [angular homepage].

It would be difficult to test the visual representation of the component, but there are many functional aspects of this component that are worthy testing, for instance:

- does it render correct structure (eg. navigation and content for each pane)
- does the binding inside the content works
- does clicking particular tab link cause changing of the active pane
- is the first tab selected by default

Check out the tests at https://github.com/vojtajina/ng-directive-testing/blob/start/test/tabsSpec.js

Executing these tests is easy, we just ask for `$compile` and compile given DOM structure.
Then, we can use jQuery to assert, whether the component works as expected.

Note, that we don’t append the DOM structure to the document.
That makes the tests faster, because browser does not have to render it.
So unless it’s necessary (eg. you need to know some computed property of some DOM element), don’t attach nodes to the document.

The spectrum of tests is not discrete, there are not just unit tests or e2e tests.
The previous tests are probably not unit tests, these are little bit higher level tests.
It’s always good to try to cover stuff with as low as possible test.
So in this example, we might actually [extract the tabs controller and test it separately](https://github.com/vojtajina/ng-directive-testing/commit/test-controller).

Yep, in this case, it’s just duplicating - we already covered this functionality in the higher level tests above.
But now, once we have this little framework for testing the controller separately, we can easily add more tests.
For instance, if we found a bug in the controller, we would add a lightweight unit test just for the controller, instead of the entire directive.

This was nice, but how about external templates ?
Inlining html templates as strings is kind of nasty (eg. you don’t get syntax highlighting and linting in IDE), so we want to put the templates into external html files.
How do you test that? You want to test these html files as well, otherwise it makes no sense.
Well, with [Testacular] this is pretty easy - [you can use preprocessors for that](https://github.com/vojtajina/ng-directive-testing/commit/use-preprocessor).

Now, whenever you change any of the html files, Testacular immediately generates the js file, that puts the html into `$templateCache`.

------

Note, you need testacular v0.3.0+ to use this feature, so install canary to try it.

    npm install -g testacular@canary


There's also a grunt task to watch the templates and generate the js file, that puts the template into `$templateCache`.

    grunt watch:templates


[AngularJS]: http://angularjs.org
[angular homepage]: http://angularjs.org/#create-components
[Testacular]: https://github.com/vojtajina/testacular
