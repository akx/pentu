/**
A handful of compatibility hacks for less obliging browsers.
These aren't strictly needed by Pentu, just the tests.
*/
(function(){
	var probe = document.createElement("div");
	if(window.HTMLElement) {
		if(!probe.outerHTML) { // Hack to make sure Firefox also knows about outerHTML.
			HTMLElement.prototype.__defineGetter__("outerHTML", function() {
				var origParent = this.parentNode;
				var ctr = document.createElement(origParent ? origParent.tagName : "div");
				ctr.appendChild(this);
				var h = ctr.innerHTML;
				if(origParent) origParent.appendChild(ctr); // YES, I know this will put it in the wrong place, but it doesn't matter here.
				return h;
			});
		}
		if(!probe.innerText) {
			// Snatched from Sizzle.js.
			var SizzleGetText = function( elems ) {
				var ret = "", elem;
				for ( var i = 0; elems[i]; i++ ) {
					elem = elems[i];
					if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
						ret += elem.nodeValue;
					} else if ( elem.nodeType !== 8 ) {
						ret += SizzleGetText( elem.childNodes );
					}
				}
				return ret;
			};
			
			HTMLElement.prototype.__defineGetter__("innerText", function() {
				return SizzleGetText([this]);
			});
		}
	}
}());

/**
 * ECMA-262 5th Edition Array.forEach algorithm, for browsers lacking it.
 * This is used by Pentu in some circumstances.
 * Snatched from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
 */
(function(){
	if (!Array.prototype.forEach)
	{
		Array.prototype.forEach = function(fun /*, thisp */)
		{
			"use strict";
	
			if (this === void 0 || this === null)
				throw new TypeError();
	
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();
	
			var thisp = arguments[1];
			for (var i = 0; i < len; i++)
			{
				if (i in t)
					fun.call(thisp, t[i], i, t);
			}
		};
	}	
}());