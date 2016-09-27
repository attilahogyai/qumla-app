import Ember from 'ember';

export function aggregateSum(collection, groupField, sumField){
	var result=[];
	//var totalSum=0; it is not necassary anymore it is calculated on server
	// create groups
	
 	collection.forEach(function(stat) {
		var key=stat.get(groupField);
		//var value=stat.get(sumField);
		//totalSum+=value;
		var item=result.findBy(groupField, key);
		if(item){
			item.set(sumField,item.get(sumField)+stat.get(sumField));
		}else{
			if(stat.copy){
				result.pushObject(stat.copy());		
			}else{
				result.pushObject(stat);
			}
		}	
  	});
  	// calcukate percents
  	result.forEach(function(stat) {
  		var totalSum=stat.get("total");
  		var percent=Math.floor((stat.get(sumField)*10000/totalSum))/100;
  		stat.set("percent",percent);
  		//stat.set("total",totalSum);
  	});
  	return result;
}

export default Ember.Helper.helper(aggregateSum);