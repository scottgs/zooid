var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/signals');

var crypto = require('crypto');
var _ = require('underscore')

var random = function(e){
   return crypto.createHash("md5")
      .update( new Buffer(  _.now().toString() ) )
      .digest("hex");
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log( "db connected" );
   // console.log(db.collections)
});

var signalSchema = mongoose.Schema({ 
   data: 'Mixed',
   location:'String',
   service:'Mixed',
   method:'Mixed',
   services:'Mixed',
   result:'Mixed',
   config:'Mixed',
   parent_id:'Mixed',

   transforms: { type: Array, default: [] }
});


signalSchema.methods.spit = function(){
   console.log( 'name: ', this.data || "none");
   console.log( 'in: ', this.data || "none");
   console.log( 'out: ', this.result || "none");
   console.log( 'transform: ', this.transforms || "none");
   console.log( 'createdAt: ', this.createdAt || "none");
}

Signal = mongoose.model('Signal', signalSchema);

// Signal.find({}).exec( console.log );

module.exports = Signal



// var Waterline = require('waterline');
// // var disk = require('sails-disk');
// var mongo = require('sails-mongo');
// // var disk = require('sails-mongo');
// var crypto = require('crypto');
// var _ = require('underscore')

// // Define your collection (aka model)
// var Signal = Waterline.Collection.extend({


//   // Set schema true/false for adapters that support schemaless
//   schema: false,
//   tableName: 'signal',
//   attributes: {

//     _id: {
//       type: 'string',
//       defaultsTo: 'a'
//     },

//   },

//   *
//    * Lifecycle Callbacks
//    * Run before and after various stages:
//    * beforeValidate
//    * afterValidate
//    * beforeCreate
//    * beforeUpdate
//    * afterUpdate
//    * afterCreate
//    * beforeDestroy
//    * afterDestroy
   

//   // Lifecycle Callbacks
//   beforeCreate: function(values, next) {
//     var entropy = _.reduce( values, function(n, k){ return k + ";Ec.Q"}) + _.now();
//     var hash = crypto.createHash("md5")
//     .update( new Buffer( entropy ) )
//     .digest("hex")
//     values._id = hash
//     next();
//   },


// });

// new Signal({ tableName: 'signal', adapters: {
//   'default': 'mongo',
//   mongo: {
//     module: 'sails-mongo',
//     host: 'localhost',
//     port: 27017,
//     user: 'bakerbp',
//     password: 'password',
//     // database: 'your mongo db name here'
//   }
// }}, function(err, Model){
//   module.exports = Model;
// });



