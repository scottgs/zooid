(function(){

/**
 * Signal
 * @module      :: Model
 * @description :: Defines the routing and handling os sensory stimulation.
 */

/**
 * Brings in dependencies
 * @type {Object}
 */
var dependencies;
var crypto = require("crypto")
var _      = require("underscore");
var moment = require("moment")
var timers = require("timers")
var Axon   = require('axon')
var path   = require("path")
var fs     = require("fs")

/**
 * Creates a socket for publishing and binds to it.
 * @type {Socket Object}
 */

var axon = Axon.socket('pub-emitter');
axon.bind(42002);

/**
 * Creates a socket for pulling and binds to it.
 * @type {Socket Object}
 */

var dendrites = Axon.socket('pull');
dendrites.bind(42003);

/**
 * Provides throught this socket access to the
 * perceptual model of the whole organism.
 * @param  {Object} signal [description]
 * @return {[type]}        [description]
 */
dendrites.on('message', function( signal ){
  Signal.create( signal, function(err, res){
    if(res) Signal.publishCreate(res.toJSON() )
  })
});

/**
 * Logs everything over the socket.
 * @param  {String} event The listener
 * @return null
 */
dendrites.on('*', function(event){
  // console.log(arguments);
});




/**
 * Runs tests obnoxiously often.
 */

// setInterval(function(){
//   // axon.emit('test', { name: 'testing' });
//   Signal.create({noun:"test"}, function(err, res){
//     Signal.publishCreate( res.toJSON() )
//   })
// }, 5000);


// v1.on('zode:*', function( actionk, name, zode ){

//   console.log(name, zode)

//   Zode.findOne({ name:name }).exec(function(err,zode){
//     if(zode){
//       console.log(zode)
//       Zode.update( zode.id, { 
//           status:"ACTIVE"
//         , new_actions:zode.actions
//         , last_update: moment().valueOf()
//       }, function(err, sys){
//         if (err) 
//           console.log("ERR",err)
//         if (sys.length) 
//           sys = sys[0]
//         Zode.publishUpdate( zode.id, sys.toJSON() )
//       })
//     } else {
//       Zode.create({ 
//           name:name
//       }).done( function(err,sys){
//         if(sys) 
//           zode.publishCreate(sys.toJSON())
//       })
//     }
//   });
// });






/**
 * Defines the heuristics for zode muster control.
 * @type {Number} muster_interval    How frequently to muster.
 * @type {Number} TTL                Time to persist an isntance.
 */

var muster_interval = 15  // seconds
var TTL             = 30  // seconds

/**
 * Periodically checks the state of the zooid and updates
 * the model accordingly. Truth is maintained within the TTL 
 * accuracy threshold.
 * @return null
 */

timers.setInterval(function muster(){
  
  axon.emit( "muster", { parent:"this ip or something." } )

  /**
   * Sets the age at which things should definitely be dead.
   * @type {Number}
   */
  
  var senescence = moment().valueOf() - (TTL*1000)

  /**
   * Finds all the things older than that age.
   * @logic   last_update < senescence
   * @type {Object}
   */
  
  Zode.find( { last_update: { "<" : senescence }})
    .limit(100)
    .exec(function(err, zodes) {

      /**
       * Walks array for each expired node.
       * @param  {Array} zodes  [expired nodes array.]
       * @return null
       */
      
      _.map(zodes, function(zode){ 

        Zode.publishUpdate( zode.id, { color:"warning", status:"Not responding..." }, function(err,s){
          console.log(err || s);
        })
        
        /**
         * Kill the zode.
         * @param  {Number}    zode.id  the id of the model instance to be destroyed.
         * @param  {Function}  s   Callback
         * @return null
         */
        
        Zode.destroy( zode.id, function(err,s){
          if(!err) Zode.publishDestroy( zode.id )
        })
        
      });
  });
}, muster_interval*1000);



module.exports = {

  attributes: {

    date:{ type: "integer", defaultsTo: function(){ return moment().valueOf();} },

    /**
     * Sanitizes or normalizes json object from model isntance.
     * @return null
     */
    
    toJSON: function() {
      var obj = this.toObject();
      obj.created = moment( obj.createdAt ).fromNow();
      // delete obj.type;
      delete obj.updatedAt;
      // delete obj.createdAt;
      return obj;
    }
  },

  /**
   * Specifies adapter for database.
   * @type {String}
   */
  
  // adapter: 'srs9mongo',

  /**
   * Modifies model instance BEFORE it is created.
   * @param  {Object}   signal  The peoperties of the instance.
   * @param  {Function} next    Callback function
   * @return null
   */
  
  beforeCreate: function(signal, next) {
    next();
  },

  /**
   * Modifies model instance AFTER it is created.
   * @param  {Object}   signal  The peoperties of the instance.
   * @param  {Function} next    Callback function
   * @return null
   */
  
  afterCreate: function(signal, next){
    
    if(signal.noun){
      console.log("Chunk down")
      axon.emit( signal.noun, signal );
    }

    if(signal.parent_id){
      console.log("Chunk up")
      axon.emit( signal.parent_id, signal );
    }

    next();
  },

  /**
   * Modifies model instance AFTER it is UPDATED.
   * @param  {Object}   signal  The peoperties of the instance.
   * @param  {Function} next    Callback function
   * @return null
   */
  
  afterUpdate: function(signal, next){
    next();
  },

  /**
   * Modifies model instance AFTER it is destroyed.
   * @param  {Object}   signal  The peoperties of the instance.
   * @param  {Function} next    Callback function
   * @return null
   */

  afterDestroy: function(signal, next){
    next();
  },
};

}).call()
