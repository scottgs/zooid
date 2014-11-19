/**
 * Zodes are the principle components in zooid. They know how to route information
 * through the cluster and they manage the resources to be made available to the
 * cluster.
 * @exports {Object} zode
*/

var Zode = function(){ ; }

/**
 * Brings in routing and socket dependencies
 * @type {Object}
 */

var Nerve  = require('axon');

/**
 * Brings in file system manipulation
 * @type {Object}
 */

var fs    = require("fs")

/**
 * Gets base port from the config file and increment that for each the ganglion, 
 * dendrites, and axon. Sets their connectivity paramaters.
 */


/**
 * Brings in configuration file
 * @type {Object}
 */

var config = require("../zooid_config.js")

/**
 * Sets the base bort from the config file.
 * @type {Number}
 */

var base_port = config.base_port || 42100

/**
 * Sets the broadcast IP
 * @type {IP Address}
 */

var broadcast_ip = config.broadcast_ip

/**
 * Creates a push socket for the ganglionic UDP backplane.
 * @type {Socket}
 */

var ganglion = Nerve.socket('push');
ganglion.connect( 1+base_port, broadcast_ip );

/**
 * Creates a sub-emitter socket for the dendritic UDP backplane
 * @type {Socket}
 */

var dendrites = Nerve.socket('sub-emitter');
dendrites.connect( 2+base_port, broadcast_ip );

/**
 * Creates a sub-emitter socket for the axonic UDP backplane  
 * @type {Socket}
 */

var axon  = Nerve.socket('push');
axon.connect( 3+base_port, broadcast_ip );

// /**
//  * Request socket -- waits for a reply.
//  * I don't know if this blocks.
//  * @type {Socket}
//  */

// var request = Nerve.socket('req');
// request.bind(4+base_port, broadcast_ip);

// request.send('transform', {image:"image"}, function(res){
//   console.log(res);
// });






/**
 * Finds out where it lives.
 * @param  {Function} done callback
 * @return null
 */

function introspect(done){

  /**
   * Gets all the network interfaces from os and walks them
   * looking for candidates for this Zodes IP address.
   */
  var os = require('os');
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        /**
         * Disrefards loopback addresses.
         */
        if(details.address != '127.0.0.1')
          dendrites.ip = details.address
          ++alias;
        }
        /**
         * Gets IPV6 if no IPv4 is found.
         * @type {IPV6 Address}
         */
        else if (details.family=='IPv6') {
          dendrites.ip = details.address
          ++alias;
      }
    });
  }
}

/**
 * Launches on start up.
 */

introspect()

/*
 * Provide flexible, extendable language for sending
 */

dendrites.send     = function(signal){ axon.send(signal) }
dendrites.fire     = function(signal){ axon.send(signal) }
dendrites.emit     = function(signal){ axon.send(signal) }
dendrites.respond  = function(signal){ axon.send(signal) }

/**
 * Publically exposes base_port and broadcast IP.
 * @type {Port}
 * @type {IP Address}
 */

dendrites.base_port     = base_port 
dendrites.broadcast_ip  = broadcast_ip 

/**
 * Sends muster information to the cluster core.
 * @param  {Object} signal  the message to be sent
 * @return {Socket-Emitter}  
 */

dendrites.muster  = function(signal){ ganglion.send(signal) }

/**
 * Responds to tests and errors and stuff.
 * @param  {IP Address} dendrites.ip
 * @param  {*} data whatever is transmitted
 */

dendrites.on(dendrites.ip, function(data){
  dendrites.send( { parent_id:data.id, name:"Cluster: Okay" })
})
dendrites.on("error", function(err){
  dendrites.send({error:err})
})
dendrites.on("*", function(err){
  console.log("transmission")
})

/**
 * Exports public functionality.
 * @type {Complex Socket Object}
 */

module.exports = dendrites
