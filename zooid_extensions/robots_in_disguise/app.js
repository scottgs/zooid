/**
 * Creates a color histogram from an image file.
 * @param  {Image}   fileName name of the image file.
 * @return {Histogram} histogram
 */

/**
 * Bring in dependencies.
 * @type {Object}
 */
var fs = require('fs')
, path = require('path')
, merge = require("merge")
, async = require("async") 
, _ = require('underscore')
, moment = require("moment")
, histogram = require('histogram')


/**
 * Defines this zodes identity and function within the organism.
 * @type {Zode}
 */
var zooid = require("../../zooid_core")
var zode = merge( require("./package.json"), { 
    name:"Transformers"
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
 * Responds to it's listener handler noun.
 * @param  {Signal} signal input signal
 * @return {}
 */

zooid.on( "image", function(signal){

  if(!zode.status) return 1;

  var start = moment().valueOf();
  zode.actions += 1
  
  createHistogram( signal, function(err, res){
    var stop = moment().valueOf();
    zode.work += stop - start
    zooid.muster(zode)
    zooid.send(res)
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


