var broadcaster = require('dgram').createSocket('udp4');

broadcaster.bind(42002, '239.255.0.1'); // port, ip

broadcaster.on('listening', function () {
   var address = broadcaster.address();
   console.log('UDP broadcaster listening on ' + address.address + ":" + address.port);
   broadcaster.setBroadcast(true);
   broadcaster.setMulticastTTL(128);
   broadcaster.addMembership('239.255.0.1');
});

var broadcast = function(noun, signal_id){
   if( typeof noun === 'undefined' ) return;
   if(Object.prototype.toString.call( noun ) === '[object Array]'){
      for (var t = noun.length - 1; t >= 0; t--) broadcast( noun[t], signal_id );
   } else {
      var message = new Buffer(noun+":"+signal_id);
      broadcaster.send( message, 0, message.length, 42002, "239.255.0.1");
   }
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
    console.log('Created new signal: ',record);
    broadcast(record.name, record.id);
    next();
  },
  afterUpdate: function(record, next){
    console.log('Updated signal: ',record);
    next();
  },
    afterDestroy: function(record, next){
    console.log('Destroyed signal: ',record);
    next();
  },
};
