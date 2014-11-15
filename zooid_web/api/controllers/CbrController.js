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
var histogram = require('histogram');

/**
 * Creates a histogram, wait -- this shouldn't be here. what?
 * TODO: Do this in a zode.
 * @param  {String}   fileName the name of the image to be histogrammed.
 * @param  {Function} next     callback function
 * @return {}            
 */
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
	
  /**
   * Grabs test data and exectutes some stuff.
   * @param  {Object} req 
   * @param  {Object} res 
   * @return {}
   */
  test: function(req,res){

    getTestData("../test_data/cbr", function(err, test_files){
        
      var r = Math.round(Math.random()%.1)

      var fileName = test_files[r]
      // _.map(test_files, function(fileName){

        createHistogram(fileName, function(err, hist){

          Cbr.create({name:"cbr_test", noun:"cbr_search", filename:fileName, data:hist}, function(err,signal){
            

            return res.send(err || signal);
          })

        });
      // })
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
    
      createHistogram(uploadedFiles[0].fd, function(err, hist){

        var cbr_file = merge (uploadedFiles[0], {
          name:"cbr_search", 
           
          filename:path.basename(uploadedFiles[0].fd), 
          histogram:hist,
          src:"/images/"+path.basename(uploadedFiles[0].fd)
        })

        Cbr.create(cbr_file,  function(err,img){
          console.log(err||img)
          Signal.create( merge( img, {
            noun:"image",
            id:img.id,
            location:path.dirname(uploadedFiles[0].fd),
            filename:path.basename(uploadedFiles[0].fd)
          }), function(err,im){
            return res.json(im)
          })
        })
      })

    })
  }


}

