import Ember from 'ember';

export default Ember.Mixin.create({
  initFoundation: function(){
    Ember.$(document).foundation({
      offcanvas : {
          // Sets method in which offcanvas opens.
          // [ move | overlap_single | overlap ]
          open_method: 'overlap_single', 
          // Should the menu close when a menu link is clicked?
          // [ true | false ]
          close_on_click : true
      },
      reveal:{
        animation: 'fadeAndPop',
          animation_speed: 250,
          close_on_background_click: false,
          dismiss_modal_class: 'close-reveal-modal',
          bg_class: 'reveal-modal-bg',
          root_element: 'body',
          bg : Ember.$('.reveal-modal-bg'),
          css : {
            open : {
                'opacity': 0,
                'visibility': 'visible',
                'display' : 'block'
            },
            close : {
                'opacity': 1,
                'visibility': 'hidden',
                'display': 'none'
            }
          }
      }
    });
    Ember.Logger.debug('FOUNDATION INITIATED');
  }
});
