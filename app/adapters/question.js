import ApplicationAdapter from "qumla/adapters/application";
var QuestionRest=ApplicationAdapter.extend({
 shouldReloadAll: function(/*store, snapshotRecordArray*/) {
    return true;
  },
 
  shouldBackgroundReloadAll: function(/*store, snapshotRecordArray*/) {
    return true;
  },
 
  shouldReloadRecord: function(/*store, snapshot*/) {
    return false;
  },
 
  shouldBackgroundReloadRecord: function(/*store, snapshot*/) {
    return false;
  },
});
export default QuestionRest;