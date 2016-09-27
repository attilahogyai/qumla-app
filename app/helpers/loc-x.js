import App from 'qumla/app';
import Ember from 'ember';
function locX(value,option1,option2,option3) {
    return App.locX(value,option1,option2,option3);
}
export default Ember.Helper.helper(locX);
