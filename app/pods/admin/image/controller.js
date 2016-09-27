import App from "qumla/app";
import { toAscii } from 'qumla/helpers/to-ascii';
import Ember from 'ember';

var ObservableField = Ember.Object.extend({
	fieldName: null,
	fieldValue: null,
	meta:null
});


export default Ember.Controller.extend({
	instance: null,
	objectList: null,
	modelName:null,
	mode:'list', // list, insert, update, delete
	isError: null,
	isCompleted: false,
	modal: 	Ember.inject.service(),

	instanceFields: {},

	uploadFile: null,	
	uploadFileUrl: null,
	uploadImage: null,

	/** 
	* Builds up an object which at the end contains all model fields configuration
	* the editor form will be buildt based on this configuration.
	*/
	fields: function(){
		var c=this;
		if(this.get('instance') && !this.get('instanceFields')[this.get('modelName')] && this.get('instance').editables){
			if(this.get('instance').editables){
				var editableFields=this.get('instance').editables().map(function(fName){
					var displayType='text';
					var type=Ember.get(c.store.modelFor(c.get('modelName')),'attributes').get(fName).type;
					if(type==='number'){
						displayType='number';
					}
					Ember.Logger.info('type:'+type+' displayType:'+displayType);
					var f=ObservableField.create({
						fieldName: fName,
						meta: c.store.modelFor(c.get('modelName')),
						fieldValue: c.get('instance').getF(fName,type),
						displayType: displayType,
						isTextarea: fName==='text'
					});
					c.addObserver('instance',f,function(sender, key, value, rev){
						if(sender.get('instance')!==null){
							f.set('fieldValue',sender.get('instance').getF(f.get('fieldName'),type));
						}
					});
					f.addObserver('fieldValue',f,function(sender, key, value, rev){
						c.get('instance').setF(this.fieldName,this.fieldValue,type);
					});
					return f;
				});
				this.get('instanceFields')[this.get('modelName')]=editableFields;

			}
		}
		return this.get('instanceFields')[this.get('modelName')];
	}.property('modelName','mode'),
	
	isEditMode: function(){
		return this.get('mode')==='insert' || this.get('mode')==='delete' || this.get('mode')==='update';
	}.property('mode'),
	message: function(){
		if(!this.get('modelName')) { return null; }

		if(this.get('isCompleted')){
			return App.locX("/admin/"+this.get('mode')+"_completed");	
		}
		if(this.get('isError')){
			return App.locX("/admin/"+this.get('mode')+"_error",[this.get('modelName')]);	
		}
		return App.locX("/admin/"+this.get('mode')+"_of_", [this.get('modelName')]);
		
	}.property('modelName','mode','isError','isCompleted'),
	

	initVariable: function(){
		this.set('isError',false);
		this.set('isCompleted',false);
		this.set('instance',null);
	},
	saveSuccess: function(status){
		this.set('isError',false);
		this.set('isCompleted',true);
			// fade effect
		Ember.run.later(this, function() {
			this.initVariable();
			this.set('mode','list');
		},1000);			
	},
	saveError: function(status){
		Ember.Logger.error(status.stack);
		this.set('isError',true);
		this.set('isCompleted',false);
	},

doUploadImage: function(){
		var self=this;
		return new Ember.RSVP.Promise(function(resolve,reject){
			self.get('uploadImage').save().then(function(imgData){
				self.set('uploadImage',imgData);
				// upload image
				imgData.set('path',imgData.get('id')+toAscii(imgData.get('title'))); // concatenation of id and name because the path should be unique
				self.get('uploadFile').upload('/api/uploadfile/'+toAscii(imgData.get('title'))+'/'+imgData.get('id'),
					{headers:{"Authorization": "Bearer "+self.get('session.token')}}).
				then(function (response) {
					// finish saving question
					imgData.set('dominant',response.body.dominant);
					resolve(imgData);
				}).catch(function(){
					reject('ERROR UPLOAD IMAGE');
				});
			});
		});

	},	
	actions: {
		listItems: function (modelName){
			var objectList=this.store.findAll(modelName);
			if(this.get('instance')!==null && this.get('instance').get('isDirty')){
				this.get('instance').rollback();
			}
			this.set('isError',false);
			this.set('instance',null);
			this.set('isCompleted',false);
			this.set('objectList',objectList);
			this.set('modelName',modelName);
			this.set('mode','list');
			return false;
		},
		loadInstance: function (id){
			var c=this;
			this.store.find(this.get('modelName'),id).then(function(data){
				c.initVariable();
				c.set('instance',data);
				c.set('mode','update');
			});
			return false;
		},
		initNew: function(){
			var modelObject = this.store.createRecord(this.get('modelName'),  {});
			this.initVariable();
			this.set('instance',modelObject);
			this.set('mode','insert');
			return false;
		},
		remove: function(){
			var cc=this;
			this.set('mode','delete');
			this.get('instance').destroyRecord().then(
				function(status) {
					return cc.saveSuccess(status);
				}).catch(
				function(status) {
					return cc.saveError(status);
				});
		},
		commit: function(){
			var cc=this;
			this.get('instance').save().then(
				function (status){
					return cc.saveSuccess(status);}
				).catch(
				function (status){
					return cc.saveError(status);
				}
			);
			return false;
		},
		copyasnew:function(){
			var instance=this.get('instance');
			var c=instance.copy();
			var modelObject = this.store.createRecord(this.get('modelName'),  c);
			this.initVariable();
			this.set('instance',modelObject);
			this.set('mode','insert');
			return false;
		},

		setUploadImage: function (file) {
			var self=this;	
			if(this.get('uploadImage')){
				this.get('uploadImage').rollbackAttributes();
			}

			var uploadImage = self.store.createRecord('image', {
				title: toAscii(file.get('name')),
				path: toAscii(file.get('name')),
				type: 0,
				status: 2
			});

			this.set('uploadImage',uploadImage);

			if(this.get('uploadFile')){
				this.get('uploadFile').destroy();
			}	
			this.set('uploadFile',file);

			file.read().then(function (url) {
				self.set('uploadFileUrl',url);
			});
		}
		/*,

		uploadImage:function(){
			var self=this;
			if(this.get('uploadImage')!=null){ // upload image just in case if the selected is the image
				this.get('modal').toast('Uploading image ...');
				var uploaderP=this.doUploadImage();
				this.get('loader').startLoadProcess(uploaderP);	
				uploaderP.then(function(imgData){
					self.get('modal').toast('Image upload ready...');
				});					
			}else{
				saveQuestion(self,self.get('selectedImage'));
			}
		}
		*/
	}
});
