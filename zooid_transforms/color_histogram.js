/**
 * Creates a color histogram from an image file.
 * @param  {String}   fileName name of the image file.
 * @param  {Function} next     callback function
 * @return {}
 */

var histogram = require("histogram");

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

process.on('message', function(signal) {
  createHistogram(signal.filename, function(err,hist){
    process.send(hist)
  })

})
