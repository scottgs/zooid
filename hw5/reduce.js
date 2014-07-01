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
	});
	return reduced_indices;
}

module.exports.index = index_reduce;