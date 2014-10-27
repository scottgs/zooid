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



/******************************************************************************
 * Muster response
******************************************************************************/

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})
zooid.muster(zode)

zooid.on( "deactivate", function(kill_signal){
  if(kill_signal.ip == zode.ip && kill_signal.)
  zode.status=0;
})

/******************************************************************************
 * SET UP LISTENERS
 * Adds listeners for whatever to do whatever. Yep.
******************************************************************************/

zooid.on( "consume_directory", function(signal){
  if(!zode.status) return 1;
  var start = moment().valueOf();

  zode.actions += 1

  blurFaces( signal, function(res){
    var stop = moment().valueOf();
    zode.work += stop - start
    zooid.muster(zode)
  });

})


// zooid.on( "image", function detectVehicles(signal){
//   // detectFaces( signal,  zooid );
// })

// zooid.on( "face", function askHuman(signal){
//   if(signal.parent_id){
//     var new_signal = {};
//     new_signal.questions = [
//       { response:"name", question:"Who is this?"}
//     ];
//     new_signal.parent_id = signal.id
//     zooid.emit("finished", new_signal)
//   }
// })







function boot_dir(dirpath){
  fs.readdirSync("./"+dirpath+"/").forEach(function(file) {
    if( fs.lstatSync(dirpath+"/"+file).isDirectory() ){
      boot(dirpath+"/"+file,"app.js","");
    }
  });
}