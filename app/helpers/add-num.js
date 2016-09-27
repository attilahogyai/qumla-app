import Ember from 'ember';

export function add(params) {
	var num=0;
	for(var i=0;i<params.length;i++){
		num+=params[i];
	}
	return num;	
}

export default Ember.Helper.helper(add);