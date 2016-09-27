import Ember from 'ember';

export default Ember.Controller.extend({
    loading: Ember.computed.readOnly('loader.loading'),	
    appstate: Ember.inject.service(),
    session: Ember.inject.service(),
    avatarUrl: Ember.computed.readOnly('session.avatarUrl'),
    username: Ember.computed.readOnly('session.username'),        
    modal: Ember.inject.service(),

    showModal: Ember.computed.alias('modal.showModal'),
    modalName: Ember.computed.readOnly('modal.modalName'),
    modalModel: Ember.computed.readOnly('modal.modalModel'),

    actions:{
    	closeModal:function(){
    		this.set('showModal',false);
    	}
    }
});
