import Ember from 'ember';

function and(params) {
	for(var i=0;i<params.length;i++){
		if(!params[i]) return false;
	}
	return true;	
}
export default Ember.Helper.helper(and);
