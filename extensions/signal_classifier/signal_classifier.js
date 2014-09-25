var request = require('request')
var moment = require('moment')
var fs = require("fs")

var cheerio = require('cheerio')
, format = require('util').format
, crypto = require("crypto")
, path = require("path");

var merge = require('merge')
var zooid = require("../../zooid_core")

var zode = merge( require("./package.json"), { 
    takes:"new_signal"
  , gives:"web_page, image, web_image"
  , status:"?"
  , ip:zooid.ip||'unknown'
  , work:0
  , actions:0 
})

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})

zooid.muster(zode)
console.log(zode.name)



var download = function(uri, filename, next){
  request.head(uri, function(err, res, body){
    if(err) next("error")
    request(uri).pipe(fs.createWriteStream(filename))
      .on('close', function(a,b,c){
        next()
      })
      .on('err', function(a,b,c){
        next()
      })
  });
};


// TODO - check what stuff is.



zooid.on('test', function(signal){
  zode.status="active"
  zooid.muster(zode)
  zooid.send({ parent_id:signal.id, name:zode.name, text:"okay"})
});


zooid.on('new_signal', function(data){

  var start = moment().valueOf();
  zode.actions+=1
  console.log(data)

  data.noun = "image"
  data.name = "Image"
  data.parent_id = data.id
  data.hide = true
  delete data.id
  zooid.fire(data)

  var stop = moment().valueOf();
  zode.work += stop - start
  zooid.muster(zode)
});


zooid.on("web_page", function(signal){

  var start = moment().valueOf();

  var cheerio = require('cheerio')
  , format = require('util').format;

    request( signal.url, function (err, response, body) {
      if (err) zooid.fire( err );
      var $ = cheerio.load(body);


      $('a.title').each(function () {

        var url = $(this).attr('href');
        var ext = url.split('.').pop() 

        if( ext == "jpg" || ext == "JPG" || ext == "JPEG" || ext == "png"){
          zooid.fire({ 
            parent_id:signal.id
            , name:$(this).text()
            , src:$(this).attr('src') 
            , noun:"web_image" 
          })

        } else {

          zooid.fire({ 
            parent_id:signal.id
            , name:$(this).text()
            , href:$(this).attr('href')
          })

        }
      });


      $('img').each(function() {

        var url = $(this).attr('src');
        var name = $(this).attr('title');
        var ext = url.split('.').pop() 

        if( ext == "jpg" || ext == "JPG" || ext == "jpeg" || ext == "JPEG" || ext == "png"){

          zooid.fire({ 
            parent_id:signal.id
            , name:name
            , src:$(this).attr('src') 
            , noun:"web_image" 
          })

          console.log("getting web image")
          var start = moment().valueOf();
          var url = "http://"+signal.src

          var hash = crypto.createHash('md5').update(url).digest('hex')
          var newPath = path.join( __dirname, "../../web/.tmp/public/files/" )
          var filename = ""+hash+".jpg"
          var fullPath = newPath + filename

          download( url, fullPath, function(err,b){

            console.log(err,b)

            newSignal = {
                name : "Web Image"
                , noun : "image"
                , location : newPath
                , filename : filename
            }

            var stop = moment().valueOf();
            zode.work += stop - start

            zooid.muster(zode)
            zooid.send(newSignal)

          })
        } 
      });

      var stop = moment().valueOf();
      zode.work += stop - start
      zooid.muster(zode)

    });
})



// zooid.on("web_image", function(signal){


// })



