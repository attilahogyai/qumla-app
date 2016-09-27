import Ember from 'ember';

export function getMax(collection, field){
	var max=null;
 	collection.forEach(function(stat) {
 		if(max===null) {
 			max=stat;
 			return;
 		}
		var result=stat.get(field);
		if(parseInt(result)>parseInt(max.get(field))){
			max=stat;
		}	
  	});
  	return max;
}

export default Ember.Helper.helper(getMax);