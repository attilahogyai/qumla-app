import DS from 'ember-data';
import Ember from 'ember';
var TimeTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	}
});
var DatetimeTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		if(Ember.isEmpty(serialized)) {
			return;
		}
		Ember.assert("Value type is not string", !!serialized.indexOf);
		return moment(serialized,'YYYY-MM-DDTHH:mm:ss.SSSZZ');
	},
	serialize: function(deserialized) {
		if(Ember.isEmpty(deserialized)) {
			return;
		}
		Ember.assert("Value type is not moment", !!deserialized.format);
		return deserialized.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
	}
});
var DateTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		if(Ember.isEmpty(serialized)) {
			return;
		}
		Ember.assert("Value type is not string", !!serialized.indexOf);
		return moment(serialized,'YYYY-MM-DD');
	},
	serialize: function(deserialized) {
		if(Ember.isEmpty(deserialized)) {
			return;
		}
		Ember.assert("Value type is not moment", !!deserialized.format);
		return deserialized.format('YYYY-MM-DD');
	}
});
var TimestampTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		if(Ember.isEmpty(serialized)) {
			return;
		}
		Ember.assert("Value type is not integer", !isNaN(serialized));
		return moment(serialized);
	},
	serialize: function(deserialized) {
		if(Ember.isEmpty(deserialized)) {
			return;
		}
		Ember.assert("Value type is not moment", !!deserialized.format);
		return deserialized.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
	}
});


var RawTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	}
});

export function initialize(container /*, application*/ ) {
	container.register('transform:time', TimeTransform);
	container.register('transform:datetime', DatetimeTransform);
	container.register('transform:mdate', DateTransform);	
	container.register('transform:timestamp', TimestampTransform);	
	container.register('transform:raw', RawTransform);	
}

export default {
	after: 'store',    	
	name: 'setup-store',
	initialize: initialize
};
