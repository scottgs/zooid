/******************************************************************************
 * Reads in and spins up all the things you want. And watches the dir for 
 * changes, and restarts on changes.
******************************************************************************/

var forever = require('forever-monitor');
var fs      = require("fs");

var threads = []





function boot_dir(dirpath){
  fs.readdirSync("./"+dirpath+"/").forEach(function(file) {
    if( fs.lstatSync(dirpath+"/"+file).isDirectory() ){
      boot(dirpath+"/"+file,"app.js","");
    }
  });
}

function boot(dir,file,watch){

  threads[file] = new (forever.Monitor)("./"+dir+"/"+file, {
    max: 3,
    silent: false,
    'killTree': true,
    'watch': true,
    'watchDirectory': dir+"/"+watch,
    options: []
  });

  threads[file].on('exit', function () {
    console.log( file, 'exited after 3 restarts' );
  });

  threads[file].start();

}


boot("zooid_web","app.js", "api/");

boot_dir("zooid_extensions")




/*
 * forever-monitor options: https://github.com/nodejitsu/forever-monitor
*/