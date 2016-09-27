import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	countryCode: DS.attr('string'),
	name: DS.attr('string'),
	lon: DS.attr('number'),
	lat: DS.attr('number')
});
Ember.Inflector.inflector.uncountable('location');

export default model;