import DS from 'ember-data';
import Ember from 'ember';

var model = DS.Model.extend({
	childs: [],
	option: DS.belongsTo('option'),
	question: DS.belongsTo('question'),
	location: DS.belongsTo('location',{async: false}),
	country: DS.belongsTo('country',{async: false}),
	hour: DS.attr('number'),
	answerdate: DS.attr('datetime'),
	count: DS.attr('number'),
	percent: DS.attr('number'),
	total: DS.attr('number'),
	color: DS.attr('string'),
	copy: function(){
		var c=new Ember.Object();
		c.set('option',this.get('option'));
		c.set('question',this.get('question'));
		c.set('location',this.get('location'));
		c.set('hour',this.get('hour'));
		c.set('answerdate',this.get('answerdate'));							
		c.set('total',this.get('total'));							
		c.set('percent',this.get('percent'));							
		c.set('count',this.get('count'));							
		c.set('country',this.get('country'));		
		c.set('color',this.get('color'));								
		c.set('childs',[]);											
		return c;
	}
});
Ember.Inflector.inflector.uncountable('answerstat');
export default model;