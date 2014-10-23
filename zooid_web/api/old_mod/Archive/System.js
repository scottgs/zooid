/**
 * System
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


var Axon = require('axon');
var ganglion = Axon.socket('pull');
var moment = require("moment");

ganglion.bind(42001);

ganglion.on('message', function( signal ){

  System.find({name:signal.name, ip:signal.ip}, function(err,sig){
    console.log(err || sig);
    if(sig.length){
      console.log("UPDATING", sig[0])
      System.update( {id:sig[0].id}, signal ).exec(function(err,updated){
        console.log(err, updated)
        if(sig[0].actions != signal.actions || sig[0].status != signal.status)
          System.publishUpdate( sig[0].id, signal );
      })
    } else {
      System.create( signal, function(err, res){
        console.log("UPDATING" + err || res)
        if(res) System.publishCreate( res.toJSON() )
      })
    }
  })
})


module.exports = {

  attributes: {
  
  new_actions:  { type:"integer", defaultsTo:0 },
  total_actions:{ type:"integer" },
  last_update:  { type: "integer", defaultsTo: function(){ 
    return moment().valueOf();} 
  },

  toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).calendar();
      // delete obj.type;
      return obj;
    }
  },

  beforeUpdate: function(record, next){
    var update = moment().valueOf();
    record.last_update = update
    next();
  },

};
