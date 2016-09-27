import Ember from 'ember';
import QuestionActionsMixin from '../../../mixins/question-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | question actions');

// Replace this with your real tests.
test('it works', function(assert) {
  var QuestionActionsObject = Ember.Object.extend(QuestionActionsMixin);
  var subject = QuestionActionsObject.create();
  assert.ok(subject);
});
