var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require("async");
var zlib = require('zlib');
var cv = require("opencv")

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

var service_action = function(zipped_buffer, next){


   console.log("zipped_buffer: ",zipped_buffer);

   zlib.unzip( zipped_buffer.buffer, function(err, image_buffer){

   console.log(err || ("image_buffer: ",image_buffer));

      cv.readImage( image_buffer, function(err, mat){

         // console.log(err || ("mat: ",mat));

         mat.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
            
            console.log(err||faces)
            if( !faces || err ) next(null, "NO FACES OR ERR"); 

            var res = [];

            for (var i=0; i<faces.length; i++){
               
               console.log("FACE DETECTED ", i)

               var face = faces[i]
               var ims  = mat.size()
               var im2  = mat.roi(face.x, face.y, face.width, face.height);

               console.log( path.join( __dirname , '/../examples/face'+i+'.jpg') );
               im2.save(path.join(  __dirname , '/../examples/face'+i+'.jpg') );
               res.push( face )

            }

            // req.broadcast('finished', req._id);
            // 
            // mat.save("../core/examples/FACE_DETECTION_RESULT.jpg");
            next(null, res);

         })
      })
   });
}

/**
 * Creates an asynchronous task queue
 * @param {Function} [action to execute]
 * @param {Number}   [concurrency limit]
 * @return {queue}   [async queue handler]
 */

var q = async.queue( service_action, os.cpus().length );

/**
 * Does the thing
 * @param  {request object}       req
 * @param  {Function}   next   callback
 */

var run = function run(req, next){

   q.drain = function() {
      console.log('FACE DETECTION COMPLETE');
      req.save( function(err, r){
         if(err)req.broadcast('MODEL SAVE FAILED!', req._id);
         req.broadcast('finished', req._id);
      })
   }

   if(typeof req.data == 'array'){
      _.each( req.images, function(item){
         q.push(item, function (err, result) {
            console.log(err || ("RESULT: ", result));
            // req.broadcast("next_thing", req._id)
         });
      });

   } else {
      console.log("FINDING FACES");
      q.push(req.data, function (err, result) {
         console.log(err || "RESULT: ", result);
      });
   }

};

var test = function test(){

   sig = {};
   sig.broadcast = console.log
   sig.images = "../examples/group.jpg"

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


