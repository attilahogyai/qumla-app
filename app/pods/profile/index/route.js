import Ember from 'ember';
import QInfinityRoute from "qumla/util/q-infinity-route";
import ENV from 'qumla/config/environment';

export default QInfinityRoute.extend({
	model:function(params){
		return  this.infinityModel("question", { perPage: ENV.APP.perPage, startingPage: 1, filter:{sessionFilter:true}});
	}
});
