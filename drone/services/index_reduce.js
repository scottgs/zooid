var _ = require('underscore');

// We want a set of simple, agnostic primitives to distribute across the cluster.
// This is good -- and it does what you want it do, but I wrote a different reducer
// for use with the framework. -BB

// also, comment your code.

var reverse_index = require('./reverse_index.js');

function index_reduce(indexes, next){
	reduced_indices = {};
	_.each(indexes, function(idx){
		if(!(idx.word in reduced_indices)){
			reduced_indices[idx.word] = new reverse_index.reducedIndex(idx.word);
		}
		reduced_indices[idx.word].consume(idx);
		console.log(reduced_indices[idx.word].toString());
	});
	next(null, reduced_indices);
}

var run = function run(req, next){
	var reverse_index = req.out;
	index_reduce(reverse_index, function(err, result){
		_.each(result, function(res){
			//console.log(res.toString());
		})
	});
	//req.broadcast('finished', req._id);
};

var test = function test(){
	if(!process.argv[3]){
		console.log('Please provide a directory to index and a word');
		return;
	}
	run({out :process.argv[3]}, function(err, result){
		var res = result[process.argv[4]];
		var count = 0;
		var show = {};
		for(var r in res){
			//re-arrange
			show.word = res[r].word
			show.file = res[r].file_path
			show.count = res[r].count
			show.loc = res[r].loc
			console.log(show);
			count += show.count;
		}
		console.log('\nThe word '+process.argv[4]+' appears '+count+' times.\n')
	});
};

module.exports.run = run;
module.exports.test = test;

if(process.argv[2] === 'test')
	test();


