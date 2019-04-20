import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | human/post', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:human/post');
    assert.ok(route);
  });
});
