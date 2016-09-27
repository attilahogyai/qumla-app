import Ember from 'ember';
import App from "qumla/app";
import OAuthController from "qumla/pods/foauth2callback/controller";
export default OAuthController.extend({
	checkUrl:function(){
		return '/oauth2tokencheck';
	}

});