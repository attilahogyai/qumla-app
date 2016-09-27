import Ember from 'ember';

export function startwith(params) {
	return params[0].indexOf(params[1])===0;
}

export default Ember.Helper.helper(startwith);