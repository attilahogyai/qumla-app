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
	didInsertElement:function(){
		this.$("#infoModal").openModal(this.get('options'));
	},
	actions:{
		close:function(){
			this.$("#infoModal").closeModal(this.get('options'));
			var c=this;
			Ember.run.later(function(){
				c.sendAction('closeModal');
				if(c.get('model.action')){
					c.get('model.action').call();
				}
			},300);
		}
	}
});