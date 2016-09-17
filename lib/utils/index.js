(function() {
	var Utils = this;
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
	this.getJSON  = function(line, a ,b, attrs) {
			var start = line.indexOf(a);
			if(start == -1) {
				return line;
			}
			var end = line.indexOf(b);
				if(end == -1) {
					throw new Error("format [ error");
				}
			var data1 = line.substring(start + 1, end);
			line = line.substring(end).trim();
						var index = 0;
			while(index < data1.length) {
				//支持' ' 或 " "
				var startIndex = Utils.getNear(data1, '"', "'", index);
				if(startIndex > data1.length) {
					break;
				}
				var oneChar = data1[startIndex];
				var endIndex = Utils.getNear(data1, oneChar+"\t", oneChar + " ",startIndex+1);
				if(endIndex > data1.length) {
					throw new Error("format Error");
				}
				var pro = data1.substring(index, endIndex+1);
				var splitIndex = pro.indexOf(":");

				var k = pro.substring(0, splitIndex).trim();
				var v = pro.substring(splitIndex+1).trim();
				//if(kvs.length == 2) {
					//kvs[1] = kvs[1].trim();
					attrs[k] = v.substring(1, v.length-1);
				//}
				index =endIndex+1;
			}
			
			return line;
		}
}).call(module.exports);