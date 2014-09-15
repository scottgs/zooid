/**
 * System
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


var Axon = require('axon');
var ganglion = Axon.socket('pull');
ganglion.bind(42001);

ganglion.on('message', function( signal ){

  System.find({name:signal.name}, function(err,sig){
    console.log(err || sig);
    if(sig.length){
      console.log("UPDATING", sig[0])
      System.update( {id:sig[0].id}, signal ).exec(function(err,updated){
        console.log(err, updated)
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




var moment = require("moment");

module.exports = {

  attributes: {
  
  new_actions:{type:"integer", defaultsTo:0 },
  total_actions:{ type:"integer" },
  last_update:{ type: "integer", defaultsTo: function(){ return moment().valueOf();} },

  toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).calendar();
      // delete obj.type;
      // delete obj.updatedAt;
      // delete obj.createdAt;
      return obj;
    }


   /* e.g.
   nickname: 'string'
   */
    
  },

  beforeUpdate: function(record, next){
    var update = moment().valueOf();
    record.last_update = update
    next();
  },

};
