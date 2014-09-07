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


/******************************************************************************
 * LISTEN FOR IMAGES
 * Send the signal and collective object into the text scraper function.
 * Let the next function deal with emitting events out to the cluster.
******************************************************************************/

  collective.on( "image", function scrapeTextListener(signal){
    var work = {}
    work.collective = collective
    work.signal     = signal
    scrapeText( work, console.log )
  })

}


/******************************************************************************
 * SCRAPE ENGLISH TEXT FROM IMAGES
 * Execute the tesseract OCR with English on images.
******************************************************************************/

function scrapeText( work, done ){

  var signal = work.signal
  var collective = work.collective
  var image_location =  path.join( signal.location, signal.filename )

  // any language in any format
  var options = {
      l: 'eng',
      psm: 4,
      binary: '/usr/local/bin/tesseract'
  };

  tesseract.process( image_location, function(err, text) {

    console.log(err || text)
    collective.send( { 
      parent_id:signal.id
    , noun:"text"
    , name:"English"
    , text:(err || text) 
  })
    done(null, text)
  });
} 



// add some items to the front of the queue
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });





