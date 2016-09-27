import ENV from 'qumla/config/environment';
import Ember from 'ember';
export function initialize(/* container, application */) {
	if (ENV.environment === 'production') {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-68457117-1', 'auto');
		  ga('send', 'pageview');
		Ember.Router.reopen({
			notifyGoogleAnalytics: function() {	
			  return ga('send', 'pageview', {
			    'page': this.get('url'),
			    'title': this.get('url'),
			    'uid': this.get('session.token')
			  });
			}.on('didTransition')
		});
	}	
}

export default {
  name: 'ga-init',
  initialize: initialize
};
