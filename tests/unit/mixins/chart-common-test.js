import Ember from 'ember';
import ChartCommonMixin from '../../../mixins/chart-common';
import { module, test } from 'qunit';

module('Unit | Mixin | chart common');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChartCommonObject = Ember.Object.extend(ChartCommonMixin);
  var subject = ChartCommonObject.create();
  assert.ok(subject);
});
