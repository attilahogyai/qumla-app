import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
	keyForAttribute: function(attr, method) {
		return attr;
    //return Ember.String.underscore(attr).toUpperCase();
  }
});
