import Ember from 'ember';
import App from 'qumla/app';
import {
    validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
    oldPassword: [validator('presence', true), validator('length', {
        min: 4,
        max: 16
    })],
    newPassword: [validator('presence', true), validator('length', {
        min: 4,
        max: 16
    })],
    forgotemail: [validator('presence', {
        presence: true,
        message: ' '
    }), validator('format', {
        type: 'email'
    })],
    newPassword2: [
        validator('presence', {
            presence: true,
            message: ' '
        }),
        validator('confirmation', {
            on: 'newPassword',
            description: 'Passwords'
        })
    ]
});

export
default Ember.Component.extend(Validations, {
    user: null,
    oldPassword: null,
    newPassword: null,
    newPassword2: null,
    forgotemail: null,
    privacy: false,
    modify: false,
    saveDisabled: Ember.computed('user.name', 'user.email', 'user.login', 'user.password', 'user.password2','privacy', function() {
        if (this.get('modify')) {

            let valid = this.get('user.validations.attrs.name.isValid') || false;
            valid = valid && (this.get('user.validations.attrs.login.isValid') || false);
            return !valid;
        } else {
            return !this.get('user.validations.isValid') || !this.get('privacy');
        }
    }),
    changePasswordEnabled: Ember.computed('user.password','modify',function(){
    	return (this.get('user.password') && this.get('modify'));
    }),
    forgotDisabled: Ember.computed('forgotemail', 'newPassword', 'newPassword2', function() {
        let valid = this.get('validations.attrs.newPassword.isValid') && this.get('validations.attrs.newPassword2.isValid') && this.get('validations.attrs.forgotemail.isValid');
        return !valid;
    }),
    title: Ember.computed('midify', function(){
    	if(this.get('modify')){
    		return App.locX('/profile/modify');
    	}else{
    		return App.locX('/profile/signup');
    	}
    }),
    actions: {
        sendData: function() {
            let action = this.attrs['save'];
            if (action) {
                action(this.get('user'));
            }
        },
        sendPassword: function() {
            let self = this;
            let action = this.attrs['changePassword'];
            if (action) {
                action(this.get('oldPassword'), this.get('newPassword'));
            }
        },
        forgotPassword: function() {
            let self = this;
            let action = this.attrs['forgotPassword'];
            if (action) {
                action(this.get('forgotemail'), this.get('newPassword'));            	
            }
        },
    	privacyCheck:function(){
    		this.set('privacy',!this.get('privacy'));
    	}


    }
});