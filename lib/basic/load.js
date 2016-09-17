var latte_lib = require("latte_lib")
	, Utils = require("../utils");
var Path = require("path");
		var findThisLine = function(data, str) {
			var startIndex = data.indexOf(str);		
			var endIndex = data.indexOf("\n", startIndex);
			var sub;
			if(endIndex == -1)  {
				sub = data.substring(startIndex);
			}else{
				sub = data.substring(startIndex, endIndex);
			}
			return sub;
		}
	var loadFile = function(fileName, tab) {
		tab = tab || "";
		var data = latte_lib.fs.readFileSync(fileName);
		var index = 0;
		while(index != -1) {
			var startIndex = data.indexOf("import<", index);
			if(startIndex == -1) {
				break;
			}
			var endIndex = data.indexOf(">",startIndex + 7);
			if(endIndex == -1) {
				break;
			}
			var name = data.substring(startIndex + 7, endIndex);
			var jsonStr = data.substring(endIndex);
			var json = {};
			Utils.getJSON(jsonStr, "{", "}", json);
		
			var thanBeforeIndex = data.lastIndexOf("\n",startIndex);
			var nextTab = data.substring(thanBeforeIndex, startIndex);
			var fileData = loadFile(Path.resolve(fileName,"..", name), nextTab);
			if(Object.keys(json).length >0) {
				fileData = latte_lib.format.templateStringFormat(fileData, json);
			}
			var lineData = findThisLine(data, "import<"+name+">");
			data = data.replace( new RegExp(lineData, "i"), fileData);
			index = endIndex;
		} 
		return tab != ""? data.replace(/\n/g, "\n"+tab) : data;	
	}
	module.exports = loadFile;