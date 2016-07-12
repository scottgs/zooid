/**
 * Directory Consumption
 * Consumes all the things in a directory and launches them out
 * with the specified noun.
 * @param  {[type]} signal [description]
 * @return {[type]}        [description]
 */

/**
 * Brings in dependencies.
 * @type {Object}
 */

var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var zlib = require('zlib');
var async = require("async");
var _ = require('underscore');
var moment = require("moment")
var merge = require("merge")

var zooid = require("../../zooid_core")
var zode = merge( require("./package.json"), { 
    name:"Directory Consumption"
  , filename:"app.js"
  , takes:"directory"
  , gives:"images"
  , ip:zooid.ip || 'unkown'
  , status:"active"
  , work:0
  , actions:0 
})

console.log(zode.name, "intiated.")

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

/**
 * Consumes all the things in a directory and launches them out
 * with the specified noun.
 * @param  {[type]} signal [description]
 * @return {[type]}        [description]
 */
zooid.on( "consume_directory", function(signal){
  if(!zode.status) return 1;
  var start = moment().valueOf();

  zode.actions += 1

  var dirp = path.join( __dirname, signal.path ) 

  fs.readdirSync( dirp ).forEach(function(file) {
    if( !fs.lstatSync(dirp+file).isDirectory() ){
      zooid.send({ parent_id:signal.id, name:zode.name, noun:"image", filename:file, path:dirp } )
    }
  });


    var stop = moment().valueOf();
    zode.work += stop - start
    zooid.muster(zode)

})






