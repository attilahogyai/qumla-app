import Ember from 'ember';
import Pluploader from 'ember-plupload/components/pl-uploader';
var _get = Ember.get;
var set = Ember.set;
var keys = Object.keys;

export default Pluploader.extend({
	attachUploader: function attachUploader() {
		var config=_get(this, 'config');
		config.resize={
			width: 650,
			height: 300,
				quality: 87
		};
	    var uploader = _get(this, 'uploader');
	    var queue = uploader.findOrCreate(_get(this, 'name'), this, config);
	    set(this, 'queue', queue);
		// Send up the pluploader object so the app implementing this component as has access to it
	    var pluploader = queue.get('queues.firstObject');
	    this.sendAction('onInitOfUploader', pluploader);
	    this._dragInProgress = false;
	    this._invalidateDragData();
    },
    didInsertElement: function () {
	    Ember.run.scheduleOnce('afterRender', this, 'attachUploader');
	    Ember.run.scheduleOnce('afterRender', this, 'setupDragListeners');
    }
});
