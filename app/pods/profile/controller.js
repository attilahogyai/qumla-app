import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Controller.extend({
    session: Ember.inject.service(),
    avatarProfileUrl: Ember.computed.readOnly('session.avatarProfileUrl'),
    username: Ember.computed.readOnly('session.username'),
    login: Ember.computed.readOnly('session.login'),
    displayName: Ember.computed.readOnly('session.displayName'),
    user: Ember.computed.alias('session.user'),
    isLoggedIn: Ember.computed.readOnly('session.isLoggedIn'),
    modal: 	Ember.inject.service(),
    loginname: null,
    loginpassword: null,
    uploadFile: null,
    uploadFileUrl: null,
  
    actions:{
    	loginAction:function(){
			var c = this;
			var loginPromisse=Ember.$.ajax({
				type: 'POST',
				url: '/api/login',
				cache: false,
          		data: {
            		login: this.get('loginname'),
            		grant_type: "client_credentials",
            		scope: "basic,qumla",
            		password: this.get('loginpassword')
          		},
				success:function(data) {
					if(data.access_token){
						c.session.updateSessionModel(data);
                        /*
                        var reload=function(){
                            App.reload();
                        };
                        */
		    			c.get('modal').openInfoModal({header:App.locX('/login/success_header'),text:App.locX('/login/success_text')});
					}else{
		    			c.get('modal').openInfoModal({header:App.locX('/login/usernotfound_header'),text:App.locX('/login/usernotfound_text')});
					}		
				},
				error:function() {
					c.get('modal').openInfoModal({header:App.locX('/login/usernotfound_header'),text:App.locX('/login/usernotfound_text')});
				} 
        	});
        	this.get('loader').startLoadProcess(loginPromisse);
			return false;
    	},
        googlelogin:function(){
            var form=Ember.$('#googlePost');
            form.submit();
            return false;
        },
        facebooklogin:function(){
            var form=Ember.$('#facebookPost');
            form.submit();
            return false;
        },
    	signout:function(){
    		var p = this.get('session').restoreSession();
    		if(p){
	    		p.then(function(){
					Ember.Logger.debug('session restored and user logged out');
					App.reload();
				}); 
    		}else{
          		window.localStorage.clear();          
				App.reload();
    		}
    	},
        setUploadImage: function (file) {
            var self=this;  

            if(this.get('uploadFile')){
                this.get('uploadFile').destroy();
            }   
            this.set('uploadFile',file);

            file.read().then(function (url) {
                self.set('uploadFileUrl',url);
            });
        },  
        acceptPhoto: function(){
            var self = this;
            if(this.get('uploadFile')!=null){ // upload image just in case if the selected is the image
                this.get('modal').toast('Uploading image ...');
                var uploadImagePromise = this.get('uploadFile').upload('/api/uploadprofileimage',
                    {headers:{"Authorization": "Bearer "+this.get('session.token')}});
                this.get('loader').startLoadProcess(uploadImagePromise); 

                uploadImagePromise.then(function (response) {
                    self.set('user.imagec',response.body.imagec);
                    self.set('user.image',true);

                    self.get('modal').toast(App.locX('/profile/image_uploaded'));
                    self.get('uploadFile').destroy();
                    self.set('uploadFileUrl',null);
                    self.get('uploadFile',null);

                }).catch(function(){
                    self.get('modal').toast(App.locX('/profile/image_upload_error'));
                });                
            }
        },
        cancelPhoto: function(){
            this.get('uploadFile').destroy();
            this.set('uploadFileUrl',null);
            this.get('uploadFile',null);
        }

    }
});
