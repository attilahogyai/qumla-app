import Ember from 'ember';
import { toAscii } from 'qumla/helpers/to-ascii';
export default Ember.Mixin.create({
	modal: 	Ember.inject.service(),
	actions:{
		onVote:function(question, option){
			Ember.debug('on vote called, send vote to server');
			var answer=this.store.createRecord('answer',{question:question.get('id'),option:option.get('id')});
			var self=this;
			answer.save().then(function(){
				var t=toAscii(question.get('title'));
				question.set('answered',true);
				self.transitionTo('question.result', question.get('id'), t);
			}).catch(function(result){
				if(result && result.errors[0] && result.errors[0].code === "QUESTION_MULTIPLE_VOTE_TRIES"){
					self.get('modal').openInfoModal({header:'Error',text:'Your are not allowed to post more than one vote!'});
				}else{
					self.get('modal').openInfoModal({header:'Error',text:"Ooops: your are not able to vote at the moment, please try it later."});
				}
			});
		}
	}
});
