/*jslint undef: true, newcap: true, nomen: true, plusplus: true, bitwise: true, browser: true, forin: true */

/**
 * Pentu - teeny weeny little JS library
 * License: MIT (http://opensource.org/licenses/mit-license.php)
 */

window["Pentu"] = (function(){
	/** @const */
	var slice = [].slice, // Stashed copy of the array slice function.
		fragmentRE = /^\s*<.+>/, // Looks like HTML.
		tableElemRe = /<t(r|d|h|body)/i, // Required to identify table-looking nodes...
		idRE = /^#(.+)/, // Identifiers
		selRE = /^[.$](.+)/, // CSS selectors
		Sizzle = window["Sizzle"]; // Sizzle, if we have it
	
	function trim(s) {
		return s.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	function htmlToFragment(html) {
		var tab = tableElemRe.test(html), container = document.createElement(tab ? "table" : "div"), tc;
		container.innerHTML = trim("" + html);
		if(tab && (tc = container.childNodes[0]) && tc.tagName === "TBODY" && !(/^<tbody/i).test(html)) { // hack to remove implied tbodies.
			container = tc;
		}
		return slice.call(container.childNodes);
	}

	function findElements(el, ctx, allowNew) {
		var match, res;
		ctx = ctx || document;
		if(el.nodeType) { // DOM element
			return el;
		}
		if((match = idRE.exec(el))) { // ID selector ("#foo")
			return ctx.getElementById(match[1]);
		}
		if(selRE.test(el)) { // class selector (".foo") or CSS selector ("$foo>bar>quux")
			el = el.replace(/^\$/,'');
			try {
				return slice.call(res = ctx.querySelectorAll(el));
			}
			catch(e) {
				// We _may_ break our promise of real Arrays if we're running on IE (which doesn't like to [].slice whatever querySelectorAll on it returns).
				// However, we'll first try to use Sizzle, if it's around, before really giving up.
				return Sizzle ? Sizzle(el, ctx) : res;
			}
		}
		if(allowNew) {
			if(fragmentRE.test(el)) { // HTML fragment ("<div>derp</div>")
				return htmlToFragment(el);
			} else {
				return document.createElement(el); // Element name ("div")
			}
		}
		return null;
	}
	
	var setters = {
		"html":		function(el, val) {
			el.innerHTML = (val.nodeType ? val.innerHTML : val);
		},
		"text":		function(el, val) {
			var c;
			while ((c = el.firstChild)) {
				el.removeChild(c);
			}
			el.appendChild((el.ownerDocument || document).createTextNode(val.nodeType ? val.innerText : val));
		},
		"css":		function(el, val) {
			var key, text = "";
			if(val.substring) { // Quacks like a string
				text = ";" + val;
			} else {
				for(key in val) {
					text += ";" + key + ":" + val[key];
				}
			}
			el.style.cssText += text;
		},
		"events":	function(el, val) {
			var key;
			if(!el.addEventListener) return;
			for(key in val) {
				el.addEventListener(key, val[key], false);
			}
		}
	};

	function applyAttribs(el, attribs) {
		var val, setter, name;
		for(name in attribs) {
			val = attribs[name];
			if((setter = setters[name])) {
				setter(el, val, name);
				continue;
			} else {
				if(el.hasOwnProperty(name)) {
					el[name] = val;
				} else {
					if(val === false || val === null) el.removeAttribute(name);
					else el.setAttribute(name, val);
				}
			}
		}
	}
	
	function swissKnife(el, attribs, multi) {
		el = findElements(el, document, 1);
		el = ((!multi && el[0]) ? el[0] : el);
		if(attribs) {
			if(el.length) {
				var i = el.length;
				if(i>0) while(i) applyAttribs(el[--i], attribs);
			}
			else {
				applyAttribs(el, attribs);
			}
		}
		return el;
	}
	
	swissKnife["find"] = findElements;
	swissKnife["parse"] = htmlToFragment;
	swissKnife["setters"] = setters;
	return swissKnife;
}());