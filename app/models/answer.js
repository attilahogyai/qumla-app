import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	option: DS.attr('number'),
	question: DS.attr('number')
});
Ember.Inflector.inflector.uncountable('answer');
model.reopenClass({
FIXTURES:[
	{
	    id: 1,
	    question: 2,
	    option: 3,
	    city: 1,
	    hour: 2,
	    count: 10
	},
	{
	    id: 2,
	    option: 4,
	    question: 2,
	    city: 1,
	    hour: 2,
	    count: 13
	},
	{
	    id: 3,
	    option: 5,
	    question: 2,
	    city: 1,
	    hour: 2,
	    count: 20
	}
]
});
export default model;