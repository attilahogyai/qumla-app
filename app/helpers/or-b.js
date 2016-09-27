import Ember from 'ember';

function or(params) {
	for(var i=0;i<params.length;i++){
		if(params[i]) return true;
	}
	return false;	
}

export default Ember.Helper.helper(or);