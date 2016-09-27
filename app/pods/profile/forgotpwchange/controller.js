import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Controller.extend({
    session: Ember.inject.service(),
    modal: 	Ember.inject.service(),
    requestid: '',
    actions:{
        forgotPassword:function(email, newpPassword){
            var reset=App.getData('/forgotchange',true,'POST',true,false,{
                email: email,
                new_password:newpPassword,
                requestid: this.get('requestid')
            },null,null);

            var self=this;

            reset.then(function(){
                self.get('modal').openInfoModal({header:App.locX('/profile/password_changed_header'),text:App.locX('/profile/password_changed'), action:function(){
                    self.transitionToRoute('profile.index');
                }});
            },function(cause){
                self.get('modal').openInfoModal({header:App.locX('/profile/password_change_error'),text:''});                
            });
            return reset;
        }
    }
});
