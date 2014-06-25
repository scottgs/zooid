var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var async = require("async");
var os = require("os");

var broadcaster = require('dgram').createSocket('udp4');
broadcaster.bind(42002, '239.255.0.1'); // port, ip

var _ = require("underscore");
var path = require('path');
//var Signal = require('../web/api/models/Signal.js');
var Signal = {
   create: function(obj, fn){},
};
/** ----------------------------------------------------------------------------
 * Once listening, configure the socket and log network info 
 * -------------------------------------------------------------------------- */

broadcaster.on('listening', function () {
   var address = broadcaster.address();
   console.log('UDP broadcaster listening on ' + address.address + ":" + address.port);
   broadcaster.setBroadcast(true);
   broadcaster.setMulticastTTL(128);
   broadcaster.addMembership('239.255.0.1');
});

/** ----------------------------------------------------------------------------
 * Broadcasts a service request to the cluster over udp4 socket.
 * @param  {String} service   Name of service to be called on the dataset
 * @param  {String} signal_id The Signals Iunique identifier from the database.
 * -------------------------------------------------------------------------- */

var broadcast = function(service, signal_id){
   if( typeof service === 'undefined' ) return;
   if(Object.prototype.toString.call( service ) === '[object Array]'){
      for (var t = service.length - 1; t >= 0; t--) broadcast( service[t], signal_id );
   } else {
      var message = new Buffer(service+":"+signal_id);
      broadcaster.send( message, 0, message.length, 42002, "239.255.0.1");
   }
};

/** ----------------------------------------------------------------------------
 * Breaks down messages recieved over the network and providea the requested 
 * service for the specified model.
 * @param  {Buffer} message The contents of the message.
 * @param  {object} remote  [Network info about the sender]
 * -------------------------------------------------------------------------- */
 
var run = function(req, next){

   // TODO: Check that the service is available.

   /** ----------------------------------------------------------------------------
   * Finds the signal to be serviced by it's id from the message, 
   * @param   {String} parent_id
   * @return  {String} err
   * -------------------------------------------------------------------------- */

   var service = req.service;
   var parent_id = req.parent_id;

   Signal.findOrCreate({ _id:parent_id },

   function(err, signal){

      Signal.create({ parent_id:parent_id, service: req.services },
         function(err, new_signal){

         // Attach broadcast to signal
         signal.broadcast = broadcast;

         // Load the service module
         var mod = require(__dirname+'/services/'+service+".js");

         // Execute the service
         mod.run( signal, function(err, result){

            new_signal.data = result;
            new_signal.save(function(err, res){
               console.log(err || "SAVED", signal);
            });
         });
      });
   });
};

var q = async.queue( run, os.cpus().length );

broadcaster.on('message', function(message, remote){

   // Turn buffer into an array of strings
   var req = {}, args = message.toString().split(":");
   req.service = args[0];
   req.parent_id = args[1];

   // push the service to the queue
   q.push(req, function (err, result) {
      console.log(result);
   });
});

var test = function(service, fn ){

   var image_location  = path.join( __dirname , "/examples/group.jpg");

   Signal.create({

      name:"Face Detection Test",
      type:"HEAD",
      data:image_location,
      services_needed:["consume_image","face_detection"],

   }, function(err, signal){
      
      console.log(err || "CREATED", signal);
      var service = service || "consume_image";
      var message = new Buffer( service +":"+ signal._id );
      broadcaster.send(message, 0, message.length, 42002, "239.255.0.1");
   });
};

_.delay(test, 1000, "find_faces");

module.exports.test = test;

