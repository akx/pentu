/*jslint undef: true, newcap: true, nomen: true, plusplus: true, bitwise: true, browser: true, forin: true */

/**
 * Pentu - teeny weeny little JS library
 * License: MIT (http://opensource.org/licenses/mit-license.php)
 */

window["Pentu"] = (function(){
	var fragmentRE = /^\s*<.+>/, slice = [].slice, tableElemRe = /<(tr|td|th|tbody)/i, idRE = /^#/, classRE = /^\./, selRE = /^\$/;
	function trim(s) {
		return s.replace(/^\s+/, "").replace(/\s+$/, "")
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
		ctx = ctx || document;
		if(el.nodeType) { // DOM element
			return el;
		}
		if(idRE.test(el)) { // ID selector ("#foo")
			return ctx.getElementById(el.substring(1));
		}
		if(classRE.test(el)) { // class selector (".foo")
			return slice.call(ctx.getElementsByClassName(el.substring(1)));
		}
		if(selRE.test(el)) { // CSS selector ("$foo>bar>quux")
			return slice.call(ctx.querySelectorAll(el.substring(1)));
		}
		if(allowNew) {
			if(fragmentRE.test(el)) { // HTML fragment ("<div>derp</div>")
				return htmlToFragment(el);
			}
			return document.createElement(el); // Element name ("div")
		}
		return null;
	}

	function applyAttribs(el, attribs) {
		var name, val, key, text;
		
		for(name in attribs) {
			val = attribs[name];
			if(name === "html") {
				el.innerHTML = (val.nodeType ? val.innerHTML : val);
			} else if(name === "text") {
				while ( el.firstChild ) {
					el.removeChild( el.firstChild );
				}
				el.appendChild((el.ownerDocument || document).createTextNode(val.nodeType ? val.innerText : val));
			} else if(name === "css") {
				text = "";
				if(val.substring) { // Quacks like a string
					text = ";" + val;
				} else {
					for(key in val) {
						text += ";" + key + ":" + val[key];
					}
				}
				el.style.cssText += text;
			} else if(name == "events") {
				for(key in val) {
					if(el.addEventListener) {
						el.addEventListener(key, val[key], false);
					}
				}
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
		el = findElements(el, document, true);
		el = ((!multi && el[0]) ? el[0] : el);
		if(attribs) {
			if(el.forEach) {
				el.forEach(function(el){
					applyAttribs(el, attribs);
				});
			}
			else {
				applyAttribs(el, attribs);
			}
		}
		return el;
	}
	
	swissKnife["find"] = findElements;
	swissKnife["parse"] = htmlToFragment;
	return swissKnife;
}());