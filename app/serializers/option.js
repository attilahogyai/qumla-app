import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
	serialize: function(snapshot, options){
		var o = this._super(snapshot,options);

		if(o.data.attributes){
			delete o.data.attributes.color;
			delete o.data.attributes.index;
		}
		return o;
	} 
});