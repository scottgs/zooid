/*
 * Zooid launcher
 * Reads in and spins up all the things you want. And watches the dir for 
 * changes, and restarts on changes.
 * Copyright (c) 2014 Ben Baker
 */

/**
 * Brings in dependencies
 * @type {Object}
 */
var forever = require('forever-monitor');
var fs      = require("fs");
var threads = []




/**
 * spawns a new thread to launch each subdir in a dir.
 * @param  {[type]} dirpath [description]
 * @return {[type]}         [description]
 */
function boot_dir(dirpath){
  fs.readdirSync("./"+dirpath+"/").forEach(function(file) {
    if( fs.lstatSync(dirpath+"/"+file).isDirectory() ){
      boot(dirpath+"/"+file,"app.js","");
    }
  });
}

/**
 * Spins up a new thread with a monitor for each of the sub_dirs
 * in a specified direcory and watches for chahnges -- to restart
 * the thread on change.
 * @param  {String} dir   the directory within which the apps exist
 * @param  {String} file  name of the thing
 * @param  {String} watch Directory to watch changes
 * @return null
 */
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

/**
 * Starts up the things.
 */
boot("zooid_web","app.js", "api/");
boot_dir("zooid_extensions")
boot_dir("zooid_transforms")





