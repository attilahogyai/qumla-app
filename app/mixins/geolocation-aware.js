import Ember from 'ember';

export default Ember.Mixin.create({
	getGeoLocation: function(){
		// Try W3C Geolocation (Preferred)
		return new Ember.RSVP.Promise(function(resolve, reject) {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
			  		var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			  		resolve(initialLocation);
				}, function() {
					resolve({browserSupportFlag:true, error:'unable to getlocation'});
				});
			}
			// Browser doesn't support Geolocation
			else {
				resolve({browserSupportFlag:false});
			}
		});
	}
});

