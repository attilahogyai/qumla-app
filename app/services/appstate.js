import Ember from 'ember';

export default Ember.Service.extend({
	width: 0,
	height: 0,
	isMobile:Ember.computed('width',function(){
		if(this.get("width")===0){
			this.set('width',Ember.$(window).width());
		}
		if(this.get("width")<703){
			return true;
		}
		return false;
	})
});
