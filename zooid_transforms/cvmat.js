var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var _ = require('underscore');
var moment = require("moment")
var merge = require("merge")


process.on('message', function(signal) {
  blur(signal, function(err,hist){
    process.send(hist)
  })

})



function blur( signal, done ){

  var parent_id = signal.id;

  var image = signal.matrix || signal.filename;

  // console.log("image_location => ",image_location);

  cv.readImage( image, function(err, mat){
      done(null, mat.toBuffer())
  }) /// readimage
}  /// detectFaces


// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });







