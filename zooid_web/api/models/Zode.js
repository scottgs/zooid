
/**
 * System
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */


var Axon = require('axon');
var ganglion = Axon.socket('pull');
var moment = require("moment");


/**
 * Creates a socket for managing zodes and binds to it.
 * @type {Socket Object}
 */

var ganglion = Axon.socket('pull');

ganglion.bind(42001);

ganglion.on('message', function( signal ){

  Zode.find({name:signal.name, ip:signal.ip}, function(err,zode){
    // console.log(err || zode);
    if(zode.length){
      // console.log("UPDATING", zode[0])
      Zode.update( {id:zode[0].id}, signal ).exec(function(err,updated){
        // console.log(err, updated)
        if(zode[0].actions != signal.actions || zode[0].status != signal.status)
          Zode.publishUpdate( zode[0].id, signal );
      })
    } else {
      Zode.create( signal, function(err, res){
        // console.log("UPDATING" + err || res)
        if(res) Zode.publishCreate( res.toJSON() )
      })
    }
  })
})


module.exports = {

  attributes: {
    
    new_actions:  { type: "integer", defaultsTo:0 },
    total_actions:{ type: "integer" },
    ip:{ type: "string", defaultsTo:"unknown" },
    last_update:  { type: "integer", defaultsTo: function(){ 
        return moment().valueOf();
      } 
    },

    toJSON: function() {
        var obj = this.toObject();
        obj.created = moment( obj.createdAt ).calendar();
        return obj;
    }
  },

  beforeUpdate: function(record, next){
    var update = moment().valueOf();
    record.last_update = update
    next();
  },

};



