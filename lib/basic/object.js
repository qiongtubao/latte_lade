
(function() {
			
		
			var getChild = function(datas, root) {
				if(datas.length == 0) {
					return [];
				}
				var tab = datas[0].tab;
				var nums = [];
				
				for(var i = 0,len = datas.length;i < len; i++ ) {
					if(datas[i].tab == tab) {
						nums.push(i);
					}else if(datas[i].tab < tab) {
						console.log(datas[i], datas[0]);
						throw new Error("latte format Error");
					}
				}
				var result = [];
				for(var i = 0, len = nums.length; i < len; i++) {
					if((i+1) ==len) {
						result.push(
							 datas.slice(nums[i] )
						)
					}else{
						result.push(datas.slice(nums[i] , nums[i+1]));
					}		
				}
				return result;
			}
			var getRoot = function(datas) {
				var root = datas[0];
				root.childs = [];
				delete root.tab;
				delete root.all;
				var array = getChild(datas.slice(1), root);
				array.forEach(function(a) {
					var child = getRoot(a);
					root.childs.push(child);
				});
				return root;
			}
			var Row = require("./row");
	this.toObject = function(data) {
		var datas = Row.toArray(data);
		var root = getRoot(datas);
		return root;
	}
}).call(module.exports);

