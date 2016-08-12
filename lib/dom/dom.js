		var latte_lib = require("latte_lib");
		


			var compile2Html  = function(config, data) {
				var htmlTemplate;
				config.attrs  = config.attrs || {};
				
				var htmlTemplate = latte_lib.fs.readFileSync(__dirname+"/basic.html");
				var childs = "";
				if(config.childs && config.childs.length != 0) {
					
				
					childs = config.childs.map(function(c) {
						return compile2Html(c, data);
					}).join("");

				}
				childs += config.text || "";

				var lattes = "";
				var attrs = "";
				if(config.attrs) {
					Object.keys(config.attrs).forEach(function(attr) {
						attrs += attr +"='" +config.attrs[attr]+"' "
					});
				}

				if(config.lattes) {
					Object.keys(config.lattes).forEach(function(latte) {
						lattes += "latte-"+latte +"='" +config.lattes[latte]+"' "
					});
				}
				var classs = "";
				if(config.classs && config.classs.length > 0) {
					classs = "class='" + config.classs.join(" ")+"'";
				}
				html = latte_lib.format.templateStringFormat(htmlTemplate, {
					childs: childs ,
					tag: config.tag,
					lattes:lattes,
					attrs: attrs,
					classs: classs
				});
				return html;
			}
		module.exports.object2Html = compile2Html;