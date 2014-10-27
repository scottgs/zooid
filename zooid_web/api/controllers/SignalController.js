/**
 * SignalController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 */


var fs = require("fs")
var crypto = require("crypto")
var path = require("path")
var _ = require("underscore")

var request = require("request")

/**
 * Downloads content based on it's URL as fed into the system.
 * @param  {String}   uri      The location of the content to be downloaded
 * @param  {String}   filename The name of the file you'd like to create.
 * @param  {Function} next     Callback function
 * @return {Object}            Response
 */

function download(uri, filename, next){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', function(a,b,c){
      next(a,b,c)
    });
  });
};


module.exports = {
    
  /**
   * Performs a basic test with a fake signal.
   * @param  {Object} req 
   * @param  {Object} res 
   * @return {socket response}
   */
  
  test: function(req,res){
    Signal.create({text:"<h4>System Test</h4>",noun:"test"}, function(err, result){
      Signal.publishCreate( result.toJSON() )
      return res.send(res.id)
    })
  },

  /**
   * Cleans up the database. Seriously. Don't mess with this unless 
   * you are willing to lose everything.
   * @param  {Object} req 
   * @param  {Object} res 
   * @return {socket response}     
   */
  
  clean: function(req,res){

      /**
       * Finds all the signals.
       */
      
      Signal.find({})
         .limit(5000)
         .done(function (err, signals) {

          /**
           * Walks over the signals return and deletes
           * each and every one of them.
           * @param  {Array}  signals
           * @param  {Signal} signal
           * @return null
           */
          
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

    /**
     * Checks if it's an image that is being linked to.
     * @type {[type]}
     */
    
    if( ext == "jpg" || ext == "JPG" || ext == "JPEG" || ext == "png"){

      // var getMeArray = getMe.explode(" ")
      // if(getMeArray.length)
        // TODO do for each

      /**
       * Configures paths and names and what not.
       * @type {[type]}
       */
      
      var hash = crypto.createHash('md5').update(url).digest('hex')
      var newPath = path.join( __dirname, "../../.tmp/public/files/" )
      var filename = ""+hash+"."+ext
      var fullPath = newPath + filename

      console.log(newPath)

      /**
       * Creates new signal
       * @type {Object}
       */
      
      newSignal = {
            name : "?"
          , noun : "new_signal"
          , location : newPath
          , filename : filename
      }

      /**
       * Downloads the things
       * @return null
       */
      
      download( url, fullPath, function(){
        res.send({ model:"signal", verb:"create", data:newSignal });
          Signal.create(newSignal).done( function(err, result){
            if(!err)Signal.publishCreate( result.toJSON() )
          })
      })
    
    } else {

      /**
       * Not an image, must be a web page.
       * @type {Object}
       */
    
      newSignal = {
          name : "?"
          , noun : "web_page"
          , url : url
      }

      Signal.create(newSignal).done( function(err, result){
        if(!err) Signal.publishCreate( result.toJSON() )
        res.send({ model:"signal", verb:"create", id:res.id });
      })
    }
  },


  /**
   * Saves things locally from POST or GET requests
   * @param  {Object} req 
   * @param  {Object} res 
   * @return null
   */
  
  upload: function(req, res) {

    
    console.log("RECIEVING UPLOAD")
   
    // TODO -- Store file in mongo instead of in filesystem ?
 
    // TODO Async quee instead of run

    // console.log(req.files);
    fs.readFile(req.files.file.path, function (err, data) {
      if(err) return res.send(err);

      var hash = crypto.createHash('md5').update(JSON.stringify(req.files.file)).digest('hex')

      /**
       * Configures paths and names and what not.
       * @type {[type]}
       */
      
      var newPath = path.join( __dirname, "~/zooid/data/" )
      var filename = ""+hash+".jpg"
      var fullPath = path.join( newPath, filename );
      console.log( "WRITING FILE TO:", newPath );

      /**
       * Writes the file to the path.
       * @param  {String}  path
       * @param  {Object}  data
       * @return null
       */
      
      fs.writeFile(fullPath, data, function (err) {

        newSignal = {
            name : "Input signal"
            , noun : "new_signal"
            , type : "HEAD"
            , location : newPath
            , filename : filename
        }

        /**
         * Creates and publishes the signal.
         * @param  {String} err    
         * @param  {Object} result 
         * @return  {socket response}
         */
        
        Signal.create(newSignal).done( function(err, result){
          Signal.publishCreate( result.toJSON() )
          var id = result.id
            return res.send(err,result);
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
