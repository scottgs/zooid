
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

module.exports = {

  attributes: {
    
    new_actions:  { type: "integer", defaultsTo:0 },
    total_actions:{ type: "integer" },
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



