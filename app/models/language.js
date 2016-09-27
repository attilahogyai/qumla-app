import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	code: DS.attr('string'),
	pcode: DS.attr('string'),
	name: DS.attr('string')
});

Ember.Inflector.inflector.uncountable('language');
export default model;