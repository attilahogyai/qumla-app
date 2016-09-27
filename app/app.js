import Ember from 'ember';
import DS from 'ember-data';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';


Ember.MODEL_FACTORY_INJECTIONS = true;

var application = Ember.Application.extend({
	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver: Resolver,
});

// Language functions

application.lastLang='en';
application.lastLangF='en_EN';	

application.getLang=function(){
	var lang=application.lastLang;
	if(lang===null){
		lang = navigator.language || navigator.userLanguage;  
		if(!Ember.isEmpty(lang)){
			var l=lang.split('-');
			moment.lang(l[0]);
			application.moment.lang(l[0]);
			lang=l[0];
		}
	}
	application.lastLang=lang;
	return lang;
};
application.getLang(); 

// helper functions

application.locX=function(key, params){
	return Ember.String.loc(key+"/"+application.getLang(), params);
};
application.reload=function(clean){
	if(clean){ 
		if(window.localStorage) window.localStorage.clear();
	}
	Ember.run.schedule('afterRender',function(){
        var n = window.location.href.indexOf("#");
    	window.location.href=window.location.href.substring(0,n);
	});
};

application.getData = function(url,async,type,processdata,cache,data,success,error){

	if(url.indexOf('ext:')===0){
		url = 'https://qumla.com' + url.substring(3,url.length);		
	}else{
		url = '/api' + url;
	}
	Ember.$.ajaxSetup({async:async});
	var headers={};
	if(application.session){
		headers["Authorization"] = "Bearer "+application.session.get('token');
	}
	return Ember.$.ajax({
		type: type,
		data: data,
		url: url,
		headers: headers,
		processdata: processdata,
		cache: cache,
		success:success,
		error: error
	});
};

/// ERROR hanling
/*
Ember.RSVP.configure('onerror', function(error) {
	if (error instanceof Error) {
		Ember.Logger.assert(false, error);
		Ember.Logger.error(error.stack);
	}
});
*/

Ember.Route.reopen({
	toFilter:function(f){
		return Ember.$.parseJSON.stringify({filter:f});
	}
});

DS.Model.reopen({
	getF: function(name,type){
		if(this.get('format') && this.get('format')[name]){
			var methodName=Ember.String.camelize('format_'+type);
			if(this[methodName]){
				return this[methodName](this.get(name),this.get('format')[name]);
			}
		}
		return this.get(name);
	},
	setF: function(name,value,type){
		if(this.get('format') && this.get('format')[name]){
			var methodName=Ember.String.camelize('parse_'+type);
			if(this[methodName]){
				value=this[methodName](value,this.get('format')[name]);
			}
		}
		this.set( name,value);
	}
});


Ember.colorList=['#FF5722','#f4c63d','#d17905','#453d3f','#59922b','#0544d3',
'#6b0392','#f05b4f','#dda458','#eacf7d','#86797d','#b2c326','#6188e2','#a748ca','#f05b4f'];

Ember.onerror = function(error) {
	var status = (error.errors && error.errors[0].status) || error.status;
	var errors = (error.errors && error.errors[0].code) || 'general';
	if(status=='403'){
		Materialize.toast('<span style="font-size:1.2em;white-space:nowrap;max-width:800px;">Sorry accessing this content is denied!<span>', 6000,"",function(){application.reload();});

		Ember.Logger.error("error:"+status+":"+error.statusText);
	}else if(status=='417'){
		Materialize.toast('<span style="font-size:1.2em;white-space:nowrap;max-width:800px;">Expectation Failed, reloading session in progress!<span>', 6000,"",function(){application.reload(true);});
		Ember.Logger.error("error:"+status+":"+error.statusText);		
	}else if(status=='404'){
		Materialize.toast('<span style="font-size:1.2em;white-space:nowrap;max-width:800px;">Sorry! The requested content was not found!', 6000,"",function(){application.reload();});
		Ember.Logger.error("error:"+status+":"+error.statusText);		
	}else{
		var headers={};
		if(application.session){
			headers["Authorization"] = "Bearer "+application.session.get('token');
		}
		Ember.$.ajax({
			type: 'POST',
			url: '/api/error-notification',
			headers: headers,			
			data: {
				stack: error+" : "+error.stack,
				otherInformation: error.message
			}
		});
		var t=application.locX('/error/'+errors);
		if(errors==='general'){
			Materialize.toast('<span style="font-size:0.8em;white-space:nowrap;max-width:800px;">Operation failed. Try later or <a href="javascript:document.location.reload();">refresh!</a></span>', 6000);
		}else{
			Materialize.toast('<span style="font-size:0.8em;white-space:nowrap;max-width:800px;">'+t+'</span>', 6000);			
		}	

		if(error.message){
			Ember.Logger.error("error:"+error.message+"-> "+error.stack);
		}else{
			Ember.Logger.error("error:"+error);
		}
		//console.log("error:"+error+" : "+error.stack);
	}
};





// Language functions END

loadInitializers(application, config.modulePrefix);

export default application;


// OVERWRITE CHANGES
// liquid-fire/liquid-measured.js  overflow: 'auto' changed to hidden;

