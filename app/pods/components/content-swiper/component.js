import Ember from "ember";

export default Ember.Component.extend({
	pagination:false,
	navigation:false,
	scrollbar:false,
	height:"170px",
	swiperInstance:null,

	didInsertElement: function(){
		Ember.$('.'+this.get("class")).css('height',this.get("height"));
		var options={};
		if(this.get("pagination")){
			options.pagination = '.swiper-pagination';
		}
		if(this.get("navigation")){
			options.nextButton = '.swiper-button-next';
    		options.prevButton = '.swiper-button-prev';
		}
		if(this.get("scrollbar")){
			options.scrollbar = '.swiper-scrollbar';	
		}
		options.direction = 'horizontal';
		options.slidesPerView = 'auto';
		options.spaceBetween = 10;
		options.loop = false;
		options.observer = true;
		options.preloadImages = true;
		options.updateOnImagesReady = true;
		options.slidesPerColumn = 1;
		options.mousewheelControl = true;
		this.set('swiperInstance',new Swiper ('.swiper-container', options));
		
	}
});