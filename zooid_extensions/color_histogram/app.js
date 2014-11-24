/**
 * Creates a color histogram from an image file.
 * @param  {Image}   fileName name of the image file.
 * @return {Histogram} histogram
 */

/**
 * Bring in dependencies.
 * @type {Object}
 */

var dependencies;
var fs    = require('fs')
, path    = require('path')
, merge   = require("merge")
, async   = require("async") 
, moment  = require("moment")
, _       = require('underscore')
, histogram = require('histogram')


/**
 * Defines this zodes identity and function within the organism.
 * @type {Zode}
 */

var zooid = require("../../zooid_core")
var zode = merge( require("./package.json"), { 
    name:"Color Histogram"
  , filename:"app.js"
  , takes:"image"
  , gives:"color_histogram"
  , ip:zooid.ip || 'unkown'
  , status:"active"
  , work:0
  , actions:0 
})
console.log(zode.name, "intiated.")

/**
 * Creates a color histogram from an image file.
 * @param  {String}   fileName name of the image file.
 * @param  {Function} next     callback function
 * @return {}
 */

function createHistogram(fileName, next){
  histogram(fileName , function(err, data) {
    data['r']=[]; data['g']=[]; data['b']=[]; data['a'] = [];
    for (var i = 0; i < data.red.length; i++) {
      data.r[i]=data.red[i];
      data.g[i]=data.green[i];
      data.b[i]=data.blue[i];
      data.a[i]=data.alpha[i];
    };
    next(err,data)
  });
}

function downsize(data, bit, next){
    var hist = {}
    hist['r']=[]; hist['g']=[]; hist['b']=[]; hist['a'] = [];
    var l = data.r.length
    var eb = Math.floor( l / (bit||1) )
    for (var i = 0; i < l; i++) {
      var ii = Math.floor( i / eb )
      if(typeof hist.r[ii] == 'undefined'){
        hist.r[ii] = 0 
        hist.g[ii] = 0
        hist.b[ii] = 0 
        hist.a[ii] = 0
      }
      hist.r[ii]+=data.r[i]
      hist.g[ii]+=data.g[i]
      hist.b[ii]+=data.b[i]
      hist.a[ii]+=data.a[i]
    };
    next(null,hist)
}

function normalize(data, next){
  var hist = {}
  hist['r']=[]; hist['g']=[]; hist['b']=[]; hist['a'] = [];
  var l = data.r.length
  for (var i = 0; i < l; i++) {
    var ii = i
    if(typeof hist.r[ii] == 'undefined'){
      hist.r[ii] = 0; hist.g[ii] = 0; 
      hist.b[ii] = 0; hist.a[ii] = 0;
    }
    hist.r[ii]+=data.r[i]/l
    hist.g[ii]+=data.g[i]/l
    hist.b[ii]+=data.b[i]/l
    hist.a[ii]+=data.a[i]/l
  };
  next(null,hist)
}

function integrate(data, next){
    var hist = {}
    hist['r']=[]; hist['g']=[]; hist['b']=[]; hist['a'] = [];
    var l =  data.r.length
    var eb = Math.floor(l / 8)
    for (var i = 0; i < l; i++) {
      var ii = (i<1?0:i-1)
      if(typeof hist.r[i] == 'undefined'){
        hist.r[i] = 0 
        hist.g[i] = 0
        hist.b[i] = 0 
        hist.a[i] = 0
      }
      hist.r[i]+=hist.r[ii]+data.r[i]
      hist.g[i]+=hist.g[ii]+data.g[i]
      hist.b[i]+=hist.b[ii]+data.b[i]
      hist.a[i]+=hist.a[ii]+data.a[i]
    };
    next(null,hist)
}

/**
 * Responds to it's listener handler noun.
 * @param  {Signal} signal input signal
 * @return {}
 */

zooid.on( "image", function(signal){
  var fullpath = path.join(signal.location, signal.filename)
  createHistogram( fullpath , function(err, histogram_data){
    downsize( histogram_data, 32, function(err, histogram_32 ){
      zooid.send({ title:"32-bit", noun:"histogram",parent_id:signal.id, histogram:histogram_32, chart_type:"areaspline", stack:"normal"})
    });
  })
})


zooid.on( "histogram", function(signal){
  downsize( signal.histogram, 8, function(err, histogram_8 ){
      zooid.send({title:"8-bit", parent_id:signal.parent_id, noun:"histogram:8bit", histogram:histogram_8, chart_type:"column" })
  });
})


zooid.on( "histogram:8bit", function(signal){
   normalize( signal.histogram, function(err, normalized_histogram_8 ){
        zooid.send({title:"Normal", parent_id:signal.id, noun:"histogram:normal", histogram:normalized_histogram_8, chart_type:"column", stack:"normal"})
  });
})

zooid.on( "histogram:8bit", function(signal){
  integrate( signal.histogram, function(err, integrated_histogram ){
    zooid.send({title:"Integrated", parent_id:signal.id, histogram:integrated_histogram, chart_type:"column", stack:"normal"})
  });
})

/**
 * Defines the test case.
 * @param  {Signal} signal the test signal
 * @return {}
 */

zooid.on( "test", function (signal){
  zode.status="active"
  zooid.muster(zode)
  zooid.send({ parent_id:signal.id, name:zode.name, text:"okay"})
})

/**
 * Responds to muster requests.
 * @param  {Signal} signal 
 * @return {}
 */

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})

zooid.muster(zode)


