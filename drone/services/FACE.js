
var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require("async");
var zlib = require('zlib');
var cv = require("opencv");
var histogram = require("histogram");

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
   console.log("req.filename", req.filename)
   console.log("req.location", req.location)

   var image_location = path.join( req.location, req.filename);
   console.log("image_location", image_location)
   

   var t = 2

   var r = function(c){
      return Math.ceil( Math.random()*255);
   }

   for (var i = t - 1; i >= 1; i--) {

      var gap = Math.round((255/t)*0.7*(i+1))
      var val = Math.round((255/t)*(i+1))

      var valgap = val + gap

      var low  =  [ val, val, val ];
      var high =  [ valgap, valgap, valgap ];

      // (B)lue, (G)reen, (R)ed
      // var lower_threshold = [r(), r(), r()];
      // var upper_threshold = [r(), r(), r()];

      cv.readImage( image_location, function(err, mat){

         console.log(err || mat)
         mat.inRange(low, high);

         var filename = "range"+req.id+i+req.filename
         var image_path = path.join( req.location , filename );
         mat.save( image_path );

         req.overmind.create( { proc:process.pid, parent_id:req.id, service:"finished", location:image_path, filename:filename }, function(a,b){ console.log(a,b) })
         
      })

      }


      cv.readImage( image_location, function(err, m){

         transform = "canny";

         var mat = m.copy()

         mat[transform](5,100);

         var filename = transform+req.id+i+req.filename
         var image_path = path.join( req.location , filename );
         mat.save( image_path );

         req.overmind.create( { proc:process.pid, parent_id:req.id, service:"finished", location:image_path, filename:filename }, function(a,b){ console.log(a,b) })
         


         var mat = m.copy()

         transform = "convertGrayscale";

         mat[transform]();

         var filename = transform+req.id+i+req.filename
         var image_path = path.join( req.location , filename );
         mat.save( image_path );

         req.overmind.create( { proc:process.pid, parent_id:req.id, service:"finished", location:image_path, filename:filename }, function(a,b){ console.log(a,b) })
         


         var mat = m.copy()

         transform = "convertHSVscale";

         mat[transform]();

         var filename = transform+req.id+i+req.filename
         var image_path = path.join( req.location , filename );
         mat.save( image_path );

         req.overmind.create( { proc:process.pid, parent_id:req.id, service:"finished", location:image_path, filename:filename }, function(a,b){ console.log(a,b) })
         





         var mat = m.copy()
         var transform = "contours"


         var lowThresh = 0;
         var highThresh = 100;
         var nIters = 2;
         var maxArea = 2500;

         var GREEN = [0, 255, 0]; //B, G, R
         var WHITE = [255, 255, 255]; //B, G, R
         var RED   = [0, 0, 255]; //B, G, R


         var big = new cv.Matrix(mat.height(), mat.width()); 
         var all = new cv.Matrix(mat.height(), mat.width()); 

         mat.convertGrayscale();
         im_canny = mat.copy();

         im_canny.canny(lowThresh, highThresh);
         im_canny.dilate(nIters);

         contours = im_canny.findContours();

         for(i = 0; i < contours.size(); i++) {
            if(contours.area(i) > maxArea) {
               var moments = contours.moments(i);
               var cgx = Math.round(moments.m10/moments.m00);
               var cgy = Math.round(moments.m01/moments.m00);
               big.drawContour(contours, i, GREEN);
               big.line([cgx - 5, cgy], [cgx + 5, cgy], RED);
               big.line([cgx, cgy - 5], [cgx, cgy + 5], RED);
            }
         }

         all.drawAllContours(contours, WHITE);

         var filename = transform+req.id+i+req.filename
         var image_path = path.join( req.location , filename );
         // all.save( image_path );
         big.save( image_path );

         req.overmind.create( { proc:process.pid, parent_id:parent_id, service:"finished", location:image_path, filename:filename }, function(a,b){ console.log(a,b) })





      })





      histogram(image_location || Buffer, function (err, data) {

         var hist = 'Unique colors: ' + data.colors.rgba + '<br />';


         var r = _.reduce( data.red,   function(a,b){ return a+b } );
         var g = _.reduce( data.green, function(a,b){ return a+b } );
         var b = _.reduce( data.blue,  function(a,b){ return a+b } );

         hist+= "red: " + r + "<br />"
         hist+= "green: " + g + "<br />"
         hist+= "blue: " + b + "<br />"

         req.overmind.create( { proc:process.pid, parent_id:parent_id, service:"finished", histogram:data, text:hist  }, function(a,b){ console.log(a,b) })
      
      });




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
   }

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


module.exports.run = run;
module.exports.test = test;

// if(process.argv[2] === 'test') 
//    test();


