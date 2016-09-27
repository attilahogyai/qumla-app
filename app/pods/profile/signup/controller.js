import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Controller.extend({
    session: Ember.inject.service(),
    modal: 	Ember.inject.service(),
    actions:{
    	saveUserData:function(user){
    		var self=this;
    		var loaderP=user.save();

    		this.get('loader').startLoadProcess(loaderP);
    		loaderP.then(function(data){
    			self.transitionToRoute('profile.index');
    			self.get('modal').openInfoModal({header:'Registration confirmation',
                    text:"We've sent a confirmation email. Please check your mailbox and follow the instructions.",
                    action:function(){
                        App.reload(true);
                    }
                    });    			
    		}).catch(function(result){
    			Ember.Logger.debug('signup error');
    			Ember.Logger.debug(result);
    			self.get('modal').openInfoModal({header:'Sign up error',text:"We can't save your registration! "+result});
    			Ember.Logger.error(result);
    		});
    		
    	}
    }
});
