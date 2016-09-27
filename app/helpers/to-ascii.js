import Ember from 'ember';

export function toAscii(params) {
	var str=params;
	if(Ember.$.isArray(params)){
		str=params[0];
	}
	if(str){
		return str.replace(/[őóöÖŐÓ]/g, "o").replace(/[üúűÜÚŰ]/g, "u").replace(/[áÁ]/g, "a").replace(/[éÉ]/g, "e").replace(/[Íí]/g, "i").replace(/[?! #'\"\s\\\/]/g, "-");	
	}else{
		return 'unknown';
	}
	
}

export default Ember.Helper.helper(toAscii);