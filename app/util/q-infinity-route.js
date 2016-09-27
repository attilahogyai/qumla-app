import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
export default Ember.Route.extend(InfinityRoute,{
	perPageParam: "page[limit]",              // instead of "per_page"
	pageParam: "page[offset]",                  // instead of "page"
	totalPagesParam: "meta.totalPages",    // instead of "meta.total_pages"	
	count: "meta.count",    // instead of "meta.total_pages"	
	
  	actions:{
		infinityModelUpdated(totalPages) {
		    Ember.Logger.debug('updated with more items');
		},
		infinityModelLoaded(lastPageLoaded, totalPages, infinityModel) {
		    Ember.Logger.info('no more items to load');
		}
	}
});
