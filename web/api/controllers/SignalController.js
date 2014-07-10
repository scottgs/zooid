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


var fs = require("fs")
var crypto = require("crypto")
var path = require("path")

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


  upload: function(req, res) {

    console.log(req.files);

    fs.readFile(req.files.file.path, function (err, data) {

        // if(err) res.send(err);

        var hash = crypto.createHash("md5")
          .update("o"+Math.random()+req.files.file.path)
          .digest("hex");

        var newPath = path.join( __dirname, "../../.tmp/public/files/" )
        var filename = hash+".jpg"
        var fullPath = path.join( newPath, filename );
        console.log( "WRITING FILE TO:", newPath );

        fs.writeFile(fullPath, data, function (err) {

          console.log(err || "FILE WAS SAVED");

          newSignal = {

              name: "IMAGE TEST",
              location      :newPath,
              filename      :filename,
              service       :"IMAGE",
              type          :"HEAD",
            }

          Signal.create(newSignal).done( function(err, result){
            
            Signal.publishCreate({id:result.id, location:result.location, filename:result.filename  , service:result.service  , type:result.type })
            console.log("New Signal");
            console.log("err", err);
            console.log(result);

            return res.send("success");

          })
      });
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SignalController)
   */
  _config: {}

  
};
