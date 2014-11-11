var fs = require('fs');
var path = require('path');
var async = require("async");
var _ = require('underscore');
var moment = require("moment")
var merge = require("merge")
var histogram = require('histogram');

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

/******************************************************************************
 * SET UP LISTENERS
 * Adds listeners for whatever to do whatever. Yep.
******************************************************************************/

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


function createHistogram(fileName, next){
  histogram(fileName || Buffer, function (err, data) {
    var hist = {}
    hist['r']=[]; hist['g']=[]; hist['b']=[]; hist['a'] = [];

    for (var i = 0; i < data.red.length; i++) {
      var ii = Math.floor(i/16)
      if(typeof hist.r[ii] == 'undefined'){
        hist.r[ii] = 0 
        hist.g[ii] = 0
        hist.b[ii] = 0 
        hist.a[ii] = 0
      }
      hist.r[ii]+=data.red[i]
      hist.g[ii]+=data.green[i]
      hist.b[ii]+=data.blue[i]
      hist.a[ii]+=data.alpha[i]
    };
    next(err,hist)
  });
}


