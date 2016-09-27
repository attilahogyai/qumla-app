import DS from 'ember-data';
import Ember from 'ember';

var model = DS.Model.extend({
	childs: [],
	option: DS.belongsTo('option'),
	question: DS.belongsTo('question'),
	count: DS.attr('number'),
	firstdate: DS.attr('datetime'),
	percent: DS.attr('number'),
	total: DS.attr('number'),
	color: DS.attr('string'),
	copy: function(){
		var c=new Ember.Object();
		c.set('option',this.get('option'));
		c.set('question',this.get('question'));
		c.set('total',this.get('total'));							
		c.set('percent',this.get('percent'));							
		c.set('count',this.get('count'));							
		c.set('color',this.get('color'));								
		c.set('childs',[]);											
		return c;
	}
});
Ember.Inflector.inflector.uncountable('answerstatoption');
export default model;