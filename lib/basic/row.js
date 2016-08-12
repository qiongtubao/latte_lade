			var Utils = require("../utils/index.js");
		var getNearblank = function(line) {
			return Utils.getNear(line, " ", "\t");
		}

		var  line2Object = function(line) {
			var result = {};
			result.all = line;
			var tab = 0;
			for(var i = 0, len = line.length; i < len ; i++) {
				if(line[i] == " ") {
					tab++;
				}else if(line[i] == "\t") {
					tab += 4;
				}else{
					break;
				}
			}
			result.tab = tab;
			var line = line.trim();
			if(line[line.length -1] == "\"") {
				var endIndex = line.lastIndexOf("\"",line.length-2);
				result.text = line.substring(endIndex+1, line.length - 1);
				line = line.substring(0, endIndex);
			}
			/*
			var data = line.trim().split(/\s/);
			data = data.filter(function(word) {
				if(word != "") {
					return word
				}
			});
			*/
			var index = getNearblank(line);
			
			var data0 = line.substring(0, index);
			line = line.substring(index).trim();
			
			var index = data0.indexOf("#");
			var classStartIndex = data0.indexOf(".", index);
			var tag, id, tagEndIndex;
			if(index != -1) {
				//have id
				tag = data0.substring(0, index);
				
				if(classStartIndex != -1) {
					id = data0.substring(index, classStartIndex);
				}else{
					id = data0.substring(index);
				}
			};
			if(!tag) {
				if(classStartIndex != -1) {
					tag = data0.substring(0, classStartIndex);
				}else{
					tag = data0;
				}
			}
			var classs;
			if(classStartIndex != -1) {
				classs = data0.substring(classStartIndex).split(".");
				classs.shift();
			}else{
				classs = [];
			}

			result.tag = tag;
			if(id) {
				result.id = id;
			}
	 		if(classs && classs.length > 0) {
	 			result.classs = classs;
	 		}	
				
			var attrs = {};
			var compileAttr = function(line, a ,b, attrs) {
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
			var lattes = {};
			var compileLatte = function(line) {
				var start = line.indexOf("(");
				if(start == -1) {
					return line;
				}
				var end = line.lastIndexOf(")");
	 			if(end == -1) {
	 				throw new Error("format [ error");
	 			}
				var data1 = line.substring(start + 1, end);
				data1.split(",").forEach(function(pro) {
					if(pro != "") {
						var kvs = pro.split(":");
						kvs[1] = kvs[1].trim();
						lattes[kvs[0].trim()] = kvs[1].substring(1, kvs[1].length-1);
					}
				});
				return line;
			}
	 		if(line[0] == "[") {
				line = compileAttr(line, "[", "]", attrs);
				line = compileAttr(line,  "(", ")", lattes);
	 		}else if(line[0] == "(") {
	 			line = compileAttr(line,  "(", ")", lattes);
	 			line = compileAttr(line,  "[", "]", attrs);
	 		}
	 		result.lattes = lattes;
			result.attrs = attrs;		
			return result;
		}

		/**
			@method split
			@param data {String}
			@return array {Array}
			将字符串分割成段
			1.
		*/
		var split = function(data) {
			var datas = [];
			
			data.split("\n").forEach(function(line) {
				if(!Utils.isBlank(line)) {
					var object = line2Object(line);
					datas.push(object); 
				}
			});	
			return datas;
		};
		(function() {
			this.toArray = function(data) {
				return split(data);
			}
		}).call(module.exports);