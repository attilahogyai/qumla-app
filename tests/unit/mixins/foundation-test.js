import Ember from 'ember';
import FoundationMixin from '../../../mixins/foundation';
import { module, test } from 'qunit';

module('Unit | Mixin | foundation');

// Replace this with your real tests.
test('it works', function(assert) {
  var FoundationObject = Ember.Object.extend(FoundationMixin);
  var subject = FoundationObject.create();
  assert.ok(subject);
});
