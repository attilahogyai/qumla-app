import Ember from 'ember';
export function f(params) {
	if(!params[1]){
		return params[0].format('L');
	}
}

export default Ember.Helper.helper(f);