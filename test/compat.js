/**
A handful of compatibility hacks for Firefox.
These aren't strictly needed by Pentu, just the tests.
*/
(function(){
	var probe = document.createElement("div");
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
}());