import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:unique-loginname', 'Unit | Validator | unique-loginname', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
