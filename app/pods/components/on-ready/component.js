import Ember from 'ember';

export default Ember.Component.extend({
	onReadyAction: 'ready',
	didInsertElement : function(){
		this.sendAction(this.get('onReadyAction'));
	}
});
