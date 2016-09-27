import Ember from 'ember';

export default Ember.Component.extend({
	contentId:null,
	didInsertElement:function(){
		//Ember.$("#"+this.get('contentId')).trumbowyg();
	}
});
