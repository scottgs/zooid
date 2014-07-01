var broadcaster = require('dgram').createSocket('udp4');
var moment = require("moment");
broadcaster.bind(42002, '239.255.0.1'); // port, ip

broadcaster.on('listening', function () {
   var address = broadcaster.address();
   console.log('UDP broadcaster listening on ' + address.address + ":" + address.port);
   broadcaster.setBroadcast(true);
   broadcaster.setMulticastTTL(128);
   broadcaster.addMembership('239.255.0.1');
});

var broadcast = function(signal){
  var service = signal.service || signal.method || "none";

  var message = new Buffer(service+":"+signal.id);
  console.log("broadcasting: ",message);
  broadcaster.send( message, 0, message.length, 42002, "239.255.0.1");
};

broadcaster.on("message", function (msg, rinfo) {
   // Turn buffer into an array of strings
   var req = {}, args = msg.toString().split(":");
   req.service = args[0];
   req.parent_id = args[1];
   console.log("Overmind got message: ", req)
   var address = broadcaster.address();
   var out = new Buffer('OVERMIND:' + address.address + ":" + address.port);

   if(req.service === "cqcq") broadcast( out );

});


/**
 * Signal
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var crypto = require("crypto");
var _ = require("underscore");

module.exports = {

  attributes: {

    // _id:'ObjectId'

    toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).fromNow();
      // delete obj.type;
      delete obj.updatedAt;
      delete obj.createdAt;
      return obj;
    }

  },

  adapter: 'mongo_adapter',

  beforeCreate: function(values, next) {
    // var entropy = _.reduce( values, function(n, k){ return k + ";Ec.Q"}) + _.now();
    // var hash = crypto.createHash("md5")
    // .update( new Buffer( entropy ) )
    // .digest("hex")
    // values.id = hash
    // values._id = hash
    next();
  },

  afterCreate: function(record, next){
    console.log('Created Signal: ', record);
    if (record.service) broadcast(record);
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


