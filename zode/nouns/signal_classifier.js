var request = require('request')
var fs = require("fs")

var download = function(uri, filename, next){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename))
      .on('close', function(a,b,c){
        next()
      })
  });
};

// TODO - check what stuff is.


module.exports = function(zode){

  zode.on('new_signal', function(data){

    console.log(data)

    data.noun = "image"
    data.name = "Image"
    data.parent_id = data.id
    data.hide = true
    delete data.id
    zode.fire(data)
  });


  zode.on("web_page", function(signal){

    var cheerio = require('cheerio')
    , format = require('util').format;


      request( signal.url, function (err, response, body) {
        if (err) zode.fire( err );
        var $ = cheerio.load(body);


        $('a.title').each(function () {

          var url = $(this).attr('href');
          var ext = url.split('.').pop() 

          if( ext == "jpg" || ext == "JPG" || ext == "JPEG" || ext == "png"){
            zode.fire({ 
              parent_id:signal.id
              , name:$(this).text()
              , src:$(this).attr('src') 
              , noun:"web_image" 
            })
          }


          zode.fire({ 
            parent_id:signal.id
            , name:$(this).text()
            , href:$(this).attr('href')
            , text:$(this).attr('href')
          })
        });

      });


  })



  zode.on("web_image", function(signal){

    var cheerio = require('cheerio')
    , format = require('util').format
    , crypto = require("crypto")
    , path = require("path");

    var url = "http://"+signal.src

    var hash = crypto.createHash('md5').update(url).digest('hex')
    var newPath = path.join( __dirname, "../../web/.tmp/public/files/" )
    var filename = ""+hash+".jpg"
    var fullPath = newPath + filename

    download( url, fullPath, function(err, done){

      console.log(err,done)

        newSignal = {
            name : "New Image"
            , noun : "image"
            , location : newPath
            , filename : filename
        }

        Signal.create(newSignal).done( function(err, result){
          Signal.publishCreate( result.toJSON() )
          var id = result.id
          zode.fire(result);
        })
    })
  })






}