import DS from 'ember-data';
import Ember from 'ember';
var model = DS.Model.extend({
	question: DS.belongsTo('question',{ async: true }),
	original: DS.belongsTo('comment', { inverse: 'replies' }),
	replies: DS.hasMany('comment', { inverse: 'original' }),
	comment: DS.attr('string'),
	session: DS.attr('string'),
	useracc: DS.belongsTo('useracc'),
	createdt: DS.attr('timestamp'),
	postdate: Ember.computed('createdt',function(){
		var d=this.get('createdt');
		if(d){
			return d.fromNow();	
		}
		return '';
	}),
	formatedComment: Ember.computed('comment',function(){
		var c=this.get('comment');
		return c;
	}),
	avatarUrl: Ember.computed('comment','useracc','session',function(){
		if(this.get('useracc.image')){
			return "/api/profileimage?u="+this.get('useracc.id')+"&c="+this.get('useracc.imagec');
		}
		return "https://secure.gravatar.com/avatar/"+this.get('session')+"?s=50&d=wavatar";
	}),

});
Ember.Inflector.inflector.uncountable('comment');

export default model;