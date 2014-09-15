(function(){





var fs = require("fs")
var crypto = require("crypto")
var path = require("path")

var Axon = require('axon');
var axon = Axon.socket('pub-emitter');
axon.bind(42002);

// setInterval(function(){
//   // axon.emit('test', { name: 'testing' });
//   Signal.create({noun:"test"}, function(err, res){
//     Signal.publishCreate( res.toJSON() )
//   })
// }, 5000);

var dendrites = Axon.socket('pull');
dendrites.bind(42003);

dendrites.on('message', function( signal ){
  console.log( signal );
  Signal.create( signal, function(err, res){
    console.log(err || res)
    if(res) Signal.publishCreate(res.toJSON() )
  })
});



  // dendrites.on('*', function(event){
  //   console.log(arguments);
  // });









// v1.on('zode:*', function( actionk, name, zode ){

//   console.log(name, zode)

//   System.findOne({ name:name }).exec(function(err,system){
//     if(system){
//       console.log(system)
//       System.update( system.id, { 
//           status:"ACTIVE"
//         , new_actions:zode.actions
//         , last_update: moment().valueOf()
//       }, function(err, sys){
//         if (err) 
//           console.log("ERR",err)
//         if (sys.length) 
//           sys = sys[0]
//         System.publishUpdate( system.id, sys.toJSON() )
//       })
//     } else {
//       System.create({ 
//           name:name
//       }).done( function(err,sys){
//         if(sys) 
//           System.publishCreate(sys.toJSON())
//       })
//     }
//   });
// });

// v1.on('*', function( verb, zode ){
//   console.log(verb, zode );
//   System.create(zode, function(err, sys){
//   })
// });

// v1.on('zode:update:*', function( name, zode ){
//   System.update(name, zode)
//   console.log(name, zode);
// });




var _      = require("underscore");
var moment = require("moment");
var timers = require("timers");

// MUSTER AND DELETE DEAD NODES FROM THE MODEL

var muster_interval = 30  // seconds
var TTL             = 89  // seconds



timers.setInterval(function muster(){
  
  axon.emit( "muster", { parent:"this ip or something." } )

  var senescence = moment().valueOf() - (TTL*1000)
  console.log("Killing older than: ", senescence );

  System.find( { last_update: { "<" : senescence }})
    .limit(100)
    .exec(function(err, sigs) {
      console.log("EXPIRED NODES: ", sigs.length);
      _.map(sigs, function(sig){ 
        // System.publishUpdate( sig.id, { color:"warning", status:"Not responding..." }, function(err,s){
        //   console.log(err || s);
        // })
        console.log("LOST COMMS WITH: ", sig.id);
        System.destroy( sig.id, function(err,s){
          if(!err) System.publishDestroy( sig.id )
        })
      });
  });
}, muster_interval*1000);





/**
 * Signal
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {

  attributes: {

    date:{ type: "integer", defaultsTo: function(){ return moment().valueOf();} },


    toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).fromNow();
      // delete obj.type;
      delete obj.updatedAt;
      // delete obj.createdAt;
      return obj;
    }
  },

  adapter: 'mongo_adapter',

  beforeCreate: function(values, next) {
    next();
  },

  afterCreate: function(signal, next){
    if(signal.noun || !signal.hide) 
      axon.emit( signal.noun, signal );
    next();
  },

  afterUpdate: function(record, next){
    next();
  },
    afterDestroy: function(record, next){
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
}).call()