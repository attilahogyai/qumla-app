import DS from 'ember-data';
import Ember from 'ember';
export default DS.Store.extend({
	loader: Ember.inject.service(),
	all:function(modelName,options){
		var ready=false;
		var self=this;
		var p=this.findAll(modelName,options);
		p.then(function(){
			ready=true;
		});
		Ember.run.later(function(){
			if(!ready){
				self.get('loader').startLoadProcess(p);
			}
		},400);
		return this.findAll(modelName,options);
	}
});
