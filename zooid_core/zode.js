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

var base_port = require("../config.js").base_port || 42100

var spine = Nerve.socket('sub-emitter');
spine.connect( base_port );

var ganglion = Nerve.socket('push');
ganglion.connect( ++base_port );

var dendrites = Nerve.socket('sub-emitter');
dendrites.connect( ++base_port );

var axon  = Nerve.socket('push');
axon.connect( ++base_port );


/******************************************************************************
 * Flexible language for sending
******************************************************************************/

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

dendrites.on('test', function(data){
  console.log(data)
  zode.fire( { parent_id : data.id, name:"Cluster: Okay" })
})

dendrites.on("error", function(err){
  zode.send({error:err})
})

dendrites.on("*", function(err){
  // dendrites.send("muster", "Zode reporting for duty.")
  console.log("signal transmission")
})


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
