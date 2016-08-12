(function() {
	var Utils = require("../utils");
	var latte_lib = require("latte_lib");
	this.object2Html = function(obj) {
		var data = {};
		var html = require("./dom.js").object2Html(obj, data);
		return {
			html: Utils.format(html),
			data: latte_lib.format.jsonFormat(data)
		};
	};
}).call(module.exports);