var latte_lib = require('latte_lib');
(function() {
	var Latte = function() {
	this.all = '';
	this.tab = -1;
	this._text = '';
	this._attribute = {};
	this._latte = {};
	this._style = {};
	this.tag = '';
	this.children = [];
	this._glass = [];
};
latte_lib.extends(Latte, latte_lib.events);
(function() {
	this.latte = function(key, value) {
		if(key == null) {
			return this._latte;
		}
		if(value != null) {
			this._latte[key] = value;
		}else{
			if(latte_lib.isObject(key)) {
				for(var i in key) {
					this._latte[i] = key[i]; 
				}
				
			}else{
				return this._latte[key];
			}
			
		}
	}
	this.text = function(value) {
		if(value != null) {
			this._text = value;
		}else{
			return this._text;
		}
	}
	this.attr = function(key, value) {
		if(key == null) {
			return this._attribute;
		}
		if(value != null) {
			this._attribute[key] = value;
		}else{
			if(latte_lib.isObject(key)) {
				for(var i in key) {
					this._attribute[i] = key[i]; 
				}
				
			}else{
				return this._attribute[key];
			}
			
		}
	}
	this.style = function(key, value) {
		if(key == null) {
			return this._style;
		}
		if(value != null) {
			this._style[key] = value;
		}else{
			if(latte_lib.isObject(key)) {
				for(var i in key) {
					this._style[i] = key[i]; 
				}
				
			}else{
				return this._style[key];
			}
		}
	}
	this.classed = function(key, value) {
		if(key == null) {
			return this._glass;
		}
		if(latte_lib.isArray(key)) {
			var self = this;
			return key.forEach(function(c) {
				self.classed(c, 1);
			})
		}
		var index = this._glass.indexOf(key);
		if(value == null) {
			return index == -1;
		}else if(value) {
			this._glass.push(key);
		}else{
			this._glass.splice(index, 1);
		}
	}
	this.appendChild = function(latte) {
		this.children.push(latte);
		latte.parent = this;
		this.emit('appendChild', latte);
	}
	this.removeChild = function(latte) {
		var index = this.children.indexOf(latte);
		if(index == -1) {
			return;
		}
		this.children.splice(index, 1);
		this.emit('removeChild', latte);
		latte.parent = undefined;
	}
	this.changeParent = function(nowParent) {
		this.parent.removeChild(this);
		nowParent.appendChild(this);
	}
	this.removeAllChild = function() {
		this.children.forEach(function(o) {
			o.parent = null;
			this.emit('removeChild', o);
		});
	}
	this.clone = function() {
		var clone = new Latte();
		clone.all = this.all;
		clone.tab = this.tab;
		clone._text = this._text;
		clone._attribute = latte_lib.copy(this._attribute);
		clone._latte = latte_lib.copy(this._latte);
		clone._style = latte_lib.copy(this._style);;
		clone.tag = this.tag;
		clone._glass = latte_lib.copy(this._glass);
		clone.children = this.children.map(function(c) {
			return c.clone();
		});
		return clone;
	}
}).call(Latte.prototype);
	var attrchar = {
		"}": "_attribute",
		")": "_latte",
		">": "_style"
	};
	var attribute = {
		"_attribute": ["{","}"],
		"_latte": ["(",")"],
		"_style": ["<",">"]
	};
	var getLast = function(line, attrs) {
		return attrs[line[line.length -1]];
	}
	var findEndIndex = function(line, strs) {
		var reg = new RegExp("["+strs.join("|")+"]", "ig");
		var result = line.match(reg);
		if(result.length%2 != 0 || result[result.length - 1] != strs[1]) {
			console.error(line, strs);
			return -1;
		}
		var d = 1;
		var index = line.length - 1;
		var r ;
		for(var i = result.length - 2; 0<= i ;i--) {
			index = line.lastIndexOf(result[i], index-1);
			if(result[i] == strs[1]) {
				d++;
			}else{
				d--;
			}
			if(d == 0) {
				r = i;
				break;
			}
		}
		if( r == null) {
			console.error(line, strs);
			return -1;
		}
		return index;
		
	}
	var line2object = function(line, components) {
		var result = new Latte();
		result.all = line;
		var tab = 0;
		for(var i = 0, len = line.length; i < len;i++) {
			if(line[i] == ' ') {
				tab++;
			}else if(line[i] == '\t') {
				tab += 4;
			}else{
				break;
			}
		}
		result.tab = tab;
		var line = line.trim();
		if(line[line.length - 1] == '"') {
			var endIndex = line.lastIndexOf('"', line.length - 2);
			result._text = line.substring(endIndex+1, line.length -1);
			line = line.substring(0, endIndex).trim();
		}
		var type;
		while(type = getLast(line, attrchar)) {
			var endIndex = findEndIndex(line, attribute[type]);
			//var endIndex = line.lastIndexOf(attribute[type][0]);
			if(endIndex == -1) {
				break;
			}
			var o = line.substring(endIndex + 1, line.length - 1);
			//console.log(type, o, line);
			var kvs = o.split(',');
			var obj = {};
			kvs.forEach(function(kv) {
				var array = kv.split(':');
				if(array.length < 2) {
					return;
				} 
				var k = array.shift().trim();
				var c = array.join(':').trim();
				
				if(c[0] == '"' || c[0] == "'") {
					obj[k] = c.substring(1, c.length - 1);
				}else{
					if(!isNaN(c - 0)) {
						obj[k] = c - 0;
 					} else {
 						obj[k] = c;
  					}
				}
			});
			result[type] = obj;
			line = line.substring(0, endIndex).trim();
		}
		var classsArray  = line.split('.');
		if(classsArray.length > 1) {
			result._glass = classsArray.slice(1);
			line = classsArray[0];
		}
		var idArray = line.split('#');
		if(idArray.length > 1) {
			result.id = idArray[idArray.length - 1];
			line = idArray[0];
		}
		var tag = result.tag = line.trim();
		result.children = [];
		var component = components[result.tag];
		if(component) {
			
			
			//if(!result.latte('lazy')) {
				var cloneC = component.latte.clone();
				/*result._glass.forEach(function(c) {
					if(cloneC._glass.indexOf(c) != -1) {
						return;
					}
					cloneC._glass.push(c);
				});
				result._glass = [];
				cloneC.style(result.style());
				result._style = {};
				cloneC.latte(result.latte());
				result._latte = {};*/
				result.latte('tag', tag) ;
				result.tag = 'latte';
				//cloneC.tab = result.tab;
				//cloneC.id = result.id;
				//cloneC.latte('tag', result.tag);
				/*result.childrens.forEach(function(c) {
					cloneC.childrens.push(c);
				});*/
				result.children.push(cloneC);
			//}
			//return cloneC;
		}
		if(result.latte('lazy')) {
			result.latte('tag', tag) ;
			result.tag = 'latte';
		}
		return result;

	}
		var isBlank = function(str) {
			return str.replace(/\s/g, "") == "";
		}
		var findParent = function(last, tab) {
			var old = last;
			if(last.tab < tab) {
				return last;
			}
			while(last.tab > tab) {
				last = last.parent;
				if(!last) {
					//debugger;
					//return console.error('not findParent',old, tab);
					return null;
				}
			}
			if(last.tab < tab) {
				return last;
			}else if(last.tab == tab){
				return last.parent;
			}
			return null;
		}
	this.toObject = function(data, components) {
		components = components || {};
		var root, last;
		var reg = /(\/\*(.|\s)*?\*\/)/g;
		data = data.replace(reg, ""); 
		var lines = data.split('\n');
		lines.forEach(function(line) {
			if(isBlank(line)) {
				return;
			}
			var l2o = line2object(line, components);
			if(!root) {
				root = l2o;
				last = root;
				return;
			}
			var parent = findParent(last, l2o.tab) || root;
			l2o.parent = parent;
			parent.children.push(l2o);
			last = l2o;
		});
		//console.log(root);
		return root;

	}
}).call(module.exports);