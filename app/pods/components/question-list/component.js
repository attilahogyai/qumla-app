import Ember from "ember";
import App from "qumla/app";
export default Ember.Component.extend({
	tagName:"",
	noResultText: App.locX('/question/noquestion'),
	enableEditLink: false,
	enableNoItemLink: true,
	actions:{
		infinityLoad() {
	      this.sendAction('infinityLoad');
	    }
	}

});