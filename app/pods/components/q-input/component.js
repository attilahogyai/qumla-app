import OneWayInput from 'qumla/components/one-way-input';
import Ember from 'ember';

export default OneWayInput.extend({
	classNameBindings: ['isValid:valid','isInvalid:invalid'],
	isInvalid:Ember.computed('changed','isValid',function(){
		return this.get('changed') && !this.get('isValid'); 
	}),
	isValid:false,
	changed: false,
	_handleChangeEvent() {
    	this._super();
    	Ember.Logger.info('input changed: isValid'+this.get('isValid')+' changed:'+this.get('changed'));
    	this.set('changed', true);
  	}
});
