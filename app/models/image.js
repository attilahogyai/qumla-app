import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	title: DS.attr('string'),
	path: DS.attr('string'),
	dominant: DS.attr('string'),
	type: DS.attr('number'),
	status: DS.attr('number'),
	tag: DS.attr('string'),
	stringRepr: function(){
		return this.get('title')+'/'+this.get('path')+"/"+this.get('status');
	}.property('type','text'),
	editables: function(){
		return ['title','dominant','status','type','tag'];
	},
});
Ember.Inflector.inflector.uncountable('image');

export default model;