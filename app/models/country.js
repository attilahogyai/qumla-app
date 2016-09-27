import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	countryName: DS.attr('string')
});
Ember.Inflector.inflector.uncountable('country');
export default model;