var broadcaster = require('dgram').createSocket('udp4');

broadcaster.bind(42002, '239.255.0.1'); // port, ip

broadcaster.on('listening', function () {
   var address = broadcaster.address();
   console.log('UDP broadcaster listening on ' + address.address + ":" + address.port);
   broadcaster.setBroadcast(true);
   broadcaster.setMulticastTTL(128);
   broadcaster.addMembership('239.255.0.1');
});

var broadcast = function(signal){
  var service = signal.service;
  if( typeof service === 'undefined' ){
    return console.warn('signal.service === undefined');
  }
  var id = signal.id;
  var message = new Buffer(service+":"+id);
  console.log(service);
  broadcaster.send( message, 0, message.length, 42002, "239.255.0.1");
};

broadcaster.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
});


/**
 * Signal
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


//  Callbacks run on Create:
// - beforeValidation / *fn(values, cb)*
// - beforeCreate / *fn(values, cb)*
// - afterCreate / *fn(newlyInsertedRecord, cb)*
// Callbacks run on Update:
// - beforeValidation / *fn(valuesToUpdate, cb)*
// - beforeUpdate / *fn(valuesToUpdate, cb)*
// - afterUpdate / *fn(updatedRecord, cb)*
// Callbacks run on Destroy:
// - beforeDestroy / *fn(criteria, cb)*
// - afterDestroy / *fn(cb)*

module.exports = {

  attributes: {



  },

  afterCreate: function(record, next){
    console.log('Created Signal: ',record);
    broadcast(record);
    next();
  },
  afterUpdate: function(record, next){
    console.log('Updated Signal: ',record);
    next();
  },
    afterDestroy: function(record, next){
    console.log('Destroyed Signal: ',record);
    next();
  },
};
