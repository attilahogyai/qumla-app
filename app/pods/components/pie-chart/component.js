import Ember from 'ember';
import ChartCommon from 'qumla/mixins/chart-common';
export default Ember.Component.extend(ChartCommon,{
	tagName: "",		
	cid:'pie-chart',
	showLabelX: false,
	showLabelY: false,	
	seriesList: null,	
	percent: [],
	highest: null,
	labels: [],
	series: [],
	slideGap: 0,
	wrap: true,
	generateSeries:function(){
		this.set("percent",[]);
		this.set("labels",[]);
		this.set("series",[]);
		var self=this;
		this.get('seriesList').map(function(item){
			self.get('series').push({
				total: item.get('total'), 
				value: item.get('count'),
				meta: item.get('percent')+'% - '+item.get('option.text')
			});
			self.get('labels').push(item.get('option.text'));
			self.get('percent').push(item.get('percent'));			
		});
	},
	didInsertElement:function(){
		this.generateSeries();
		var total=this.get('series')[0].total;
    	
		var s = this.get('series');

		var l = this.get('labels');


		var chart = new Chartist.Pie('#'+this.get('cid'), {
			series:this.get('series')}, {
  			labelInterpolationFnc: function(value) {
    			return Math.round(value / total * 100) + '%';
  			},
  			donut: true,
  			donutWidth: 40,
  			showLabel: true
		});

		chart.on('draw', function(data) {
		  if(data.type === 'slice') {
		    // Get the total path length in order to use for dash array animation
		    var pathLength = data.element._node.getTotalLength();
		  	data.element.addClass('ct-hover'); 	  	

		    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
		    data.element.attr({
		      'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
		    });

		    // Create animation definition while also assigning an ID to the animation for later sync usage
		    var animationDefinition = {
		      'stroke-dashoffset': {
		        id: 'anim' + data.index,
		        dur: 2000/s.length,
		        from: -pathLength + 'px',
		        to:  '0px',
		        easing: Chartist.Svg.Easing.easeOutQuint,
		        // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
		        fill: 'freeze'
		      }
		    };

		    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
		    if(data.index !== 0) {
		      animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
		    }

		    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
		    data.element.attr({
		      'stroke-dashoffset': -pathLength + 'px'
		    });

		    // We can't use guided mode as the animations need to rely on setting begin manually
		    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
		    data.element.animate(animationDefinition, false);
		  	}else if (data.type === 'label'){
                if(parseInt(data.text)<6){
                        data.element._node.innerHTML = '';
                }
            }
		});
		this.setupTooltip();
	}
});