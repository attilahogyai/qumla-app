import Ember from 'ember';

function gt(params) {
	return params[0] > params[1];
}
export default Ember.Helper.helper(gt);
