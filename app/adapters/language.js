import DS from 'ember-data';
import App from 'qumla/app';
import Ember from "ember";
export default DS.Adapter.extend({
	findAll: function(store, type, sinceToken) {
	    var url = type;
	    var query = { since: sinceToken };
	    return new Ember.RSVP.Promise(function(resolve, reject) {

			Ember.$.getJSON("/api/common/langlist").then(function(langList) {
				var i=0;
				var data = [];
				for (var key in langList) {
			        data.push({
				      id: i++,
				      type: 'language',
				      attributes:{
					      code: key,
					      pcode: langList[key],
					      name: App.locX('/language/'+key)		      	
				      }
				    });
				}
	        	Ember.run(null, resolve, {data:data});				
		  	}, function(jqXHR) {
		        jqXHR.then = null; // tame jQuery's ill mannered promises
	        	Ember.run(null, reject, jqXHR);
	      	});
	    });
	}
});