import EmberxSelect from 'qumla/components/x-select';
import Ember from 'ember';
export default EmberxSelect.extend({
	didInsertElement:function(){
		this.$().material_select();
	}
});
