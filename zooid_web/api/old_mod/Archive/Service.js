/**
 * Service
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var moment = require("moment");

module.exports = {

  attributes: {
  
   toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).fromNow();
      // delete obj.type;
      delete obj.updatedAt;
      delete obj.createdAt;
      return obj;
    }


  	/* e.g.
  	nickname: 'string'
  	*/
    
  }

};
