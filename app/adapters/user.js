
import RestAdapter from 'qumla/adapters/restadapter';

var UserAdapter=RestAdapter.extend({
	createRecord: function(store, type, record) {
        var data = {};
        var serializer = store.serializerFor('user');

        serializer.serializeIntoHash(data, type, record, { includeId: true });

        return this.ajax(this.namespace+'/signup', "POST", { data: data });
    }
});

export default UserAdapter;