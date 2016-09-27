import Ember from 'ember';
//import { aggregateSum } from 'qumla/helpers/aggregate-sum';


export default Ember.Component.extend({
	rid: 'regionid',
	regions:{
		world: 'Results around the world',
		'150': 'Results around Europe',
		'019': 'Results around americas',
		'142': 'Results around Asia',
		'009': 'Results around Oceania'
	},
	countryText:Ember.computed('region','zoomCountry',function(){
		var regions=this.get('regions'); 
		return regions[this.get('region')];
	}),
	regionText:Ember.computed('zoomCountry',function(){
		var zoomCountry=this.get('zoomCountry');	
		if(!zoomCountry) return null;
		var countryO=this.get('countryList').filter(function(item){
			return item.get('id')===zoomCountry;
		});
		return countryO[0].get('countryName');
	}),
	displayData: Ember.computed('regionData','countryData',function(){
		if(this.get('zoomCountry')){
			return this.get('regionData');	
		}else{
			return this.get('countryData');
		}
	}),
	regionData: null,
	countryData: null,
	zoomCountry: null,

	countryList: null,

	votedOptions: null,
	sortedvotedOptions: Ember.computed.sort('votedOptions',function(a, b){
	    if (a.get('ord') > b.get('ord')) {
	      return 1;
	    } else if (a.get('ord') < b.get('ord')) {
	      return -1;
	    }
	    return 0;
  	}),
	chart: null,

	region: Ember.computed('countryData',function(){
		// this needs to be fine tuned with google regions
		var region=null;
		this.get('countryData').map(function(item){
			if(item.percent<1) return;
			if(region && region!==item.region){
				region = 'world';
			}else{
				region = item.region;
			}
		});
		return region;
	}),
	drawChart: Ember.on('init', Ember.observer('displayData', function() {
		var regions=this.get('regions'); 
		Ember.run.once(this, function(){
			var chart = this.get('chart');
			var showWorld = !this.get('zoomCountry');

			
			
			// first we should filter the options we want to show
			var displayedOptions = {};			
			var displayData = this.get('displayData').filter(function(element){
				if(element.percent>=1){
					displayedOptions[element.option]=true;
					return true;
				}else{
					return false;
				}
			});

			// we should order the options according to natural order when the options were recorded
			var options = this.get('sortedvotedOptions');

			// then we should filter aout ehich are not displayed
			var enabledOptions=options.filter(function(item){
				return displayedOptions[item.get('id')];
			});

			// we should create a strict order from displayed options such [1,2,3,4]
			var optionOrder={};
			for(var i=0; i<enabledOptions.get('length');i++){
				optionOrder[enabledOptions.objectAt(i).get('id')]=i+1;
			}
			
			// we create the displayed that whith values 1, 2 ,3 ,4 			
			var d=displayData.map((element)=>{
				if(showWorld){
					displayedOptions[element.option]=true;
					return [element.countryname,optionOrder[element.option],element.percent,'Winner: '+element.text+' / Country votes: '+Math.round(element.percent)+'%'];
				}else{
					displayedOptions[element.option]=true;
					return [element.name,optionOrder[element.option],element.percent,'Winner: '+element.text+' / Region votes: '+Math.round(element.percent)+'%'];
				}
			});
			
			// based on enabled options order the color array is create 
			// [1,2,3,4]
			// [color1,color2,color3,color4]
			var colors=enabledOptions.map(function(item){
				return item.get('color');
			})

			//var series = [['Country',   'Option', 'Votes %','Tooltip']].concat(d);
			//var data = google.visualization.arrayToDataTable(series);


			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Country');
			data.addColumn('number', 'Option');
			data.addColumn('number', 'Votes %');
			data.addColumn({type: 'string', role: 'tooltip'});
	        data.addRows(d);
/*
var data = new google.visualization.DataTable();
data.addRows(1);
data.addColumn('number', 'LATITUDE', 'Latitude');
data.addColumn('number', 'LONGITUDE', 'Longitude');
data.addColumn('number', 'VALUE', 'Value'); // Won't use this column, but still must define it.
data.addColumn('string', 'HOVER', 'HoverText');

data.setValue(0,0,47.00);
data.setValue(0,1,-122.00);
data.setValue(0,3,"Hello World!");
*/

	        var o = {
				region: this.get('zoomCountry') || this.get('region'),
				colorAxis: {colors: colors},
				backgroundColor: {stroke:'#444', fill:'white'},
				datalessRegionColor: '#f2f2f2',
				defaultColor: '#e5e5e5',
				resolution: 'countries',
				displayMode: showWorld?'region':'markers',
				enableRegionInteractivity: showWorld,
				sizeAxis: { minValue: 0, maxValue: 100, minSize:5, maxSize: 30 },
				legend: 'none',
				tooltip: {showColorCode: true, textStyle: {color: '#444'}, isHtml: false}
	        };

	        var self=this;
	        google.visualization.events.addListener(chart,'regionClick', function(click){
	        		if(showWorld){
	        			self.attrs.regionClicked(click);
	        		}
				});
	        
	        chart.draw(data, o);
		});
    })),
	didInsertElement: function(){
		var self=this;
		//google.load(moduleName, moduleVersion, optionalSettings)
		var chart = new google.visualization.GeoChart(document.getElementById(this.get('rid')));
        self.set('chart', chart);
        Ember.addChangeSizeListener('regionmap', this, function regionMapResize(){
        	Ember.Logger.debug('region map resize');
        	google.maps.event.trigger(chart, 'resize');
        });
	        /*
		google.load('visualization', {callback:function(){
	        			
		}});*/
	},
	willDestroyElement: function(){
		Ember.removeChangeSizeListeners('regionmap');
		if(this.get('chart')){
			this.get('chart').clearChart();
		}
	},
	actions:{
		backToRegion:function(){
			this.set('zoomCountry', null);
			this.set('regionData', null);
		}
	}
});
