import Ember from 'ember';
import {
    toAscii
}
from 'qumla/helpers/to-ascii';
import {
    generateUUID
}
from 'qumla/helpers/uuid-seq';
import App from 'qumla/app';


function saveQuestion(self, imgData) { // receives the imagedata and saves the question
    self.get('question').set('mandatory', 'true');
    if (imgData) { // imgData is passed just in case when a new or uploaded image is selected. In any other case remain the old
        self.get('question').set('img', imgData.get('path'));
        self.get('question').set('color', imgData.get('dominant'));
    }
    self.get('modal').toast('Saving question ...');

    // saving question bug
    self.get('question').set('status',100);

    var questionSaveP = self.get('question').save();
    self.get('loader').startLoadProcess(questionSaveP);

    questionSaveP.then(function( /*data*/ ) {
        var options = self.get('question.options');
        var optionSavePromise = [];
        for (var i = 0; i < options.get('length'); i++) {
            options.objectAt(i).set('ord', i);
            optionSavePromise[i] = options.objectAt(i).save();
        }
        var saveOptionsP = Ember.RSVP.all(optionSavePromise);
        saveOptionsP.then(function() {
            self.get('modal').openQuestionSavedModal(self.get('question'));

            if (self.get('isPrivate')) {
                var queryParams = {
                    queryParams: {
                        t: self.get('question.ticket')
                    }
                };
                self.transitionToRoute('question.detail', self.get('question.id'), toAscii(self.get('question.title')), queryParams);
            } else {
                self.transitionToRoute('question.detail', self.get('question.id'), toAscii(self.get('question.title')));
            }

        });
        self.get('loader').startLoadProcess(saveOptionsP);
    }).catch(function(status) {
        if (status.errors && status.errors[0].detail === 'DBC_UQ_QUESTION_TITLE') {
            self.get('modal').openInfoModal({
                header: 'Error',
                text: App.locX('/question/unique_error')
            });
        } else {
            self.get('modal').openInfoModal({
                header: 'Error',
                text: App.locX('/question/save_error')
            });
        }
        return false;
    });
}

function sU() {
    this.slideUp('.moreDetail');
}

function sD() {
    this.slideDown('.moreDetail');
}

function imageListLoader() {
    var images = this.store.query('image', {
        filter: {
            query: this.get('question.title'),
            language: this.get('question.language')
        }
    });
    var self = this;
    images.then(function() {
        self.set('images', images);
    });
}

