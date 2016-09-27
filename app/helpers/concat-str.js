import Ember from 'ember';

export function concat(params) {
	var r='';
	for(var i=0;i<params.length;i++){
		r+=params[i];
	}
	return r;	
}

export default Ember.Helper.helper(concat);