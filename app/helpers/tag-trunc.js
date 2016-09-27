import Ember from 'ember';

export function tagtrunc(params) {
	return params[0].substring(1);
}

export default Ember.Helper.helper(tagtrunc);