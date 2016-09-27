import Ember from 'ember';
export default Ember.Component.extend({
	tagName: "",		
	cid:'donut-chart',
	showLabel: false,
	seriesList: null,	
	percent: [],
	highest: null,
	labels: [],
	series: [],
	top: null,
	slideGap: 0,
	topPercent:Ember.computed('top',function(){
		if(this.get("top")) return this.get("top.percent");
		return "?";
	}),		
	generateSeries:function(){
		this.set("percent",[]);
		this.set("labels",[]);
		this.set("series",[]);
		var self=this;
		this.get('seriesList').map(function(item){
			self.get('series').push(item.get('count'));
			self.get('labels').push(item.get('option.text'));
			self.get('percent').push(item.get('percent'));			
		});
	},
	didInsertElement:function(){
		this.generateSeries();
		var s = this.get('series');
		var l = this.get('labels');
		var chart = new Chartist.Pie('#'+this.get('cid'), {
			series: s,
			labels: l
		}, {
			donut: true,
			donutWidth: 10,
			showLabel: this.get('showLabel'),
			labelOffset: 0,
			classNames: {
				series:'ch-top-series'
			}
		});
		var gap=this.get('slideGap');
		chart.on('draw', function(data) {
			if(data.type === 'slice') {
			    // Get the total path length in order to use for dash array animation
			    var pathLength = data.element._node.getTotalLength();

			    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
			    data.element.attr({
			    	'stroke-dasharray': (pathLength-gap) + 'px ' + pathLength + 'px'
			    });

	    		// Create animation definition while also assigning an ID to the animation for later sync usage
	    		/*
	    		var animationDefinition = {
	    			'stroke-dashoffset': {
	    				id: 'anim' + data.index,
	    				dur: 500,
	    				from: -pathLength + 'px',
	    				to:  '0px',
	    				easing: Chartist.Svg.Easing.easeOutQuint,
	        			// We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
	        			fill: 'freeze'
	        		}
	        	};
				*/
			    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
			    /*
			    if(data.index !== 0) {
			    	animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
			    }
				*/
			    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
			    /*
			    data.element.attr({
			    	'stroke-dashoffset': -pathLength + 'px'
			    });
				*/
			    // We can't use guided mode as the animations need to rely on setting begin manually
			    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
			    /*
			    data.element.animate(animationDefinition, false);
			    */
			}
		});

		// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
		/*
		chart.on('created', function() {
			if(window.__anim21278907124) {
				clearTimeout(window.__anim21278907124);
				window.__anim21278907124 = null;
			}
			window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
		});
		*/
	}
});