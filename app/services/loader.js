import Ember from 'ember';

export default Ember.Service.extend({
	__processName:null,
	__obj:null,
	promisCount:0,
	loading: false,
	startAppLoadProcess:function(){
		this.startLoadProcess();
	},
	finishAppLoadProcess:function(listenToObject){
		this.listenTo(listenToObject);
	},

	startLoadProcess:function(listenToObject){
		this.set('loading',true);
		this.startProcess(null,'load',listenToObject);
	},
	startSaveProcess:function(listenToObject){
		this.startProcess(null,'save',listenToObject);
	},
	startProcess:function(obj,name,promise){
		if(this.get('__obj')!==null){  // disable previous process
			this.get('__obj').set(this.get('__processName')+'Processing',false);
		}
		this.set('__processName',name);
		if(obj!==null){
			this.set('__obj',obj);
			this.get('__obj').set(this.get('__processName')+'Processing',true);
		}
		if(promise){
			this.listenTo (promise);
		}
	},
	finishProcess:function(){
		this.decrementProperty('promisCount');
		if(this.get('promisCount')===0){
			if(this.get('__processName')==='load'){
				this.set('loading',false);
			}
			if(this.get('__obj')!==null){
				this.get('__obj').set(this.get('__processName')+'Processing',false);
			}
			this.set('__processName',null);
			this.set('__obj',null);
		}
	},
	listenTo:function(promise){
		if(this.get('__processName')!==null){ // start listen to promise
			var l=this;
			this.incrementProperty('promisCount');
			promise.then(function(){
				l.finishProcess();
			});
			if(promise.catch){
				promise.catch(function(){
					l.finishProcess();
				});
			}else{
				if(promise.fail){
					promise.fail(function(){
						l.finishProcess();
					});
				}
			}
		}
	}	
}); 