var forever = require('forever-monitor');
var zode = require('../zooid_core/zode.js');
zode.extensions = []
var fs = require("fs");

var Nerve = require("axon")
var control = Nerve.socket('rep');
console.log( zode.base_port, zode.broadcast_ip );
control.connect( zode.base_port, zode.broadcast_ip );

control.on("message", function(ip,service,next){
  console.log(ip, service, next)
  console.log(ip, zode.ip)
  if( ip == zode.ip && zode.extensions[service] ){
      zode.extensions[service].once("exit", function(){console.log("KILLED")})
      next(null, "success")
  }
  else{
    next("Could not do it!", null)
  }
  // zode.muster(zode)
})

/******************************************************************************
 * Reads in all folders in the zode.extensions directory and spawns a process
 * for each of them.
 * @param  {[type]} file
******************************************************************************/

fs.readdirSync("./").forEach(function(service) {

  if( fs.lstatSync(service).isDirectory() ){

    zode.extensions[service] = new (forever.Monitor)(service+"/"+"app.js", {
      max: 0,
      silent: false,
      'killTree': true,
      'watch': true,
      'watchDirectory': service,
      options: []
    });

    zode.extensions[service].on('exit', function () {
      console.log( service, 'exited ' );
    });

    zode.extensions[service].start();
  }

});


/*
 * forever-monitor options: https://github.com/nodejitsu/forever-monitor
*/