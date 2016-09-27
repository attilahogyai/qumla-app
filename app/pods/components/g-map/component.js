import Ember from 'ember';
import App from "qumla/app";
export default Ember.Component.extend({
	didInsertElement:function(){
		
        var mapCanvas = document.getElementById('map-canvas');

        var mapOptions = {
          	zoom: 8,
          	mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl:false,
			zoomControl:true,
			mapTypeControl:false,
			scaleControl:false,
			streetViewControl:false,
			overviewMapControl:false,
			rotateControl:false
        };

		var mapStyle=[
		  {
		    "featureType": "road",
		    "elementType": "labels",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "road",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  }
		];
		var style = new google.maps.StyledMapType(mapStyle);

        var map = new google.maps.Map(mapCanvas, mapOptions);
        map.mapTypes.set('map_style_scream',style);
        map.setMapTypeId('map_style_scream');
		var infowindow = new google.maps.InfoWindow({
  			content:"Hello World!"
  		});
		if(navigator.geolocation) {
    		navigator.geolocation.getCurrentPosition(function(position) {
  				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      			map.setCenter(pos);
				var marker=new google.maps.Marker({
					position:pos,
					animation:google.maps.Animation.BOUNCE
				});        
		        
		        marker.setMap(map);
				infowindow.open(map,marker);

    		}, function() {
      			//handleNoGeolocation(true);
    		});
		} else {
		    //handleNoGeolocation(false);
		    // Browser doesn't support Geolocation
		}

	}

});


