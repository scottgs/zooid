/******************************************************************************
 * Zodes communicate with other zodes "locally"
 * They have an 'axon' which connects fires through the hub to the rest of 
 * the zodes. And a series of dendrites as specified by listeners which are 
 * distributed over the thread pool.
 * @exports {Object} zode
******************************************************************************/

var Axon  = require('axon');
var fs    = require("fs")

var axon  = Axon.socket('push');
var dendrites = Axon.socket('sub-emitter');

axon.connect(42003);
dendrites.connect(42002);


/******************************************************************************
 * Flexible language
 * @exports {Object} zode
******************************************************************************/

dendrites.fire  = function(signal){ axon.send(signal) }
dendrites.send  = function(signal){ axon.send(signal) }
dendrites.emit  = function(signal){ axon.send(signal) }
dendrites.emote = function(signal){ axon.send(signal) }


/******************************************************************************
 * Responds to tests and errors
 * @spits {Object} Test || Error results
******************************************************************************/

dendrites.on('test', function(data){
  console.log(data)
  zode.fire( { parent_id : data.id, name:"Cluster: Okay" })
});

dendrites.on("error", function(err){
  zode.send({error:err})
})


/******************************************************************************
 * Reads in local nouns
 * @exports {Object} zode
******************************************************************************/

fs.readdirSync("./nouns").forEach(function(file) {
  require("./nouns/"+file)(dendrites);
});


module.exports = dendrites
