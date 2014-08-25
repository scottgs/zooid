/**
 * System
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
    record.last_report = moment().valueOf();
    next();
  },

};
