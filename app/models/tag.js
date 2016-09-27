import Ember from 'ember';
import DS from 'ember-data';
var TagModel=DS.Model.extend({
	tag: DS.attr('string'),
	type: DS.attr('number'),
	count: DS.attr('number')
});
Ember.Inflector.inflector.uncountable('tag');
export default TagModel;