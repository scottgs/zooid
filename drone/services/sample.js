//gets a random sampling from a section of the list
/*
{
	list : [];
	percent : (0...1)
	start : (0...1)
	stop : (start...1)
}

*/
var _ = require('underscore');
module.exports = {
	run: function(req, fn){
		var length = req.list.length;
		var n = Math.floor(length*req.percent);
		var start = Math.floor(req.start*length);
		var stop = Math.floor(req.stop*length);
		var list = [];
		var ret = [];
		for(var i = start; i <= stop; ++i){
			list.push(req.list[i]);
		}
		list = _.shuffle(list);
		for(i = 0; i <= n; ++i){
			ret[i] = list[i];
		}
		fn(ret[i]);
	}
};
