import Ember from 'ember';
const {
  Component,
  computed,
  getOwner
} = Ember;
export default Ember.Controller.extend({
	application:Ember.inject.controller(),
	routeName: Ember.computed("application.currentRouteName",function(){
		return this.get('application.currentRouteName').replace('.','-');
	})
});
