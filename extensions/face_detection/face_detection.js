var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var zlib = require('zlib');
var async = require("async");
var _ = require('underscore');
var moment = require('moment');

var zooid = require("../../zooid_core")
console.log("face detection intiated.")
var merge = require('merge')

var zode = merge( require("./package.json"), { 
    name:"Face Detection"
  , takes:"image"
  , gives:"face, faces"
  , ip:zooid.ip||'unknown'
  , status:"?"
  , work:0
  , actions:0 
})

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

zooid.on( "test", function testFaceRecognition(signal){
  
 //  var test_image = {
 //    name:"Face Detection Test"
 //  , location:path.join( __dirname , 
 //  "../../web/.tmp/public/files/diverse.jpg" )
 //  , filename:"group.jpg"
 //  , noun:"image"
 //  , parent_id:signal.id
 // }

 // detectFaces( test_image, zooid )

  zode.status = "active"
  zooid.muster(zode)
  zooid.send({ parent_id:signal.id, name:zode.name, text: "okay"})
})


/******************************************************************************
 * SET UP LISTENERS
 * Adds listeners for whatever to do whatever. Yep.
******************************************************************************/

zooid.on( "image", function detectFacesListenerImage(signal){

  var start = moment().valueOf();
  zode.actions+=1

  detectFaces( signal, function(res){
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




function detectFaces( signal, done ){

  var parent_id = signal.id;
  var image_location =  path.join( signal.location, signal.filename )

  // console.log("image_location => ",image_location);

  cv.readImage( image_location, function(err, mat){

    // console.log(err || mat);
    // var m = mat.copy()

    mat.detectObject( cv.FACE_CASCADE, {}, function(err, objects){

      // console.log( err || "objects:"+objects.length )
      if(err) zooid.send({parent_id:signal.id, name:err} ); 

      if(objects.length<1) {
        zooid.send( { parent_id:parent_id, text:"No faces detected"} );
        done( null, response )
      
      }
      else{

        var res = [];

        for (var i=0; i<objects.length; i++){

          console.log("found faces:", objects.length)

          var face = objects[i]
          var ims  = mat.size()

          var im2  = mat.roi( face.x, face.y, face.width, face.height );

          // im2.adjustROI(
          //   -face.y
          // , (face.y + face.height) - ims[0]
          // , -face.x
          // , (face.x + face.width) - ims[1])
          var x = face;

          var filename = signal.id+'_face'+'_OBJECT_'+i+signal.filename

          var image_dir  = path.join( signal.location );
          var image_path = path.join( signal.location , filename );

          im2.save( image_path )
          res.push( face )

          mat.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
          
          var response = {
            proc:process.id
            , name:"Face"
            , head_id:signal.parent_id
            , confirm:true
            , parent_id:signal.id
            , data:face
            , location:signal.location 
            , filename:filename 
            , noun:"face" 
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
          , name:"Faces"
          , noun:"faces"
          , head_id:signal.head_id
          , parent_id:signal.id
          // , service:"finished"
          , data:face
          , location:signal.location 
          , filename:"faces_"+signal.filename
        }

        zooid.send( response )
        done( null, response )

      }  /// if
    }) /// detectObjects
  }) /// readimage
}  /// detectFaces





