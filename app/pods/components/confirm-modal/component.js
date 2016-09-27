import Ember from "ember";

export default Ember.Component.extend({
	options:{
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 300, // Transition out duration
      ready: null, // Callback for Modal open
      complete: null, // Callback for Modal close
    },
    positiveText:Ember.computed('model',function(){
    	if(this.get('model.positiveText')){
    		return this.get('model.positiveText');
    	}else{
    		return 'Yes';
    	}
    }),
    negativeText:Ember.computed('model',function(){
		if(this.get('model.negativeText')){
    		return this.get('model.negativeText');
    	}else{
    		return 'Cancel';
    	}
    }),
	didInsertElement:function(){
		this.$("#confirmModal").openModal(this.get('options'));
	},
	actions:{
		positive:function(){
			this.$("#confirmModal").closeModal(this.get('options'));
			var c=this;
			Ember.run.later(function(){
				c.sendAction('closeModal');
			},300);
			var model=this.get('model');
			if(model.positiveCallback){
				model.positiveCallback();
			}
		},
		negative:function(){
			this.$("#confirmModal").closeModal(this.get('options'));
			var c=this;
			Ember.run.later(function(){
				c.sendAction('closeModal');
			},300);
			var model=this.get('model');
			if(model.negativeCallback){
				model.negativeCallback();
			}
		}		
	}
});