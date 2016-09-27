import DS from "ember-data";
var DefaultRest=DS.JSONAPIAdapter.reopen({
	shouldReloadAll:function(){
		return true;
	},
	//host: 'http://qumla.com',
	namespace:"api/japi",
	ajaxOptions: function(url, type, hash){
		var t;
		var si=window.location.href.indexOf("?t=");
		if(si>-1){
			t=window.location.href.substring(si+3);
		}
		if(url.indexOf('?')===-1){
			url+='?l='+this.get('session.language');
		}else{
			url+='&l='+this.get('session.language');
		}
		if(t){
			url+="&t="+t;
		}
    	var s=this.get('session.solution');

		if(s){
			this.set('session.solution',null);
			url=url+"&s="+s;	
		}
		
		var retv=this._super(url,type,hash);

		var token=this.get('session.token');
		retv.beforeSend = function (xhr) {
			if(token){
     			xhr.setRequestHeader("Authorization", "Bearer "+token);
     		}
        };
        return retv;
  	},
	ajax: function(url, type, options) {
		var retv=this._super(url,type,options);
		retv.catch(function(response){
			if(parseInt(response.status)===401){
				App.reload();
			}
		});
    	return retv;
  	}
});
export default DefaultRest;