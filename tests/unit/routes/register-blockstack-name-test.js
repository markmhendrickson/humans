import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | register-blockstack-name', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:register-blockstack-name');
    assert.ok(route);
  });
});
