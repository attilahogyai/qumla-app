import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Service.extend({
	token: Ember.computed.readOnly('sessionData.token'),
	language: Ember.computed.readOnly('sessionData.language'),
	email: Ember.computed.readOnly('sessionData.email'),
	name: Ember.computed.readOnly('sessionData.name'),
	login: Ember.computed.readOnly('sessionData.login'),
	displayName: Ember.computed('sessionData.name', 'sessionData.login', function(){
		if(this.get('sessionData.login')){
			return '@'+this.get('sessionData.login');
		}else{
			return this.get('sessionData.username');			
		}
	}),
	userid : Ember.computed.readOnly('sessionData.userid'),
	isAdmin : Ember.computed.readOnly('sessionData.isAdmin'),
	isCustomer : Ember.computed.readOnly('sessionData.isCustomer'),
	isRegistered : Ember.computed.readOnly('sessionData.isRegistered'),

	user: null,
	username: Ember.computed('sessionData.username','sessionData.login', function(){
		if(this.get('sessionData.username')){
			return this.get('sessionData.username');
		}else{
			return '@'+this.get('sessionData.login');
		}
	}),
	avatarUrl: Ember.computed('sessionData.hash','sessionData.image','user.imagec', function(){
		if(this.get('sessionData.image')){
			return "/api/profileimage?u="+this.get('userid')+"&c="+this.get('user.imagec');
		}else{
			if(!this.get('sessionData.hash')){
				window.localStorage.clear();
	          	App.reload();
			}
			return "https://secure.gravatar.com/avatar/"+this.get('sessionData.hash')+"?s=50&d=wavatar";
		}
	}),
	avatarProfileUrl: Ember.computed('sessionData.hash','sessionData.image','user.imagec', function(){
		if(this.get('sessionData.image')){
			return "/api/profileimage?u="+this.get('userid')+"&c="+this.get('sessionData.imagec');
		}else{
			return "https://secure.gravatar.com/avatar/"+this.get('sessionData.hash')+"?s=100&d=wavatar";
		}		
	}),
	isLoggedIn: Ember.computed('sessionData.userid', function(){
		return !!this.get('sessionData.userid');
	}),
	sessionData: null,
	solution: null,
	setup:function(sessionData){
  		var lang='en';
  		if(lang===null){ // later when we relase the multilanguage support, this sample will read the language from browser
		    lang = navigator.language || navigator.userLanguage;  
		    if(!Ember.isEmpty(lang)){
		      var l=lang.split('-');
		      App.moment.lang(l[0]);
		      lang=l[0];
		    }
	  	}
	  	sessionData.set('language',lang);
		this.set('sessionData',sessionData);
	},
	updateSessionModel:function(data, sessionData){
		if(sessionData){
			this.set('sessionData', sessionData);
		}
		sessionData=this.get('sessionData');
		if(sessionData.get('old_token')!==sessionData.get('token') && sessionData.get('token')!==null){
			sessionData.set('old_token',sessionData.get('token'));			
			sessionData.set('old_hash',sessionData.get('hash'));		
		}
		sessionData.set('token',data.access_token);
		sessionData.set('scope',data.scope);
		sessionData.set('username',data.name);
		sessionData.set('login',data.login);
		sessionData.set('userid',data.userid);
		sessionData.set('createDt',new Date());
		sessionData.set('modifyDt',moment(data.modifyDt));
		if(data.prevLogin!=null){
			sessionData.set('prevLogin',moment(data.prevLogin).toDate());
		}
		sessionData.set('hash',data.hash); 
		this.set('user',data.user); 
		sessionData.set('image',data.user.image); 
		return sessionData.save();
	},
	restoreSession:function(){
		let sessionData=this.get('sessionData');
		if(sessionData.get('old_token')!=null){
			if(sessionData.get('token') === sessionData.get('old_token')){
				window.localStorage.clear();
          		App.reload();
          		return null;
			}
			sessionData.set('token',sessionData.get('old_token'));
			sessionData.set('hash',sessionData.get('old_hash'));			
			sessionData.set('old_hash',null);
			sessionData.set('old_token',null);			
			sessionData.set('userid',null);			
			sessionData.set('user',null);
			sessionData.set('email',null);
			sessionData.set('image',null);
			sessionData.set('login','anonyme');
			sessionData.set('username','Anonyme');
			sessionData.set('scope',null);
			return sessionData.save();
		}
		return null;
	}
	/*,
	updateSessionObject:function(session,data){
		session.set('token',data.access_token);
		session.set('scope',data.scope);
		session.set('username',data.name);
		session.set('login',data.login);
		session.set('userid',data.userid);
		session.set('createDt',new Date());
		session.set('modifyDt',moment(data.modifyDt));
		if(data.prevLogin!=null){
			session.set('prevLogin',moment(data.prevLogin).toDate());
		}
		session.set('hash',data.hash); 		 
		return session;
	}
	*/
});
