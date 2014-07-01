var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require("async");

var error_handler = require("error_handler")

/**
 * Creates an asynchronous task queue
 * @param {Function} [action to execute]
 * @param {Number}	[concurrency limit]
 * @return {queue}	[async queue handler]
 */
var q = async.queue( reverse_index, os.cpus().length );


/**
 * Indexes words by the frequency and marks location
 * @param  {[type]}   file_path [file to be indexed]
 * @param  {Function} next      [callback function]
 */

function reverse_index(file_path, next){
	fs.readFile(file_path, 'utf8', function(err, file){
		error_handler(err,next)

		var result = {}, l=0, lines = file.split("\n");

		lines.forEach(function(line) {

			l++
			var offset = 0
			var words = line.split(" ")
			words.forEach(function(word) {

				var word_offset = word.length + 1;
				word = word.replace(/([&,.:\s0-9-]+)/,"").toLowerCase()

				if(word === '') offset += word_offset

				// if(!(word in result)) result[word] = { count : 0, loc : [] }
				if(!(word in result)) result[word] = new index(file_path);

				// ++(result[word].count);
				result[word].index.push([Number(l) + 1, offset + 1])
				offset += word_offset
			})
		})
		for(var key in result){
			result[key].word = key;
		}
		result = _.sortBy(result, function(word){
			return -word.count;
		});
		next(null, result);
	});
}



var run = function run(req, next){

	file_paths = _.map( _.compact(req.out.pop()), function(f){ return path.join( './', f ) });

	req.save(function(){
		_.each( file_paths, function(file){
			q.push(file, function (err, result) {

	    		var out = "", j = 0; 
	    		while(j++<10) out += j+": "+result[j]+" "
    			//console.log('top 10 in', file, out )

    			for (var r = result.length - 1; r >= 0; r--) {
    				if(result[r] && req[r]){
    					req[r].index.concat(result[r].loc)
    				} else {
    					req[r] = result[r]
    				}
    			};
			});
		});

		// assign a callback
		q.drain = function() {
			console.log('all files have been processed');
			req.save( function(err, r){
				if(err)req.broadcast('err', req._id);

				next(err, req, 'index_reduce')

				req.broadcast('index_reduce', req._id);

			})
		}

	});
};

var test = function test(){
	reverse_index(process.argv[3], function(err, result){
		if(!process.argv[3]){
			console.log('Please provide a filepath');
			return
		}
		run({out :[process.argv[3]]}, function(err, result){
			for(var r in result){
				console.log(result[r].toString());
			}
		});
	});
}

module.exports.run = run;
module.exports.test = test;

if(process.argv[2] === 'test') 
	test();

//index constructor
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
