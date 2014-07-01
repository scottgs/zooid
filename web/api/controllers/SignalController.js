/**
 * SignalController
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
    
  
   pretty:function(req, res) {

      console.log(req.ip);

      Signal.find()
         .where({ type: "HEAD"})
         .sort("createdAt DESC")
         .limit(1)
         .done(function (err, signals) {

         if (err) return res.send(err,500);
         if (!signals) return res.send("Specified signal doesn't exist", 404);
         // if (signal.services.length <= 0) return res.send("Nothing to do here anymore.", 403);
         res.send(signals)
      });
  },

   findChildren:function(req, res) {
      console.log(req);
      var pid = req.param('parent_id')
      Signal.find( { parent_id: pid } ).done(function (err, signals) {
         if (err) return res.send(err,500);
         if (!signals) return res.send("Specified signal doesn't exist", 404);
         // if (signal.services.length <= 0) return res.send("Nothing to do here anymore.", 403);
         res.send(signals)
      });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SignalController)
   */
  _config: {}

  
};
