import Ember from 'ember';

export function v(params) {
	if(params[0]>1) {
		return '<span class="winner-text">Winner:<br>'+params[0]+'&nbsp;votes</span>';
	}else{
		return 'Need more vote!';
	}
}

export default Ember.Helper.helper(v);