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

    // console.log(err || mat);
    // var m = mat.copy()

    mat.detectObject( cv.FACE_CASCADE, {}, function(err, objects){

      // console.log( err || "objects:"+objects.length )
      if(err) zooid.send({parent_id:signal.id, name:err} )

      if(objects.length<1) {
        zooid.send( { parent_id:signal.id, text:"No faces"} );
        done( null, response )
      
      } else{

        // mat.convertGrayscale()
        // mat.gaussianBlur([9,9])

        for (var i=0; i<objects.length; i++){

          var obj = objects[i]
          var im2  = mat.roi( obj.x, obj.y, obj.width, obj.height );

          im2.gaussianBlur([19,19])
          im2.gaussianBlur([11,11])
          im2.gaussianBlur([7,7])
          im2.gaussianBlur([5,5])

          // im2.adjustROI(
          //   -face.y
          // , (face.y + face.height) - ims[0]
          // , -face.x
          // , (face.x + face.width) - ims[1])

          for(var j = obj.y; j < obj.height+obj.y ; j++)
            for(var k = obj.x; k < obj.width+obj.x ; k++)
              mat.pixel(j,k,im2.pixel( j-obj.y, k-obj.x ))
        }  /// for

        // var faces_image = path.join( "blurred_faces_"+signal.filename )
        // mat.save( faces_image )

        var response = {
          proc:process.pid
          , name:"Blurred faces"
          , head_id:signal.head_id
          , parent_id:signal.id
          , filename:"blurred_faces_"+signal.filename
          , src: "/images/"+ signal.id+"_blurred.jpg"
        }



      }  /// if
      mat.save(response.src)

      done( null, mat.toBuffer() )
    }) /// detectObjects
  }) /// readimage
}  /// detectFaces


// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });





