var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var zlib = require('zlib');
var async = require("async");
var histogram = require("histogram")

var errorHandler = function(err, next){
   if(err){
      console.log(err);
      next(err);
   } return;
}


/**
 * Isolate and create new signals for all of the faces in the image, associated  back
 * to the parent image.
 * @param  {[Buffer]}   zipped_buffer  [a Buffer Object deflated with zlib]
 * @param  {Function}   next           [callback function]
 * @return {[type]}                    [description]
 */

var service_action = function(req, next){

   var parent_id = req.id;

   var image_location = path.join( req.location, req.filename);
   console.log(image_location)

   cv.readImage( image_location, function(err, mat){

      var m = mat.copy()

      mat.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
         
         console.log(err|| "FACES:"+faces.length)
         if(err) next(err); 

         if(!faces){
            req.overmind.create( { 
               parent_id:parent_id, 
               service:"finished", 
               data:"NO FACES", 
               text:"No Faces found in this image." 
            }, function(a,b){  })
         }

         var res = [];

         for (var i=0; i<faces.length; i++){
            
            console.log("FACE DETECTED ", i)

            var face = faces[i]
            var ims  = mat.size()
            var im2  = mat.roi(face.x, face.y, face.width, face.height);
            var filename = req.id+'_FACE_'+i+"_"+req.filename

            var image_dir = path.join( req.location );
            var image_path = path.join( req.location , filename );

            im2.save( image_path );
            console.log("SAVED TO", image_path);
            res.push( face )
            req.overmind.create( { proc:process.pid, parent_id:req.id, service:"FACE", data:face, location:image_dir, filename:filename }, function(a,b){ console.log(); })
         }

      }) // end detect faces


      histogram(image_location || Buffer, function (err, data) {

         req.overmind.create( { proc:process.pid, parent_id:parent_id, service:"finished",  histogram:data }, function(a,b){ console.log("a"); })

      });



      // var w = m.width()
      // var h = m.height()


      // function getPrecision(scinum) {
      //   var arr = new Array();
      //   // Get the exponent after 'e', make it absolute.  
      //   arr = scinum.split('e');
      //   var exponent = Math.abs(arr[1]);

      //   // Add to it the number of digits between the '.' and the 'e'
      //   // to give our required precision.
      //   var precision = new Number(exponent);
      //   arr = arr[0].split('.');
      //   precision += arr[1].length;

      //   return precision;
      // }


      // for (var i = 0; i < w; i++) {


         // for (var i = 0; i < w; i++) {
         //    console.log(  getPrecision( new String( m.get(i,5) ) ) );
         // };


         // console.log(r)

         // for (var j = 0; j < h; j++){

            
         //    var v = mat.get(i,j);
         //    console.log( v )

         // };         
      // };         


      

   }); // end readImage

   next(null, "ALL_FACES");

}

/**
 * Creates an asynchronous task queue
 * @param {Function} [action to execute]
 * @param {Number}   [concurrency limit]
 * @return {queue}   [async queue handler]
 */


/**
 * Does the thing
 * @param  {request object}       req
 * @param  {Function}   next   callback
 */

var run = function run(req, next){

   var q = async.queue( service_action, os.cpus().length );

   console.log(req.location);

   q.drain = function() {
      console.log('FACE DETECTION COMPLETE');
      // req.save( function(err, r){
         // if(err)req.broadcast('MODEL SAVE FAILED!', req._id);
         // req.broadcast('finished', req._id);
      // })
   }

   // if(typeof req.location == 'array'){
   //    _.each( req.location, function(item){
   //       q.push(item, function (err, result) {
   //          console.log(err || ("RESULT: ", result));
   //          req.broadcast("finished", req._id)
   //       });
   //    });

   // } else {
      console.log("FINDING FACES");
      q.push(req, function (err, result) {
         console.log(err || "RESULT: ", result);
      });
   // }

};

var test = function test(){

   sig = {};
   sig.broadcast = console.log
   sig.location = "../examples/group.jpg"

   run(sig, console.log);

}

// /**
//  * Circles Faces
//  * @param {Image Matrix}   mat
//  * @param {Array ROIs}     faces
//  * @param {Function}       next
//  */

// var circleFaces = function(mat, faces, next){
//    for (var i=0;i<faces.length; i++){
//       console.log("face:", faces[i])
//       var x = faces[i]
//       mat.ellipse(x.x + x.width*1.25, x.y + x.height*1.05, x.width*1.05, x.height*1.05);
//    }
// }



module.exports.run = run;
module.exports.test = test;

// if(process.argv[2] === 'test') 
//    test();


