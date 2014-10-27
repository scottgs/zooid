/******************************************************************************
 * Zodes communicate with other zodes "locally"
 * They have an axon which connects fires through the hub to the rest of 
 * the zodes. And a series of dendrites as specified by listeners which are 
 * distributed over the thread pool.
 *
 * Commenting before making sinificant architectural decisions is bad because
 * your code gets inundated with what seems like relevant comments. But are 
 * sometimes straight up wrong...
 * 
 * @exports {Object} zode
******************************************************************************/

var Nerve  = require('axon');
var fs    = require("fs")


/******************************************************************************
 * Get base port from the config file and increment that for each the ganglion, 
 * dendrites, and axon.
******************************************************************************/

var config = require("../zooid_config.js")

var base_port = config.base_port || 42100
var broadcast_ip = config.broadcast_ip || '128.206.116.239'

var spine = Nerve.socket('sub-emitter');
spine.connect( base_port, broadcast_ip );

var ganglion = Nerve.socket('push');
ganglion.connect( ++base_port, broadcast_ip );

var dendrites = Nerve.socket('sub-emitter');
dendrites.connect( ++base_port, broadcast_ip );

var axon  = Nerve.socket('push');
axon.connect( ++base_port, broadcast_ip );

var sock = Nerve.socket('sub');
sock.connect(42002, broadcast_ip);

/******************************************************************************
 * Find out who I am.
******************************************************************************/

function introspect(done){
  var os = require('os');
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        // console.log(dev+(alias?':'+alias:''),details.address);
        if(details.address != '127.0.0.1')
          dendrites.ip = details.address
        ++alias;
      }
      else if (details.family=='IPv6') {
        dendrites.ip = details.address
        ++alias;
      }
    });
  }
}
introspect()

/******************************************************************************
 * Flexible language for sending
******************************************************************************/

// dendrites.ip       = function(signal){ return introspect() }
dendrites.fire     = function(signal){ axon.send(signal) }
dendrites.send     = function(signal){ axon.send(signal) }
dendrites.emit     = function(signal){ axon.send(signal) }
dendrites.respond  = function(signal){ axon.send(signal) }


/******************************************************************************
 * Flexible language for sending
******************************************************************************/

dendrites.muster  = function(signal){ ganglion.send(signal) }


/******************************************************************************
 * Responds to tests and errors and stuff!
******************************************************************************/

// dendrites.on('test', function(data){
//   console.log("TEST REQUEST", data)
//   dendrites.fire( { parent_id : data.id, name:"Cluster: Okay" })
// })
// dendrites.on("error", function(err){
//   dendrites.send({error:err})
// })

// dendrites.on("*", function(err){
  // console.log("signal transmission")
// })


/******************************************************************************
 * Muster listener, responds to other nodes with it's status and persists 
 * that state in the central model hetta muster changes or timeouts.
******************************************************************************/

// dendrites.on("muster", function(req){
//   dendrites.muster({ name: "Zode", status: "active" })
// })


/******************************************************************************
 * Reads in local nouns
 * DEPRICATED
 * @exports {Object} zode
******************************************************************************/

// fs.readdirSync("../extensions/").forEach(function(file) {
//   require("../extensions/"+file)(dendrites);
// });


// var path = require('path');
// var appDir = path.dirname(require.main.filename);



module.exports = dendrites
