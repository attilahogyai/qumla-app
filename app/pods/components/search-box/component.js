import Ember from 'ember';
import App from 'qumla/app';
import { toAscii } from 'qumla/helpers/to-ascii';

export default Ember.Component.extend({
	tagName:"",
	query: "",
	vcallback: function(){
		let self=this;
		if(this.actValue.length>=2){
			let queryS=App.getData('/search',true,"POST",true,false,{query:this.actValue,l:this.language},null,null);
			let awesome=this;
			queryS.then(function(result){
				awesome._list=[];
				result.forEach(function(item,index){
					awesome._list.push(item);
				});
				awesome.evaluateResult(awesome.actValue);
			});
		}
	},	
	didInsertElement: function(){
		let self=this;
		var awesome=new Awesomplete($("input.quicksearch")[0], {
				list: [],
				filter: function (text, input) {return true;},
				sort: null,
				item: function (item, input) {
						var html = input === '' ? item.title : item.title.replace(new RegExp(input.trim().replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&"), "gi"), "<mark>$&</mark>");
						var cla="s-question";
						if(item.title.indexOf("#")===0){
							cla="s-tag";
						}
						var id="";
						if(item.type==='q'){
							id="q-"+item.id;
						}else{
							id="t-"+item.id;							
						}
						var element = document.createElement("li");
						element.innerHTML=html;
						element.setAttribute("class",cla);
						element.setAttribute("id",id);						
						element.setAttribute("aria-selected",false);
						return element;
					},
				valueCallback: function(value){
					this.actValue=value;
					this.language=self.get('session.language');
					this.comp=self;
					Ember.run.debounce(this, self.vcallback, 300);
				}
			});
		awesome.input.addEventListener('awesomplete-select',function(event){
			if(event.origin.id.substring(0,1)==='q'){
				self.sendAction('jumpToQuestion', toAscii(event.text), event.origin.id.substring(2));
			}else{
				self.sendAction('jumpToTag', event.text);
			}
			return true;
		});
		awesome.input.addEventListener('awesomplete-enter',function(event){
			self.sendAction('jumpToSearch', self.get('query'));
		});
		
	}
});
