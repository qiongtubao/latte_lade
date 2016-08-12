(function() {
	this.getNear = function(data, a , b, startIndex) {
		startIndex = startIndex || 0;
		var i1 = data.indexOf(a, startIndex);
		var i2 = data.indexOf(b, startIndex);
		var len = data.length;
		i1 = i1 == -1? len: i1;
		i2 = i2 == -1? len: i2;
		return Math.min(i1, i2);
	}
	this.isBlank = function(str) {
		return str.replace(/\s/g, "") == "";
	}
	this.format = require("./format").format;
}).call(module.exports);