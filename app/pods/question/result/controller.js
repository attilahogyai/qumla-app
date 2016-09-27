import Ember from 'ember';
import CommentAction from 'qumla/mixins/comment-actions';
import Subscription from 'qumla/models/subscription';
import {
    aggregateSum
}
from 'qumla/helpers/aggregate-sum';
import {
    groupBy
}
from 'qumla/helpers/group-by';
import App from 'qumla/app';
import {
    validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
    followaddress: [validator('presence', {
        presence: true,
        message: ' '
    }), validator('format', {
        type: 'email'
    })]
});
export
default Ember.Controller.extend(Validations,CommentAction, {
    optionStatRaw: null, //this is an answer-stat list
    highest: null,
    first: null,
    session: Ember.inject.service(),
    token: Ember.computed.readOnly('session.token'),
    question: null,
    votedOptions: [],

    // there are two data maps on for country and one for detail of clicked country as regionData. The navigation between them hapens from region-map (action up and set zoomCountry) and region maps stored both data 
    countryData: null,
    regionData: null,
    zoomCountry: null,
    percentageHistory: true,

    countryList: null,
    historyStatData: Ember.Object.extend({
        xaxis: null,
        series: null
    }).create(),
    followaddress: null,
    answerstathistoryRaw: null,
    historyEnabled:Ember.computed('answerstathistory', function(){
        var answerstathistory = this.get('answerstathistory');
        return answerstathistory.xaxis.length>=4;
    }),

    summary: Ember.computed('optionStatRaw', function() {
        this.set("first", this.get('optionStatRaw').objectAt(0));
        var aggregatedByOption = aggregateSum(this.get('optionStatRaw'), 'option.id', 'count');
        var sortedList = aggregatedByOption.sortBy('count').reverse();
        var votedOptions = [];        
        for (var i = 0; i < sortedList.length; i++) {
            sortedList[i].set('option.color', Ember.colorList[i]);
            sortedList[i].set('option.index', i);
            votedOptions.push(sortedList[i].get('option'));
        }
        Ember.Logger.debug(votedOptions);
        this.set('votedOptions', votedOptions);

        if (sortedList.length > 0 && sortedList[0].count > 1) {
            Ember.Logger.debug('top count:' + sortedList[0].count);
            this.set('highest', sortedList[0]);
        } else {
            this.set('highest', null);
        }

        return sortedList;
    }),
    answerstathistory:Ember.computed('answerstathistoryRaw','percentageHistory', function(){
        var xaxis = {};
        var options = {};
        var seriesList = this.get('answerstathistoryRaw');
        var self = this;
        seriesList.map(function(item) {
            if (!xaxis[item.date]) {
                xaxis[item.date] = {};
            }
            var value=item.count;
            if(self.get('percentageHistory')){
                value=item.percent;
            }
            xaxis[item.date][item.option] = value;
            options[item.option] = value;
        });
        var optionsArray = [];
        for (var option in options) {
            optionsArray.push({
                option: option,
                value: options[option]
            });
        }
        optionsArray = optionsArray.sortBy('value').reverse()
        var series = {};
        optionsArray.map(function(item) {
            series[item.option] = [];
        });

        var l = [];
        for (var x in xaxis) {
            var m=moment(x);
            l.push(m.format('D. MMM'));
            for (var option in options) {
                series[option].push(xaxis[x][option]);
            }
        }
        var s = [];
        optionsArray.map(function(item) {
            s.push(series[item.option]);
        });
        var o = this.get('historyStatData');
        o.set('xaxis',l);
        o.set('series',s);
        return o;
    }),

    actions: {
        regionClicked: function(region) {
            var self = this;
            var locationP = App.getData('/regionresult', true, "GET", true, false, {
                qid: this.get('question.id'),
                country: region.region
            }, null, null);
            locationP.then(function(data) {
                self.set('regionData', data);
                self.set('zoomCountry', region.region);
            });
        },
        backToRegion: function(){
            this.set('regionMapData', this.get('regionDataBackup'));
        },
        openEmailModal: function() {
            $('#modal1').openModal();
        },
        subscribe: function() {
        	let self=this;
			var subscription = this.store.createRecord('subscription', {
				email: this.get('followaddress'),
				question: this.get('question.id')
            });
            subscription.save().then(function(){
            	self.set('question.subscribed',true);
            	$('#modal1').closeModal();

            }).catch(function(status){
            	console.log('subscription error:'+status);
            })
        },
        onReadyAction: function(){
            Ember.$('ul.tabs').tabs();
            Ember.Logger.debug('tabs are initialized');
        },
        togglePercentage: function(){
            this.set('percentageHistory',!this.get('percentageHistory'));
        }
    }
});