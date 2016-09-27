/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license

 */

(function () {

var _ = function (input, o) {
	var me = this;

	// Setup

	this.input = $(input);
	//this.input.setAttribute("autocomplete", "off");
	//this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure(this, {
		minChars: 2,
		maxItems: 10,
		autoFirst: false,
		filter: _.FILTER_CONTAINS,
		sort: _.SORT_BYLENGTH,
		item: _.ITEM,
		replace: _.REPLACE,
		rawValue: true,
		valueCallback: null
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "hidden",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter
					evt.preventDefault();
					me.select();
				}else if(c === 13){
					$.fire(me.input, "awesomplete-enter");
				}else if (c === 27) { // Esc
					me.close();
				}else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}else if (c === 13) { // Enter
				$.fire(me.input, "awesomplete-enter");
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this)});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li && evt.button === 0) {  // Only select on left click
				evt.preventDefault();
				me.select(li, evt.target);
			}
		}
	}});

	if (this.input.hasAttribute("list")) {
		this.list = "#" + this.input.getAttribute("list");
		this.input.removeAttribute("list");
	}
	else {
		this.list = this.input.getAttribute("data-list") || o.list || [];
	}

	_.all.push(this);
};

_.prototype = {
	set list(list) {
		if (Array.isArray(list)) {
			this._list = list;
		}
		else if (typeof list === "string" && list.indexOf(",") > -1) {
				this._list = list.split(/\s*,\s*/);
		}
		else { // Element or CSS selector
			list = $(list);

			if (list && list.children) {
				this._list = slice.apply(list.children).map(function (el) {
					return el.textContent.trim();
				});
			}
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},

	get selected() {
		return this.index > -1;
	},

	get opened() {
		return !this.ul.hasAttribute("hidden");
	},

	close: function () {
		this.ul.setAttribute("hidden", "");
		this.index = -1;

		$.fire(this.input, "awesomplete-close");
	},

	open: function () {
		this.ul.removeAttribute("hidden");

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;

		this.goto(this.index < count - 1? this.index + 1 : -1);
	},

	previous: function () {
		var count = this.ul.children.length;

		this.goto(this.selected? this.index - 1 : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;
		}

		$.fire(this.input, "awesomplete-highlight");
	},
	getSelectionString: function (el, win) {
	    win = win || window;
	    var doc = win.document, sel, range, prevRange, selString;
	    if (win.getSelection && doc.createRange) {
	        sel = win.getSelection();
	        if (sel.rangeCount) {
	          prevRange = sel.getRangeAt(0);
	        }
	        range = doc.createRange();
	        range.selectNodeContents(el);
	        sel.removeAllRanges();
	        sel.addRange(range);
	        selString = sel.toString();
	        sel.removeAllRanges();
	        prevRange && sel.addRange(prevRange);
	    } 
	    else if (doc.body.createTextRange) {
	        range = doc.body.createTextRange();
	        range.moveToElementText(el);
	        range.select();
	    }
	    return selString;
	},
	getCaretPosition: function(input) {
		try {
			if(input && input.selectionStart){
				return input.selectionStart; 
			}
			if (window.getSelection) {
				selectedRange = window.getSelection();
			} else {
				selectedRange = document.getSelection();
			}
			if(selectedRange.baseOffset){
				return selectedRange.baseOffset+selectedRange.extentOffset;
			}else{
				return selectedRange.focusOffset;
			}
		} catch (err) {}
	},
	select: function (selected, origin) {
		
		selected = selected || this.ul.children[this.index];
		
		if (selected) {
			var allowed = $.fire(this.input, "awesomplete-select", {
				text: selected.textContent,
				index: this.index,
				data: this.suggestions[$.siblingIndex(selected)],
				origin: origin || selected
			});

			if (allowed) {
				var p=this.valueTagPosition();
				var result=this.getTextContent();
				if(!this.rawValue){
					result=result.substring(0,p[0])+selected.textContent+result.substring(p[1]);
				}else{
					result=selected.textContent;
				}
				this.replace(result);
				this.close();
				$.fire(this.input, "awesomplete-selectcomplete");
			}
		}
	},
	getTextContent:function(){
			//var rawText=this.getSelectionString(this.input);
		return  this.input.value;
	},
	valueTagPosition:function(){
		var value = '';
		var rawText= this.getTextContent();
		var caretPoz= this.getCaretPosition(this.input);
		var ss=rawText.substring(0,caretPoz);
		var lp=ss.lastIndexOf("#");
		if(lp>-1){
			return [lp,caretPoz];
		}
		return;
	},
	valueTag: function() {
		if(this.rawValue){
			return this.getTextContent();
		}
		var p=this.valueTagPosition();
		if(p){
			var tag=this.getTextContent().substring(p[0],p[1]);
			if(tag.indexOf(" ")==-1){
				return tag;
			}
		}
		return '';
	},
	evaluate: function() {
		var value = this.valueTag();
		if(this.valueCallback){
			this.valueCallback(value);
		}else{
			this.evaluateResult(value);
		}
	},
	evaluateResult:function(value){
		var me = this;		
		if (value.length >= this.minChars && this._list.length > 0) {
			this.index = -1;
			// Populate list with options that match
			this.ul.innerHTML = "";

			this.suggestions = this._list
				.filter(function(item) {
					if(item instanceof Object){
						return me.filter(item.title, value);
					}else{
						return me.filter(item, value);
					}
				});
			if(this.sort){
				this.suggestions=this.suggestions.sort(this.sort);
			}
			this.suggestions=this.suggestions.slice(0, this.maxItems);

			this.suggestions.forEach(function(item) {
					me.ul.appendChild(me.item(item, value));
				});

			if (this.ul.children.length === 0) {
				this.close();
			} else {
				this.open();
			}
		}else {
				this.close();
		}
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

_.ITEM = function (text, input) {
	var html = input === '' ? text : text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
	return $.create("li", {
		innerHTML: html,
		"aria-selected": "false"
	});
};

_.REPLACE = function (text) {
	this.input.value = text;
};

// Private functions

function configure(instance, properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			instance[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			instance[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			instance[i] = null;
		}
		else {
			instance[i] = attrValue;
		}

		if (!instance[i] && instance[i] !== 0) {
			instance[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

$.siblingIndex = function (el) {
	/* eslint-disable no-cond-assign */
	for (var i = 0; el = el.previousElementSibling; i++);
	return i;
};

// Initialization
/*
function init() {
	$$("textarea.awesomplete").forEach(function (input) {
		new _(input);
	});
}
*/
// Are we in a browser? Check for Document constructor
/*
if (typeof Document !== "undefined") {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}
*/

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== "undefined") {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof module === "object" && module.exports) {
	module.exports = _;
}

return _;

}());
