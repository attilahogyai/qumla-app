import Ember from 'ember';

export default Ember.Component.extend({
	tagName:'',
	postResponse: false,
	comment: null,
	actions:{
		
		togglePostResponse:function(){
			this.toggleProperty('postResponse');
		},
		onComment: function(question, parentComment, commentText){
			this.sendAction('onComment', question, parentComment, commentText);
		}
	}
});
