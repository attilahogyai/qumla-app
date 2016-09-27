import Ember from 'ember';
import DS from 'ember-data';
var User=DS.Model.extend({
	name: DS.attr('string'),
	login: DS.attr('string'),	
	email: DS.attr('string'),	
	hash: DS.attr('string'),
	image: DS.attr('boolean'),
	imagec: DS.attr('number'),
	displayName: Ember.computed('name', 'login', function(){
		if(this.get('login')){
			return '@'+this.get('login');
		}else{
			return this.get('name');			
		}
	}),
});
Ember.Inflector.inflector.uncountable('useracc');
export default User;