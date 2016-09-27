import Ember from "ember";

export default Ember.Component.extend({
	scrollToTop:false,
	tagName:"",
	didInsertElement: function(){
		if(this.get('scrollToTop')){
			Ember.run('afterRender',function(){
				Ember.run.later(function(){
					Ember.$("body").velocity("scroll", { duration: 1000, easing: "ease" });	
				},200);
			});
		}
		
	}
});