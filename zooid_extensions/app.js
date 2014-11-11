var forever = require('forever-monitor');
var zode = require('../zooid_core/zode.js');
var zode.extensions = []
var fs = require("fs");

var Nerve = require("axon")
var control = Nerve.socket('rep');
console.log( zode.base_port, zode.broadcast_ip );
control.connect( zode.base_port, zode.broadcast_ip );

control.on("message", function(ip,req,next){
  console.log(req)
  if(ip == zode.ip){
    if(zode.extensions[req.extension]){
      zode.extensions[req.extension][req.method]()
      next("success")
    }
    
  }
  next("NO")
  // zode.muster(zode)
})

/******************************************************************************
 * Reads in all folders in the zode.extensions directory and spawns a process
 * for each of them.
 * @param  {[type]} file
******************************************************************************/

fs.readdirSync("./").forEach(function(file) {

  if( fs.lstatSync(file).isDirectory() ){

    zode.extensions[file] = new (forever.Monitor)(file+"/"+"app.js", {
      max: 3,
      silent: false,
      'killTree': true,
      'watch': true,
      'watchDirectory': file,
      options: []
    });

    zode.extensions[file].on('exit', function () {
      console.log( file, 'exited after 3 restarts' );
    });

    zode.extensions[file].start();
  }

});


/*
 * forever-monitor options: https://github.com/nodejitsu/forever-monitor
*/