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
    name:"Face Blurring"
  , filename:"face_blurring.js"
  , takes:"image"
  , gives:"blurred_faces"
  , ip:zooid.ip || 'unkown'
  , status:"?"
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



function blurFaces( signal, done ){

  var parent_id = signal.id;
  var image_location = path.join( signal.location, signal.filename )

  // console.log("image_location => ",image_location);

  cv.readImage( image_location, function(err, mat){

    // console.log(err || mat);
    // var m = mat.copy()

    mat.detectObject( cv.FACE_CASCADE, {}, function(err, objects){

      // console.log( err || "objects:"+objects.length )
      if(err) zooid.send({parent_id:signal.id, name:err} )

      if(objects.length<1) {
        zooid.send( { parent_id:parent_id, text:"No faces"} );
        done( null, response )
      
      } else{

        // mat.convertGrayscale()
        // mat.gaussianBlur([9,9])

        for (var i=0; i<objects.length; i++){

          var obj = objects[i]

          var im2  = mat.roi( obj.x, obj.y, obj.width, obj.height );

          im2.gaussianBlur([19,19])
          im2.gaussianBlur([11,11])





          // im2.adjustROI(
          //   -face.y
          // , (face.y + face.height) - ims[0]
          // , -face.x
          // , (face.x + face.width) - ims[1])


          for(var j = obj.y; j < obj.height+obj.y ; j++)
            for(var k = obj.x; k < obj.width+obj.x ; k++)
              mat.pixel(j,k,im2.pixel( j-obj.y, k-obj.x ))

        }  /// for

        var faces_image = path.join( signal.location, "blurred_faces_"+signal.filename )
        mat.save( faces_image )

        var response = {
          proc:process.pid
          , name:"Blurred faces"
          , head_id:signal.head_id
          , parent_id:signal.id
          , location:signal.location 
          , filename:"blurred_faces_"+signal.filename
        }

          zooid.send( response );

          done( null, response )

      }  /// if
    }) /// detectObjects
  }) /// readimage
}  /// detectFaces



// create a queue object with concurrency 2

var q = async.queue( blurFaces, 2 );


// assign a callback
q.drain = function() {
    console.log('All items have been processed');
}




// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });





