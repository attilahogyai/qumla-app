import Ember from 'ember';
import App from "qumla/app";
export
default Ember.Component.extend({
    center: null,
    regionData: null,
    didInsertElement: function() {

        // parameter when you first load the API. For example:
        // This example requires the Visualization library. Include the libraries=visualization
        // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

        var map, heatmap;

        map = new google.maps.Map(document.getElementById('heat-map'), {
            zoom: 5,
            center: this.get('center'),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false
        });
        var styleArray=[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];
        var styledMap = new google.maps.StyledMapType(styleArray,{name: "Your region"});
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
        var regionData = this.get('regionData');
        var heatData = [];
        for (var i = 0; i < regionData.length; i++) {
            heatData.push({ location:new google.maps.LatLng(regionData[i].lat, regionData[i].lon), 
            	weight: regionData.count});
        }


        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatData,
            map: map
        });

        function toggleHeatmap() {
            heatmap.setMap(heatmap.getMap() ? null : map);
        }

        function changeGradient() {
            var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ];
            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        }

        function changeRadius() {
            heatmap.set('radius', heatmap.get('radius') ? null : 20);
        }

        function changeOpacity() {
            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
        }

        // Heatmap data: 500 Points
        function getPoints() {


        }
    }

});