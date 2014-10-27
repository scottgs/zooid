var forever = require('forever-monitor');
var extensions = []
var fs = require("fs");

/******************************************************************************
 * Reads in all folders in the extensions directory and spawns a process
 * for each of them.
 * @param  {[type]} file
******************************************************************************/

fs.readdirSync("./").forEach(function(file) {

  if( fs.lstatSync(file).isDirectory() ){

    extensions[file] = new (forever.Monitor)(file+"/"+"app.js", {
      max: 3,
      silent: false,
      'killTree': true,
      'watch': true,
      'watchDirectory': file,
      options: []
    });

    extensions[file].on('exit', function () {
      console.log( file, 'exited after 3 restarts' );
    });

    extensions[file].start();
  }

});


/*
 * forever-monitor options: https://github.com/nodejitsu/forever-monitor
*/