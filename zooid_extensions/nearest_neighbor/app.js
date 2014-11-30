var fs = require('fs');
var path = require('path');
var async = require("async");
var _ = require('underscore');
var moment = require("moment")
var merge = require("merge")
var histogram = require('histogram');

var zooid = require("../../zooid_core")
var zode = merge( require("./package.json"), { 
    name:"Nearest Neighbor"
  , filename:"app.js"
  , takes:"directory"
  , gives:"knn"
  , ip:zooid.ip || 'unkown'
  , status:"active"
  , work:0
  , actions:0 
})

console.log(zode.name, "intiated.")

/******************************************************************************
 * TEST WITH BASE CASE
 * Run a test on the cluster with the default applicaiton of processing a small
 * image for feature 
 * 
 * detection and reporting back to the overmind the events of
 * both the event-positive and event-negative systems of signal processing.
******************************************************************************/

zooid.on( "test", function (signal){
  zode.status="active"
  zooid.muster(zode)
  zooid.send({ parent_id:signal.id, name:zode.name, text:"okay"})
})
zooid.on( "muster", function(signal){
  zooid.muster(zode)
})
zooid.muster(zode)




/**
 * Tekenizes a string
 * @param  {String} string the string to be tokenized.
 * @return {Array}  sorted tokens
 */

function tokenize(string) {
  var tokens = [];
  for (var i = 0; i < string.length-1; i++) {
    tokens.push(string.substr(i,2));
  }
  return tokens.sort();
}

/**
 * Finds similarity between strings.
 * @param  {Array} a 
 * @param  {Array} b 
 * @return {Number} Euclidian Distance
 */
function intersect(a, b){
  var ai=0, bi=0;
  var result = new Array();
  while( ai < a.length && bi < b.length ){
     if      (a[ai] < b[bi] ){ ai++; }
     else if (a[ai] > b[bi] ){ bi++; }
     else /* they're equal */
     {
       result.push(a[ai]);
       ai++; bi++;
     }
  }
  return result;
}

/**
 * Maps an array and sums it up... reduce...
 * @param  {Array} items array of items to be summed.
 * @return {Number} sum
 */
function sum(items) {
  var sum = 0;
  for (var i = 0; i < items.length; i++) {
    sum += items[i];
  }
  return sum;
}

/**
 * Gets word similarity.
 * @param  {String} a 
 * @param  {String} b 
 * @return {Number}  Similarity.
 */
function wordSimilarity(a, b) {
  var left   = tokenize(a);
  var right  = tokenize(b);
  var middle = intersect(left, right);
  return (2*middle.length) / (left.length + right.length);
}

/**
 * measures ipSimilarity
 * @param  {String} a 
 * @param  {String} b 
 * @return {Number} similarity
 */
function ipSimilarity(a, b) {
  var left  = a.split('.');
  var right = b.split('.');
  var diffs = [];
  for (var i = 0; i < 4; i++) {
    var diff1 = 255-left[i];
    var diff2 = 255-right[i];
    var diff  = Math.abs(diff2-diff1);
    diffs[i] = diff;
  }
  var distance = sum(diffs)/(255*4);
  return 1 - distance;
}

/**
 * measures ageSimilarity
 * @param  {String} a 
 * @param  {String} b 
 * @return {Number} similarity
 */
function ageSimilarity(a, b) {
  var maxAge   = 100;
  var diff1    = maxAge-a;
  var diff2    = maxAge-b;
  var diff     = Math.abs(diff2-diff1);
  var distance = diff / maxAge;
  return 1-distance;
}

/**
 * measures ageSimilarity
 * @param  {String} a 
 * @param  {String} b 
 * @return {Number} similarity
 */
function recordSimilarity(a, b) {
  var fields = [
    {name:'name', measure:wordSimilarity},
    {name:'age',  measure:ageSimilarity},
    {name:'pc',   measure:wordSimilarity},
    {name:'ip',   measure:ipSimilarity}
  ];

  var sum = 0;
  for (var i = 0; i < fields.length; i++) {
    var field   = fields[i];
    var name    = field.name;
    var measure = field.measure;
    var sim     = measure(a[name], b[name]);

    sum += sim;
  }

  return sum / fields.length;
}

function findMostSimilar(items, query) {
  var maxSim = 0;
  var result = null;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var sim  = recordSimilarity(item, query);

    if (sim > maxSim) {
      maxSim = sim;
      result = item;
    }
  }
  return result
}

/**
 * Runs a rest to find smiliarity on hardcoded objects.
 * @return {Object} Mos similar to the query.
 */
function test(){
  var items = [
    { name: "Bill",   age: 10,  pc: "Mac",      ip: "68.23.13.8" },
    { name: "Alice",  age: 22,  pc: "Windows",  ip: "193.186.11.3" },
    { name: "Bob",    age: 12,  pc: "Windows",  ip: "56.89.22.1" }
  ];

  var query  = { name: "Tom", age: 10, pc: "Mac", ip: "68.23.13.10" };
  var result = findMostSimilar(items, query);

}

// console.log( test() );
