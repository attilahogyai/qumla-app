import Ember from 'ember';
import { aggregateSum } from 'qumla/helpers/aggregate-sum';

export default Ember.Component.extend({
	input: null,
	highest: null,
	first: null,
	summary: Ember.computed('input',function (){
		this.set("first",this.get('stats').objectAt(0));
		var aggregatedByOption=aggregateSum(this.get('input'),'option.id','count');
		var sortedList=aggregatedByOption.sortBy('count').reverse();
		if(sortedList.length>1 && sortedList[0].count>sortedList[1].count){
			this.set('highest',sortedList[0]);
		}else{
			this.set('highest',null);			
		}
		return sortedList;
	}),
});