export default Ember.Controller.extend({
    question: null,
    mode: null,
    selectedImage: null,
    step: 1,
    modal: Ember.inject.service(),
    session: Ember.inject.service(),

    step1: Ember.computed("step", function() {
        return this.get("step") === 1;
    }),
    step2: Ember.computed("step", function() {
        return this.get("step") === 2;
    }),
    step3: Ember.computed("step", function() {
        return this.get("step") === 3;
    }),

    domCache: {},

    // file upload

    uploadFile: null,
    uploadFileUrl: null,
    uploadImage: null,

    recaptcha: false,
    recaptchaWidget: null,

    afterRender: false,

    isPrivate: Ember.computed('question.ticket', {
        get: function() {
            return !!this.get('question.ticket');
        },
        set: function(key, value) {
            if (value) {
                this.set('question.ticket', generateUUID());
                return true;
            } else {
                this.set('question.ticket', null);
                return false;
            }
        }
    }),

    images: null, // update by imageTitle observer

    titleObserver: Ember.observer('question.title', function() {
        if (this.get('question.title') && this.get('question.title').length > 10) {
            Ember.run.debounce(this, imageListLoader, 1000);
        }
    }),
    privateUrl: Ember.computed('question.ticket', 'question.id', function() {
        if (this.get('question.id') && this.get('question.ticket')) {
            return 'https://qumla.com/question/' + this.get('question.id') + '/' + toAscii(this.get('question.title')) + '/detail?t=' + this.get('question.ticket');
        } else {
            return '';
        }
    }),
    init: function() {
        this.set('step', 1);
        this.set('uploadFile', null);
        this.set('uploadFileUrl', null);
        this.set('uploadImage', null);
        this.set('selectedImage', null);
        this.set('afterRender', false);
        this.set('domCache', {});
        Ember.run.schedule("afterRender", this, function() {
            this.set('afterRender', true);
            // set focus on #title 
            Ember.run.later(this, function() {
                Ember.$('#title').focus();
                Ember.$('#title').trigger('click');
            }, 300);
        });
    },

    validTill: Ember.computed('question.validTill', {
        get(key) {
            if (this.get('question.validTill')) {
                return this.get('question.validTill').format('LL');
            }
            return '';
        },
        set(key, value) {
            this.set('question.validTill', moment(value, "LL"));
            return value;
        }
    }),

    clear: function() {
        this.get('question').rollbackAttributes();
        if (this.get('recaptcha')) {
            grecaptcha.reset(this.get('recaptchaWidget'));
        }
        this.set('recaptcha', false);
    },
    isDirty: function() {
        return this.get('question.hasDirtyAttributes');
    },
    customType: Ember.computed("question.type", function() {
        return this.get('question.type') === 4;
    }),
    getDom: function(selector) {
        var domCache = this.get('domCache');
        if (!domCache[selector] || domCache[selector].length === 0) {
            domCache[selector] = Ember.$(selector);
        }
        if (domCache[selector] && domCache[selector].length > 0) {
            return domCache[selector];
        }
        return null;
    },
    slideDown: function(selector) {
        var d = this.getDom(selector);
        if (d && Ember.$(d[0]).css('display') === 'none') {
            d.velocity("slideDown", {
                duration: 700,
                easing: 'ease'
            });
        }
    },
    slideUp: function(selector) {
        var d = this.getDom(selector);
        if (d && Ember.$(d[0]).css('display') !== 'none') {
            d.velocity("slideUp", {
                duration: 700,
                easing: 'ease'
            });
        }
    },
    imageChangerObserver: Ember.observer('changeImage', 'mode', function() {
        if (this.get('mode') === 'new') {
            this.slideDown('#photoSelector');
        } else {
            if (this.get('changeImage')) {
                this.slideDown('#photoSelector');
            } else {
                this.slideUp('#photoSelector');
            }
        }
    }),
    isNew: Ember.computed('mode', function() {
        return this.get('mode') === 'new';
    }),
    showSubmit: Ember.computed("afterRender", "question.options", "question.options.@each.text", "question.title", "question.url", "selectedImage", "step", function() {
        if (!this.get('afterRender')) return;
        var show = false,
            step = this.get('step'),
            url;

        if (step >= 1) {
            if (this.get("question.title") && this.get("question.title").length > 7 && this.get("question.title").indexOf(' ') > -1) {
                show = true;
                url = this.getDom('#url');
                show = show && !!url && url[0].validity.valid;
                Ember.run.debounce(this, sD, 1000);
            } else { // disable detail inputs
                Ember.run.debounce(this, sU, 1000);
            }
        }
        if (step >= 2 && show) {
            show = false;
            var l = this.get("question.options.length");
            for (var i = 0; i < l; i++) {
                show = this.get('question.options').objectAt(i).get('text').length > 0;
                if (!show) break;
            }
        }
        if (step >= 3 && show) {
            show = this.get('selectedImage') != null || this.get('question.img') != null;
        }
        if (show && step >= 3 && !this.get('recaptcha')) {
            var self = this;
            if (!this.get('session.isRegistered')) {
                self.set('recaptcha', true);
                Ember.run.scheduleOnce('afterRender', function() {
                    self.set('recaptchaWidget', grecaptcha.render('recaptcha', {
                        'sitekey': '6LeQfQ0TAAAAAMOHnR9Z9MYJw0D1IRuoP6apsH8W'
                    }));
                });
            } else {
                self.set('recaptcha', false);
            }
        }

        return show;
    }),
    submitText: Ember.computed("question.options", "step", function() {
        var step = this.get("step");
        if (step === 1 || step === 2) {
            return 'OK <i class="material-icons right">check</i>';
        } else if (step === 3) {
            return 'Post <i class="material-icons right">check</i>';
        }
    }),
    showOptions: Ember.computed("question.type", function() {
        return this.get("question.type") === 4;
    }),

    doUploadImage: function() {
        var self = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            self.get('uploadImage').save().then(function(imgData) {
                self.set('uploadImage', imgData);
                // upload image
                imgData.set('path', imgData.get('id') + toAscii(imgData.get('title'))); // concatenation of id and name because the path should be unique
                self.get('uploadFile').upload('/api/uploadfile/' + toAscii(imgData.get('title')) + '/' + imgData.get('id'), {
                    headers: {
                        "Authorization": "Bearer " + self.get('session.token')
                    }
                }).
                then(function(response) {
                    // finish saving question
                    imgData.set('dominant', response.body.dominant);
                    resolve(imgData);
                }).catch(function() {
                    reject('ERROR UPLOAD IMAGE');
                });
            });
        });

    },

    vcallback: function() {
        if (this.actValue.length >= 2) {
            var tags = this.store.query('tag', {
                filter: {
                    query: this.actValue
                }
            });
            var awesome = this;
            tags.then(function(result) {
                if (result.get('length') > 0) {
                    awesome._list = [];
                    result.forEach(function(item, index) {
                        awesome._list.push(item.get('tag'));
                    });
                    awesome.evaluateResult(awesome.actValue);
                }
            }).catch();
        }
    },
    actions: {
        ready: function() {
            let self = this;
            new Awesomplete($("#description")[0], {
                list: [],
                filter: Awesomplete.FILTER_STARTSWITH,
                rawValue: false,
                valueCallback: function(value) {
                    this.actValue = value;
                    this.store = self.store;
                    Ember.run.debounce(this, self.vcallback, 300);
                }
            });
            new Awesomplete($("#title")[0], {
                list: [],
                filter: Awesomplete.FILTER_STARTSWITH,
                rawValue: false,
                valueCallback: function(value) {
                    this.actValue = value;
                    this.store = self.store;
                    Ember.run.debounce(this, self.vcallback, 300);
                }
            });
        },
        onNext: function() {
            if (!this.get('showSubmit')) {
                alert('Please fill all question detail fields !');
                return;
            }
            if (this.get('step') === 3) {
                var solution;
                if (this.get('recaptcha')) {
                    solution = grecaptcha.getResponse(this.get('recaptchaWidget'));
                    if (solution === null || solution === '') {
                        this.get('modal').openInfoModal({
                            header: 'Info',
                            text: 'Are you human? Please solve the reCAPTCHA!'
                        });
                        return false;
                    }
                }
                var self = this;
                if (this.get('uploadImage') != null && this.get('uploadImage.path') === this.get('selectedImage.path')) { // upload image just in case if the selected is the image
                    self.get('modal').toast('Uploading image ...');
                    var uploaderP = self.doUploadImage();
                    self.get('loader').startLoadProcess(uploaderP);
                    uploaderP.then(function(imgData) {
                        self.get('session').set('solution', solution);
                        saveQuestion(self, imgData);
                    });
                } else {
                    self.get('session').set('solution', solution);
                    saveQuestion(self, self.get('selectedImage'));
                }
            } else {
                this.incrementProperty("step");
            }
        },
        addOption: function() {
            var q = this.get('question');
            this.store.createRecord('option', {
                text: '',
                question: q
            });
        },
        removeOption: function() {
            var q = this.get('question');
            var l = q.get('options.length');
            if (l > 2) {
                var o = q.get('options').objectAt(l - 1);
                o.destroyRecord().then(function() {
                    q.get('options').removeObject(o);
                });
            }
        },
        selectImage: function(image) {
            if (image) {
                this.set('selectedImage', image);
                this.get('question').set('img', image.get('path'));
            }
        },
        prefill: function(type) {
            var q = this.get('question');
            var options = [];
            var optionDelPromise = [];
            // a bit wierd but i could not get it worked in other way
            q.get('options').forEach(function(option) {
                options.push(option);
            });
            options.forEach(function(o) {
                q.get('options').removeObject(o);
                optionDelPromise.push(o.destroyRecord());
            });
            var optionDelP = Ember.RSVP.all(optionDelPromise);
            var self = this;
            optionDelP.then(function() {
                q.set('type', type);
                if (type === 1) {
                    self.store.createRecord('option', {
                        text: 'Yes',
                        question: q
                    });
                    self.store.createRecord('option', {
                        text: 'No',
                        question: q
                    });
                } else if (type === 2) {
                    self.store.createRecord('option', {
                        text: 'Agree',
                        question: q
                    });
                    self.store.createRecord('option', {
                        text: 'Disagree',
                        question: q
                    });
                } else if (type === 3) {
                    self.store.createRecord('option', {
                        text: 'Yes',
                        question: q
                    });
                    self.store.createRecord('option', {
                        text: 'Maybe',
                        question: q
                    });
                    self.store.createRecord('option', {
                        text: 'No',
                        question: q
                    });
                } else if (type === 4) {
                    self.store.createRecord('option', {
                        text: '',
                        question: q
                    });
                    self.store.createRecord('option', {
                        text: '',
                        question: q
                    });
                }
            });
        },
        setUploadImage: function(file) {
            var self = this;
            if (this.get('uploadImage')) {
                this.get('uploadImage').rollbackAttributes();
            }

            var uploadImage = self.store.createRecord('image', {
                title: toAscii(file.get('name')),
                path: toAscii(file.get('name')),
                type: 0,
                status: 2
            });

            this.set('uploadImage', uploadImage);
            this.send('selectImage', uploadImage); // select image 

            if (this.get('uploadFile')) {
                this.get('uploadFile').destroy();
            }
            this.set('uploadFile', file);

            file.read().then(function(url) {
                self.set('uploadFileUrl', url);
            });
        },
        changeImage: function() {
            this.set('changeImage', true);
        },
        placeChanged: function(place) {
            console.log(place);
        },
        setupMore: function() {
            var advsetup = $('.advancedSetup');
            var showed = advsetup.attr('data-showed');
            if(showed==='false'){
                this.slideDown('.advancedSetup');            	
                $(document).ready(function() {
                    $('.tooltipped').tooltip({
                        delay: 50
                    });
                });
            	advsetup.attr('data-showed', true);
            }else{
                this.slideUp('.advancedSetup');            	
            	advsetup.attr('data-showed', true);                
            }
            return false;
        },
        readyMore: function() {
            Ember.$('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 1
            });
        },
        selectUrl: function() {
            let privateURL = Ember.$('#privateURL');
            privateURL.select();
        }

    }
});