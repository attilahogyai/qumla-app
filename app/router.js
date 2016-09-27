import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('question',{path:'question/:question_id/:question_text'},function(){
    this.route('detail',{ path: 'detail' });
    this.route('result',{ path: 'result' });
    this.route('edit');
  });
  this.route('profile',function(){
    this.route('index');
    this.route('answered');    
    this.route('signup');
    this.route('modify');
    this.route('forgotpwd');
    this.route('forgotpwchange',{ path: '/forgotpwchange/:requestid'});
  });
  this.route('activate',{path:'/activate/:code/:email'});
  
  this.route('privacy');
  this.route('terms');
  this.route('cpolicy');
  this.route('admin', {path: 'admin'},function() {
    this.route("language", {path: "language"}); 
    this.route("image", {path: "image"});

  });
  this.route('search',{path: '/search/:querystring'});
  this.route('oauth2callback',{ path: '/oauth2callback/:authToken/:state'});
  this.route('foauth2callback',{ path: '/foauth2callback/:authToken'});
  this.route('oauth2callback',{ path: '/oauth2callback/:authToken/:state'});
  
  // channel cpuld for example base, space, politics, tech ... 
  // query could be for example popular, latest, answered
  this.route('filter', {path:'filter/:channel/:query'});
  this.route('hashtag', {path:'hashtag/:tag'});
});

export default Router;
