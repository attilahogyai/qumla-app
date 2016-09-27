import Ember from 'ember';
import ChartCommon from 'qumla/mixins/chart-common';
export default Ember.Component.extend(ChartCommon,{
	tagName: "",		
	cid:'bar-chart',
	showLabelX: false,
	showLabelY: true,	
	seriesList: null,	
	percent: [],
	highest: null,
	labels: [],
	series: [],
	slideGap: 0,
	allOptions: null,
	wrap: true,
	generateSeries:function(){
		this.set("percent",[]);
		this.set("labels",[]);
		this.set("series",[]);
		var self=this;
		this.get('seriesList').map(function(item){
			self.get('series').push({
				value:item.get('count'),
				meta: item.get('percent')+'% - '+item.get('option.text')
			});
			self.get('labels').push(item.get('option.text'));
			self.get('percent').push(item.get('percent'));			
		});
	},
	didInsertElement:function(){
		this.generateSeries();
    	
		var s = this.get('series').map(function(item){
			return item;
		});
		var l = this.get('labels');

		new Chartist.Bar('#'+this.get('cid'), {
		  labels: l,
		  series: [s],
		}, {
		  stackBars: false,
		  horizontalBars: false,
		  axisY: {
   			position: 'end',
		  	showLabel: this.get('showLabelY')   			
  		  },
  		  axisX: {
   			offset:0,
		  	showLabel: this.get('showLabelX'),
		  	showGrid: false
  		  }  			  	  
		}).on('draw', function(data) {
			console.log('type:'+data.type);
			if(data.type === 'bar') {
			  	data.element.removeClass('ct-bar'); // remove the default color
			  	data.element.addClass('color-series-'+data.index); // add series color 
			  	data.element.addClass('ct-hover'); 	  	
			    data.element.attr({
			      style: 'stroke-width: 15px'
			    });
			    /*
			    var labelElement = data.group.foreignObject('<span>AAAA</span>', Chartist.extend({
        style: 'overflow: visible;'
      }, {x:data.x2,y:data.y2}));
	  			data.group.append(new Chartist.Svg('circle', {
	      			cx: data.x2,
	      			cy: data.y2+10,
	      			r: 10
	    			}, 'ct-slice-pie')); */		    
			}else if (data.type === 'label'){
				if(parseInt(data.text,10)!==data.text){
					data.text = '';
				}else{
            		data.element.addClass('bar-chart-label');
				}
            }

		});
		this.setupTooltip();
	}
});