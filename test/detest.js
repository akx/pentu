/**
 * A despicable tiny test framework.
 */
var Detest = (function(){
	var tests = [];
	function test(name, func) {
		tests.push({name: name, func: func});
	}
	
	function makeEnv() {
		var env = {
			nOK:		0,
			nFail:		0,
			test:		null,
			ok:			null,
			messages:	null,
			container:	document.body,
			assert:			function(t, msg) {
				if(!t) {
					env.ok = false;
					msg = msg || "Assertion failed";
					env.messages.push(msg);
				}
			},
			assertEqual:	function(a, b, msg) {
				if(a != b)  env.assert(false, (msg || "Equality assertion failed") + ": " + a + " != " + b);
			},
			begin:		function(test) {
				env.test = test;
				env.ok = true;
				env.messages = [];
			},
			fail:		function(msg) {
				env.ok = false;
				env.messages.push(msg);
			},
			finish:		function() {
				if(env.ok) {
					env.container.appendChild(Pentu("div", {"html": "<b>" + env.test.name + "</b>: OK", "css": "color:green"}));
					env.nOK ++;
				} else {
					var errC = Pentu("div", {"html": "<b>" + env.test.name + "</b>: " + env.messages.length + " problems:", "css": "color:red"});
					var errL = Pentu("ul");
					env.messages.forEach(function(err) {
						errL.appendChild(Pentu("li", {html: err}))
					});
					errC.appendChild(errL);
					env.container.appendChild(errC);
					env.nFail ++;
				}
				env.test = env.messages = env.ok = null;
			},
			finalize:	function() {
				env.container.appendChild(Pentu("<div><hr />Successes: " + env.nOK + "<br />Failures: " + env.nFail + "</div>", {"css": {color: (env.nFail ? "orange" : "green")}}));
			}
		};
		return env;
	}
	
	function run() {
		var i = 0;
		var env = makeEnv();
		var timer = setInterval(function() {
			var test = tests[i++];
			if(!test) {
				env.finalize();
				clearInterval(timer);
				return;
			}
			env.begin(test);
			try {
				test.func(env);
			} catch(e) {
				env.fail("Exception caught: " + e);
			}
			env.finish();
		}, 50);
	}
	
	return {
		run:	run,
		test:	test
	};
});