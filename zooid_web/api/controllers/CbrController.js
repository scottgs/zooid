/**
 * CbrController
 *
 * @description :: Server-side logic for managing cbrs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
var merge = require("merge")
var path = require("path")
var _ = require("underscore")
var nn = require('nearest-neighbor');

nn.comparisonMethods.custom = function(a, b) {
  if(a && b && a.length && b.length){

  console.log(a,b)
  var distance = 0;
  for(var i = 0; i < a.length; i++)
    distance += (a[i]-b[i])/255
  console.log(distance)
  return distance; // between 0 and 1
  }
  else{ return 0;}
};


function nearest_neighbor(req,next){

  Signal.find(
    {noun:"cbr_signature"
    , limit:6}).exec(function(err,images){
    var query = { 'signature' : req }

    var fields = [
      // { name: "name", measure: nn.comparisonMethods.word },
      // { name: "name", measure: nn.comparisonMethods.wordArray },
      { name: "signature", measure: nn.comparisonMethods.custom }

      // { name: "age", measure: nn.comparisonMethods.number, max: 100 },
      // { name: "pc", measure: nn.comparisonMethods.word }, 
      // { name: "ip", measure: nn.comparisonMethods.ip }
    ];
    nn.findMostSimilar(query, images, fields, function(nearestNeighbor, probability) {
      console.log({"query":query, "nn":nearestNeighbor, "prob":probability})
      next(null, {"query":query, "nn":nearestNeighbor, "prob":probability});
    });
  })
}


/**
 * Gets test data.
 * @param  {String}   dirpath The directory that has test data in it.
 * @param  {Function} next    callback
 * @return {}
 */
function getTestData(dirpath, next){
  var test_files = []
  var dir = path.normalize(dirpath);
  fs.readdirSync(dir+"/").forEach(function(file) {
    if( ! fs.lstatSync(dir+"/"+file).isDirectory() ){
      test_files.push(dir+"/"+file);
    }
  });
  next(null, test_files)
}



module.exports = {
	

  bounce: function(req,res){
    Signal.find({noun:"cbr_signature"}).exec( function(err,signals){ 
      _.map( signals, function(signal){ 
        Signal.destroy(signal.id, function(er,sig){
          console.log(er,sig);
        })
      })
    })
  },


  /**
   * Grabs test data and exectutes some stuff.
   * @param  {Object} req 
   * @param  {Object} res 
   * @return {}
   */
  test: function(req,res){

    getTestData("../test_data/cbr", function(err, test_files){

      _.map(test_files, function(fileName){
        createHistogram(fileName, function(err, hist){
          Cbr.create({name:"cbr_test", noun:"cbr_search",  filename:fileName, signature:hist.signature,
           histogram:hist}, function(err,signal){
            return res.send(err || signal);
          })

        });
      })
    })
  },

  /**
   * Finds content that is most similar to the input image in accordance with
   * the paramters set in the DOM of the view corresponding to this controller.     
   * @param  {Object} req 
   * @param  {Object} res 
   * @return {}
   */
  
  search:function(req,res){

    /**
     * Sets the upload save path for the image to be searched.
     * @type {Object}
     */
    
    var uploadPath = { dirname: '../public/images'};

    req.file('file').upload(uploadPath, function onUploadComplete (err, uploadedFiles) {
      console.log(uploadedFiles);
      if (err) return res.send(500, err)
    

        var cbr_file = merge (uploadedFiles[0], {
          name:"cbr_search", 
          filename:path.basename(uploadedFiles[0].fd), 
          location:path.dirname(uploadedFiles[0].fd), 
          noun:"new_signal",
          src:"/images/"+path.basename(uploadedFiles[0].fd)
        })


        Cbr.create(cbr_file, function(err,cbr){
          cbr_file.parent_id=cbr.id;
          Signal.create(cbr_file, function(er,re){
            res.send(cbr_file);
          })
        })



        // Cbr.create(cbr_file,  function(err,img){
        //   console.log(err||img)
        //   Signal.create( merge( img, {
        //     noun:"image",
        //     id:img.id,
        //     location:path.dirname(uploadedFiles[0].fd),
        //     filename:path.basename(uploadedFiles[0].fd)
        //   }), function(err,im){
        //     return res.json(im)
        //   })
        // })

    })
  },


  nn: function(req,res){
    nearest_neighbor(req.body.signature, function(err,nn){

      Signal.find({id:req.parent_id}).exec(function(err,signal){
        res.send( merge(signal, nn) )
      })

    })


  },




  clean: function(req,res){

    Cbr.find({}).exec(function(err,images){

      _.map(images, function(image){
        Cbr.destroy(image.id, function(er,k){
          console.log(err|k)
        });
      })
    })

    return res.send("this model is clean.")
  }



}

