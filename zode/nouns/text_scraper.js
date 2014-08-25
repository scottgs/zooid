var fs = require('fs');
var cv = require("opencv")
var path = require('path');
var zlib = require('zlib');
var async = require("async");
var _ = require('underscore');

var tesseract = require('node-tesseract');



/******************************************************************************
 * SET UP LISTENERS
 * Adds listeners for whatever to do whatever. Yep.
******************************************************************************/

module.exports = function(collective){

/******************************************************************************
 * TEST WITH BASE CASE
 * Run a test on the cluster with the default applicaiton of processing a small
 * image for feature detection and reporting back to the overmind the events of
 * both the event-positive and event-negative systems of signal processing.
******************************************************************************/


  collective.on( "test", function testScrapeText(signal){
    collective.fire({ parent_id:signal.id, name: "Tesseract OCR: Okay"})
  })


  collective.on( "image", function scrapeTextListener(signal){

    var work = {}
    work.collective = collective
    work.signal = signal

    scrapeText(work, function(){
      console.log("scraped text")
      return 1
    })
  })



}




function scrapeText( work, done ){

  var signal = work.signal
  var collective = work.collective

  var parent_id = signal.id;
  var image_location =  path.join( signal.location, signal.filename )

  // console.log("image_location => ",image_location);


  var options = {
      l: 'eng',
      psm: 6,
      binary: '/usr/local/bin/tesseract'
  };

  // Recognize text of any language in any format
  tesseract.process( image_location, function(err, text) {
    console.log(err || text)
    collective.send( { parent_id:signal.id, noun:"language", name:"Language", text:(err || text) })
    done(null, text)
  });

} 



// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });





