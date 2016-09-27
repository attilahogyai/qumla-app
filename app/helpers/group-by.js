import Ember from 'ember';

export function groupBy(collection, groupField){
	var result=[];
 	collection.forEach(function(stat) {
		var key=stat.get(groupField);
		var item=result.findBy(groupField, key);
		if(!item){
			item=stat.copy();
			result.pushObject(item);
		}
		item.get('childs').pushObject(stat.copy());
  	});
  	return result;
}

export default Ember.Helper.helper(groupBy);