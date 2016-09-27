import Ember from "ember";

var view = Ember.Component.extend({
    appstate: Ember.inject.service(),
    tagName: '',
    didInsertElement: function() {
        Ember.$('#preNavigation').remove();
        Ember.$('.button-collapse').sideNav({
            //menuWidth: 300, // Default is 240
            //edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });

        Ember.$(".dropdown-button").dropdown();

        Ember.addChangeSizeListener('qumla-main-view', this, this.viewportSizeChanged);
        this.viewportSizeChanged();
    },
        /*
 		var lastScrollTop = 0;
		var hidden = false;
		var lastMovement = null;
		var nav=$( "#navigation" );	
		var slide=function(){
 			var st = $(window).scrollTop();
			if(st < lastScrollTop || st===0 ) {
				if(hidden || st===0){
					nav.velocity({ translateY:"0px"},{complete:function(){
						nav.removeAttr('style');
					}});
					hidden = false;
				}
        	}else {
				if(!hidden){
					nav.velocity({ translateY:"-50px"});// delay: 0, duration: 300 
					hidden = true;
				}
        	}
			lastScrollTop = st;
		}


		$( window ).scroll(function(){
			if(lastMovement){
				Ember.run.cancel(lastMovement);
				lastMovement=null;
			}
			lastMovement=Ember.run.debounce(this,slide,50);

		});
		*/
    viewportSizeChanged: function() {
        var fullHeight = Ember.$(window).height();
        var fullWidth = Ember.$(window).width();

        this.set('appstate.heigth', fullHeight);
        this.set('appstate.width', fullWidth);
        var headerSize = 0;
        var navs = Ember.$("#navigation");
        navs.map(function(item) {
            var n = Ember.$(navs[item]);
            if (n.css('display') !== 'none') {
                headerSize = headerSize + n.outerHeight();
            }
        });
        var footerHeight = Ember.$("#footer").outerHeight() + 20;

        var mainHeight = fullHeight - footerHeight - headerSize;
        Ember.$("#main").css('min-height', mainHeight);
        window.console.log('full size:' + fullWidth + 'x' + fullHeight + ' headerSize:' + headerSize + ' footerheight:' + footerHeight + ' mainheight:' + mainHeight);
    }
});

function cs() {
    for (var property in Ember.changeSizeListeners) {
        if (Ember.changeSizeListeners.hasOwnProperty(property)) {
            var listener = Ember.changeSizeListeners[property];
	        if (!listener) {
	            continue;
	        }
            Ember.run(listener.ctx, listener.func);
    	}
	}
}

Ember.changeSizeListeners = {};
Ember.changeSize = function(){
	Ember.run.debounce(this, cs, 150);
},
Ember.addChangeSizeListener = function(owner, context, listener) {
	Ember.assert("second parameter should be unique for application", owner);
    var listeners = Ember.changeSizeListeners;
	listeners[owner] = {func:listener,ctx:context};
},
Ember.removeChangeSizeListeners = function(owner) {
    var listeners = Ember.changeSizeListeners;	
	listeners[owner] = null;
}

export default view;