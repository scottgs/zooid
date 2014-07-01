var fs = require('fs');
var _ = require('underscore');
var path = require('path');

function reverse_index(file_path){
	var file = fs.readFileSync('../bibble/'+file_path, 'utf8')
		
		var result = {}, l=0, lines = file.split("\n");

		lines.forEach(function(line) {

			l++;
			var offset = 0;
			var words = line.split(" ");
			words.forEach(function(word) {

				var word_offset = word.length + 1;
				word = word.replace(/[\W\d]+/g,"").toLowerCase();

				if(word === '') offset += word_offset;

				if(!(word in result)) result[word] = new index(file_path);

				result[word].index.push([Number(l) + 1, offset + 1]);
				offset += word_offset;
			})
		})
		for(var key in result){
			result[key].word = key;
		}
		result = _.sortBy(result, function(word){
			return -word.count;
		});
		return result;
}

var index = function index(file_path){
		this.file_path = file_path;
		this.index = [];
};

index.prototype.toString = function(){
	var str = this.file_path+": [";
	var idx = this.index;
	for(var i in idx){
		str += "["+idx[i].toString()+"]";
	}
	return str + "]\n";
};

//constructor
var reducedIndex = function reducedIndex(word){
	this.word = word;
	this.indices = [];
};

reducedIndex.prototype.consume = function(i){
	switch (i.constructor.name){
		case "reducedIndex":
			this.indices = this.indices.concat(i.indices);
			break;
		case "index":
			this.indices = this.indices.concat(i);
			break;
	}
};

reducedIndex.prototype.toString = function(){
	var str = '"'+this.word+'":\n';
	var idx = this.indices;
	for(var i in idx){
		str += idx[i].toString();
	}
	return str + "\n";
};

module.exports.reducedIndex = reducedIndex;
module.exports.index = index;
module.exports.reverse_index = reverse_index;