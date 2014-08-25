/**
 * SystemController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  bounce:function(req, res){

    System.find({}).done(function(err,systems){
      for (var i = 0; i < systems.length; i++) {
        console.log("DESTROYED:", systems[i].id)
        System.publishDestroy(systems[i].id)
        System.destroy(systems[i].id, function(e,a){
        })
      }
    })
    return res.send("success");
  },


  active:function(req, res){
    var d = new Date();
    d.setTime(d.getTime() - 1)
    System.find( {updatedAt: { "<" : d }}, function(err,sys){
      return res.send( "success" )
    })
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SystemController)
   */
  _config: {}

  
};
