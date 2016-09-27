import DS from 'ember-data';
import Ember from 'ember';
import { toAscii } from 'qumla/helpers/to-ascii';
var model = DS.Model.extend({
	title: DS.attr('string'),
	status: DS.attr('number'),
	mandatory: DS.attr('boolean'),
	type: DS.attr('number'), // 1 - yes/no,  
	description: DS.attr('string'),
	encodedDescription: DS.attr('string'),
	url: DS.attr('string'),
	options: DS.hasMany('option'),
	comments: DS.hasMany('comment'),
	img: DS.attr('string'),
	color: DS.attr('string'),
	answered: DS.attr('boolean'),
	validTill: DS.attr('mdate'),
	ticket: DS.attr('string'),
	language: DS.attr('string'),
	subscribed: DS.attr('boolean'),
	answerCount: DS.attr('number'),
	dashboard: DS.attr('number'),
	hasAdvancedDashboard: Ember.computed('dashboard',function(){
		return this.get('dashboard') === 1;
	}), 
	
	headerImg: Ember.computed(function(){
		return '/img/question/'+this.get('img');
	}),
	privateUrl: Ember.computed('ticket','id',function(){
		if(this.get('id') && this.get('ticket')){
			return 'https://qumla.com/question/'+this.get('id')+'/'+toAscii(this.get('title'))+'/detail?t='+this.get('ticket');
		}else{
			return '';
		}
	}),
	sortedOptions: Ember.computed.sort('options',function(a, b){
	    if (a.get('ord') > b.get('ord')) {
	      return 1;
	    } else if (a.get('ord') < b.get('ord')) {
	      return -1;
	    }
	    return 0;
  	}),
	isClosed: Ember.computed('status',function(){
		return this.get('status') === 50;
	})
});
Ember.Inflector.inflector.uncountable('question');

export default model;