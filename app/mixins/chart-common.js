import Ember from 'ember';

export default Ember.Mixin.create({
	setupTooltip:function(){
		var $chart=Ember.$('#'+this.get('cid'));
		var $toolTip = $chart
		  .append('<div id="tooltip-'+this.get('cid')+'" class="ct-tooltip"></div>')
		  .find('.ct-tooltip')
		  .hide();

		$chart.on('mouseenter', '.ct-hover', function() {
		  var $line = Ember.$(this),
		    //value = $line.attr('ct:value'),
		    percent = $line.attr('ct:meta');
		  	$toolTip.html(percent).show();
			$line.fadeTo(300,0.5);

		});

		$chart.on('mouseleave', '.ct-hover', function() {
		  $toolTip.hide();
		  var $line = Ember.$(this);
		  $line.fadeTo(300,1);

		});

		$chart.on('mousemove', function(event) {
		  var xoffset=$toolTip.outerWidth() / 2 || 40;
		  $toolTip.css({
		    left: (event.offsetX || event.originalEvent.layerX)-xoffset,
		    top: (event.offsetY || event.originalEvent.layerY)-40
		  });
		});
	}
});

