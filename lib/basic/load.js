var latte_lib = require("latte_lib");
var Path = require("path");
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
			var thanBeforeIndex = data.lastIndexOf("\n",startIndex);
			var nextTab = data.substring(thanBeforeIndex, startIndex);
			var fileData = loadFile(Path.resolve(fileName,"..", name), nextTab);
			data = data.replace( new RegExp("import<"+name+">", "i"), fileData);
			index = endIndex;
		} 
		return tab != ""? data.replace(/\n/g, "\n"+tab) : data;	
	}
	module.exports = loadFile;