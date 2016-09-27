import Ember from 'ember';

function not(params) {
	return !params[0];
}
export default Ember.Helper.helper(not);
