import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	answer: null,
	text: DS.attr('string'),
	question: DS.belongsTo('question'),
	style: DS.attr('string'),
	ord: DS.attr('number'),
	color: DS.attr('string'),
	index: DS.attr('number'),
	isSelected: Ember.computed('answer',function(){
		return this.get('answer')===this.get('id');
	})

});
Ember.Inflector.inflector.uncountable('option');

export default model;