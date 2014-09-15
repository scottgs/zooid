var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var zlib = require('zlib');
var async = require("async");
var _ = require('underscore');
var moment = require("moment")

var zooid = require("../../zooid_core")
console.log("vehicle detection intiated.")

var zode = { 
    name:"Vehicle Detection"
  , filename:"vehicle_detection.js"
  , takes:"image"
  , gives:"vehicles"
  , status:"active"
  , work:0
  , actions:0 
}

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})

zooid.muster(zode)

/******************************************************************************
 * TEST WITH BASE CASE
 * Run a test on the cluster with the default applicaiton of processing a small
 * image for feature detection and reporting back to the overmind the events of
 * both the event-positive and event-negative systems of signal processing.
******************************************************************************/

zooid.on( "test", function testVehicleRecognition(signal){
  
 //  var test_image = {
 //    name:"Face Detection Test"
 //  , location:path.join( __dirname , 
 //  "../../web/.tmp/public/files/diverse.jpg" )
 //  , filename:"group.jpg"
 //  , noun:"image"
 //  , parent_id:signal.id
 // }

 // detectFaces( test_image, zooid )

 zooid.fire({ parent_id:signal.id, name: "Face detection: Okay"})
})


/******************************************************************************
 * SET UP LISTENERS
 * Adds listeners for whatever to do whatever. Yep.
******************************************************************************/

zooid.on( "image", function detectVehiclesListenerImage(signal){
  var start = moment().valueOf();
  detectVehicles(signal, function(err, result){
    zode.actions +=1
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








function detectVehicles( signal, done ){

  // cv.readImage("./car1.jpg", function(err, im){

  //   im.detectObject("../data/hogcascade_cars_sideview.xml", {}, function(err, cars){  

  //   for (var i=0;i<cars.length; i++){
  //     var x = cars[i];
  //     im.rectangle([x.x, x.y], [x.width, x.height]);
  //   }

  //   // im.save('./cars.jpg');   
  //   });
  // });


  var parent_id = signal.id;
  var image_location =  path.join( signal.location, signal.filename )

  // console.log("image_location => ",image_location);

  cv.readImage( image_location, function(err, mat){

    // console.log(err || mat);
    // var m = mat.copy()

    mat.detectObject( "../node_modules/opencv/data/hogcascade_cars_sideview.xml", {}, function(err, objects){

      console.log( err || "vehicles:"+objects.length )
      if(err) zooid.send({parent_id:signal.id, name:err} ); 

      if(objects.length<1) {
        zooid.send( { parent_id:parent_id, text:"No vehicles detected"} );
        done( null, response )
      
      }
      else{

        var res = [];

        for (var i=0; i<objects.length; i++){

          console.log("found vehicles:", objects.length)

          var face = objects[i]
          var ims  = mat.size()

          var im2  = mat.roi( face.x, face.y, face.width, face.height );

          // im2.adjustROI(
          //   -face.y
          // , (face.y + face.height) - ims[0]
          // , -face.x
          // , (face.x + face.width) - ims[1])
          var x = face;

          var filename = signal.id+'_vehicle'+'_OBJECT_'+i+signal.filename

          var image_dir  = path.join( signal.location );
          var image_path = path.join( signal.location , filename );

          im2.save( image_path )
          res.push( face )

          mat.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
          
          var response = {
            proc:process.id
            , name:"Vehicle"
            , noun:"vehicle" 
            , head_id:signal.parent_id
            , confirm:true
            , parent_id:signal.id
            , data:face
            , location:signal.location 
            , filename:filename 
          }
          if(!signal.test){
            zooid.send( response )
          }
        }  /// for


        var faces_image = path.join( signal.location, "faces_"+signal.filename )
        mat.save( faces_image )

        var response = {
          proc:process.pid
          // , text:casc
          , name:"Vehicles"
          , noun:"vehicles"
          , head_id:signal.head_id
          , parent_id:signal.id
          // , service:"finished"
          , data:face
          , location:signal.location 
          , filename:"faces_"+signal.filename
        }

          zooid.send( response );

          done( null, response )

      }  /// if
    }) /// detectObjects
  }) /// readimage
}  /// detectFaces



// create a queue object with concurrency 2

// var q = async.queue( detectFaces, 2 );


// // assign a callback
// q.drain = function() {
//     console.log('All items have been processed');
// }




// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });





