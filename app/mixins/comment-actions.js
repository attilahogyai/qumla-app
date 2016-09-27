import Ember from 'ember';

export default Ember.Mixin.create({
	actions:{
		onComment:function(question, parent, text){
			if(text===null || text.trim().length===0){
				return;
			}
			Ember.debug('on comment called, send comment to server');
			var comment=this.store.createRecord('comment',{question:question,comment:text,original:parent});
			var self=this;
			comment.save().then(function(){
				Ember.debug('comment saved');
				self.send('reloadHandler','comments',this);
			});
		}
	}
});
