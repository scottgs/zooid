/**
 * SignalController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 */


var fs = require("fs")
var crypto = require("crypto")
var path = require("path")
var _ = require("underscore")

var request = require("request")

var download = function(uri, filename, next){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', function(a,b,c){
      next(a,b,c)
    });
  });
};


module.exports = {
    
  test: function(req,res){
    Signal.create({text:"<h4>System Test</h4>",noun:"test"}, function(err, result){
      Signal.publishCreate( result.toJSON() )
      return res.send(res.id)
    })
  },

  clean: function(req,res){
      Signal.find()
         .limit(5000)
         .done(function (err, signals) {
          _.map(signals, function(signal){
            console.log("deleting", signals.length)
            Signal.destroy(signal.id, function(err, res){
              console.log(err, res);
            })

          })
          return res.send("Cleaned...")
      })
  },



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


  getURL: function(req, res){


    var url = req.body.getURL

    var ext = url.split('.').pop() 

    if( ext == "jpg" || ext == "JPG" || ext == "JPEG" || ext == "png"){

      // var getMeArray = getMe.explode(" ")
      // if(getMeArray.length)
        // TODO do for each

      var hash = crypto.createHash('md5').update(url).digest('hex')

      var newPath = path.join( __dirname, "../../.tmp/public/files/" )
      var filename = ""+hash+"."+ext
      var fullPath = newPath + filename

      console.log(newPath)


      newSignal = {
            name : "?"
          , noun : "new_signal"
          , location : newPath
          , filename : filename
      }


      download( url, fullPath, function(){

        res.send({ model:"signal", verb:"create", data:newSignal });

          Signal.create(newSignal).done( function(err, result){
            if(!err)Signal.publishCreate( result.toJSON() )

          })
      })
    
    } else {

        newSignal = {
            name : "?"
            , noun : "web_page"
            , url : url
        }

        Signal.create(newSignal).done( function(err, result){
          if(!err) 
            Signal.publishCreate( result.toJSON() )
            res.send({ model:"signal", verb:"create", id:res.id });
        })

      }
  },


  upload: function(req, res) {

    // TODO -- Store file in mongo instead of in filesystem ?
    
    // TODO Async quee instead or run


    // console.log(req.files);
    fs.readFile(req.files.file.path, function (err, data) {
      if(err) return res.send(err);

      var hash = crypto.createHash('md5').update(JSON.stringify(req.files.file)).digest('hex')

      var newPath = path.join( __dirname, "../../.tmp/public/files/" )
      var filename = ""+hash+".jpg"
      var fullPath = path.join( newPath, filename );
      console.log( "WRITING FILE TO:", newPath );

      fs.writeFile(fullPath, data, function (err) {

        newSignal = {
            name : " ? "
            , noun : "new_signal"
            , type : "HEAD"
            , location : newPath
            , filename : filename
        }

        Signal.create(newSignal).done( function(err, result){
          Signal.publishCreate( result.toJSON() )
          var id = result.id
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
