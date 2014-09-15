var forever = require('forever-monitor');
var extensions = []
var fs = require("fs");

/******************************************************************************
 * Reads in all folders in the extensions directory and spawns a process
 * for each of them.
 * @param  {[type]} file
******************************************************************************/

fs.readdirSync("../extensions/").forEach(function(file) {

  if( fs.lstatSync(file).isDirectory() ){

    extensions[file] = new (forever.Monitor)(file+"/"+file+".js", {
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



/******************************************************************************
 * All of the possible options that can be passed into forever-monitor.
 * More here: https://github.com/nodejitsu/forever-monitor
******************************************************************************/

/*
'silent': false,            // Silences the output from stdout and stderr in the parent process
'uid': 'your-UID'           // Custom uid for this forever process. (default: autogen)
'pidFile': 'path/to/a.pid', // Path to put pid information for the process(es) started
'max': 10,                  // Sets the maximum number of times a given script should run
'killTree': true            // Kills the entire child process tree on `exit`

'minUptime': 2000,     // Minimum time a child process has to be up. Forever will 'exit' otherwise.
'spinSleepTime': 1000, // Interval between restarts if a child is spinning (i.e. alive < minUptime).

'command': 'perl',         // Binary to run (default: 'node')
'options': ['foo','bar'],  // Additional arguments to pass to the script,
'sourceDir': 'script/path' // Directory that the source script is in

'watch': true               // Value indicating if we should watch files.
'watchIgnoreDotFiles': null // Whether to ignore file starting with a '.'
'watchIgnorePatterns': null // Ignore patterns to use when watching files.
'watchDirectory': null      // Top-level directory to watch from.

'spawnWith': {
  customFds: [-1, -1, -1], // that forever spawns.
  setsid: false
},

'env': { 'ADDITIONAL': 'CHILD ENV VARS' }
'cwd': '/path/to/child/working/directory'

'logFile': 'path/to/file', // Path to log output from forever process (when daemonized)
'outFile': 'path/to/file', // Path to log output from child stdout
'errFile': 'path/to/file'  // Path to log output from child stderr

*/