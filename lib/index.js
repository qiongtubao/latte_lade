(function(){
	var basicModule = require("./basic/index.js");
	this.load = require("./basic/load.js");
	this.toObject = basicModule.toObject;
	var domModule = require("./dom/index.js");
	this.parse = domModule.object2Html;
	var self = this;
	this.toHtml = function(file) {
		var data = self.load(file);
		var o = self.toObject(data);
		return self.parse(o).html;
	};
	this.toLade = function(html){
		var o = domModule.toObject();
		return basic.stringify(o);
	}
}).call(module.exports);