
describe('one', function() {
  beforeEach(module(function($provide) {
    $provide.value('foo', {
      one: function() {
        return 'one';
      }
    });
  }))

  it('should', inject(function(foo) {
    expect(foo.one()).toBe('one');
  }));
});


describe('two', function() {
  beforeEach(module(function($provide) {
    $provide.value('foo', {
      two: function() {
        return 'two';
      }
    });
  }))

  it('should', inject(function(foo) {
    expect(foo.two()).toBe('two');
  }));
});
