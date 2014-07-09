var _ = require('underscore');

// We want a set of simple, agnostic primitives to distribute across the cluster.
// This is good -- and it does what you want it do, but I wrote a different reducer
// for use with the framework. -BB

// also, comment your code.

var reverse_index = require('./reverse_index.js');

function Index(){

}

Index.prototype.consume = function consume(list){

};

module.exports.Index = Index;