import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	email: DS.attr('string'),
	question: DS.attr('number'),
	category: DS.attr('string')
});
Ember.Inflector.inflector.uncountable('subscription');

export default model;