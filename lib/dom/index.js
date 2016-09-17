(function() {
	var Utils = require("../utils");
	var latte_lib = require("latte_lib");
	var dom = require("./dom.js");
	this.object2Html = function(obj) {
		var data = {};
		var html = dom.object2Html(obj, data);
		return {
			html: Utils.format(html),
			data: latte_lib.format.jsonFormat(data)
		};
	};
	this.html2Object = function(html) {
		var data = {};

	}
}).call(module.exports);