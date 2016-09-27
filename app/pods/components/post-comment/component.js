import Ember from 'ember';

export default Ember.Component.extend({
	tagName: '',
	question: null,
	commentText: '',
	parent: null,
	textareaid: Ember.computed('parent',function(){
		var parent=this.get('parent');
		if(!parent){
			return 'comment_area';
		}else{
			return 'comment_area_'+parent.get('id');			
		}
	}),
	actions:{
		createComment: function(question, parentComment, commentText){
			this.set('commentText','');			
			this.sendAction('onComment', question, parentComment, commentText);
		}
	}
});
