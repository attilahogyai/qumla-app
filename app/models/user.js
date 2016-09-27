import Ember from 'ember';
import DS from 'ember-data';
import App from 'qumla/app';

import {
  validator, buildValidations
}
from 'ember-cp-validations';
const Validations = buildValidations({
  name: [validator('presence', {presence:true, message:' '}), validator('no-whitespace-around', true),validator('length', { min: 4,max: 255})],
  login: [validator('unique-login', {debounce: 500}), validator('format', { regex: /^[a-zA-Z0-9]{4,32}$/, message: App.locX('/signup/nickname_error'), allowBlank:true})],
  email: [validator('presence', {presence:true, message:' '}), validator('unique-email', {debounce: 500}), validator('format', { type: 'email' })],
  password: [validator('presence', true), validator('length', { min: 6,max: 16})],
  password2: [
    validator('presence', {presence:true, message:' '}),
    validator('confirmation', {
      on: 'password',
      description: 'Passwords'
    })
  ]
});
var User=DS.Model.extend(Validations,{
	name: DS.attr('string'),
	login: DS.attr('string'),	
	hash: DS.attr('string'),
	email: DS.attr('string'),
	password: DS.attr('string'),
	password2: DS.attr('string')
});
Ember.Inflector.inflector.uncountable('user');
export default User;