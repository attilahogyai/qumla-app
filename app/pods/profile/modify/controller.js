import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Controller.extend({
    session: Ember.inject.service(),
    modal: 	Ember.inject.service(),
    actions:{
    	modifyUserData:function(user){
    		var self=this;
    		var loaderP=user.save();
    		this.get('loader').startLoadProcess(loaderP);
    		loaderP.then(function(data){
    			self.transitionToRoute('profile.index');
    			self.get('modal').openInfoModal({header:'Modify ready',text:"Your data bas been modified."});    			
    		}).catch(function(result){
    			Ember.Logger.debug('signup error');
    			Ember.Logger.debug(result);
    			self.get('modal').openInfoModal({header:'Modify error',text:"Sorry, we can't modify your data! Something went wrong: "+result});
    			Ember.Logger.error(result);
    		});
    		
    	},
        modifyPassword:function(oldPassword, newpPassword){
            var reset=App.getData('/changepassword',true,'POST',true,false,{
                password:oldPassword,
                new_password:oldPassword
            },null,null);

            var self=this;

            reset.then(function(){
                self.get('modal').openInfoModal({header:'Password changed',text:App.locX('/profile/password_changed'), action:function(){
                    self.transitionToRoute('profile.index');
                }});
            },function(cause){
                if(cause.responseText){
                    self.get('modal').openInfoModal({header:'Change password error',text:App.locX('/profile/'+cause.responseText)});
                }else{
                    self.get('modal').openInfoModal({header:'Change password error',text:App.locX('/profile/password_change_error')});                
                }
            });
            return reset;
        }
    }
});
