var fs = require('fs');
var _ = require('underscore');
var path = require('path');

function reverse_index(file_path, next){
	var file = fs.readFileSync('../bibble/'+file_path, 'utf8');
		
		var result = {}, l=0, lines = file.split("\n");

		lines.forEach(function(line) {

			l++;
			var offset = 0;
			var words = line.split(" ");
			words.forEach(function(word) {

				var word_offset = word.length + 1;
				word = word.replace(/[\W\d]+/g,"").toLowerCase();

				if(word === '') offset += word_offset;

				if(!(word in result)) result[word] = new index(file_path, word);

				result[word].index.push([Number(l) + 1, offset + 1]);
				offset += word_offset;
			});
		});
		result = _.sortBy(result, function(word){
			return -word.count;
		});
		return result;
}

var index = function index(file_path, word){
		this.file_path = file_path;
		this.word = word;
		this.index = [];
};

index.prototype.consume = function(i){
	
};

index.prototype.talk = function(i){
	var str = '';
	str += 'word: ' + this.word + '\n';
	str += 'book: ' + this.file_path + '\n';
	str += 'indices: ' + this.index.length + '\n';
};
var reducedIndex = function reducedIndex(){
	this.indices = [];
};

reducedIndex.prototype.consume = function(i){

};


module.exports.reducedIndex = reducedIndex;
module.exports.index = index;
module.exports.reverse_index = reverse_index;