import Ember from 'ember';
import { getMax } from 'qumla/helpers/get-max';
export default Ember.Component.extend({
	stats: null, //this is a answer-stat list
	winner: Ember.computed('stats',function (){
        return getMax(this.get('stats'),'count');	
	})
});