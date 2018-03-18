(function() {
	
	var attrchar = {
		"}": "attribute",
		")": "latte",
		">": "style"
	};
	var attribute = {
		"attribute": "{",
		"latte": "(",
		"style": "<"
	}
	var getLast = function(line, attrs) {
		return attrs[line[line.length -1]];
	}
	var line2Object = function(line) {
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
			line = line.substring(0, endIndex).trim();

		}
		
		var type;
		while(type = getLast(line,attrchar)) {
			var endIndex = line.lastIndexOf(attribute[type]);
			if(endIndex == -1) {
				break;
			}
			var o = line.substring(endIndex+1, line.length - 1);
			var kvs = o.split(",");
			var obj = {};
			kvs.forEach(function(kv) {
				var index = kv.indexOf(":");
				if(index == -1) {
					return;
				}
				var array = [kv.substr(0, index), kv.substr(index + 1)]
				/*var array = kv.split(":");
				if(array.length < 2) {
					return;
				}*/
				var k = array[0].trim();
				var c = array[1].trim();
				if(c[0] == "\"" || c== "'") {
					obj[k] = c.substring(1, c.length-1);
				}else{
					if(!isNaN(c - 0)) {
						obj[k] = c - 0;
					}else{
						obj[k] = c;
					}
					
				}
				
			});
			result[type] = obj;
			line = line.substring(0, endIndex).trim();
		}

		var classsArray = line.split(".");
		if(classsArray.length > 1) {
			result.glasss = classsArray.slice(1);
			line = classsArray[0];
		} 
		var idArray = line.split("#");
		if(idArray.length > 1) {
			result.id = idArray[idArray.length-1];
			line = idArray[0];
		}
		result.tag = line.trim();
		result.childrens = [];
		return result;

	}
		var isBlank = function(str) {
			return str.replace(/\s/g, "") == "";
		}
		var findParent = function(last, tab) {
			if(last.tab < tab) {
				return last;
			}
			while(last.tab != tab) {
				last = last.parent;
				if(!last) {
					//debugger;
					//return console.error('not findParent',old, tab);
					return null;
				}
			}
			if(last.tab == tab) {
				return last.parent;
			}
			return null;
		}
	this.toObject = function(str) {
		//var datas = [];
		var root ;
		var last;
		str.split("\n").forEach(function(line) {
			if(isBlank(line)) {
				return;
			}
			var object = line2Object(line);
			if(!root) {
				root = object;
				last = root;
				return;
			}
			
			var parent = findParent(last, object.tab) || root;

			object.parent = parent;
			parent.childrens.push(object);
			last = object;
			//datas.push(object);
		});
		return root;

	}
}).call(module.exports);