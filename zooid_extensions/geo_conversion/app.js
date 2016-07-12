  
/**
* Processes signature from the input path and responds with an llos
* which contains an array4of llos'
* @param  {[type]} searchSquiggle
* @return {[Array<clusterResults>]} signal
*/

var merge  = require("merge")
var moment = require("moment")

var zooid = require("../../zooid_core")

var zode = merge( require("./package.json"), { 
    name:"Geo Conversion"
  , takes:"geolocation"
  , gives:"geojson, kml"
  , status:"?"
  , ip:zooid.ip||'unknown'
  , work:0
  , actions:0 
})



zooid.on( "geolocation", function(signal){
  console.log("CONVERTING GEOs", signal.geolocation)
  zode.actions+=1
  var start = moment().valueOf();
  
  if( typeof signal.geolocation == "undefined" || signal.geolocation.length < 1){
    console.log("no geo data rcvd.")
    return 0;
  } else{
    convertFromGeolocation(signal.geolocation, function(err, geojson){
      zooid.send({ parent_id:signal.id, name:"geojson", geojson:geojson, noun:"geojson", text:err })
        var stop = moment().valueOf();
        zode.work += stop - start
        zooid.muster(zode)
    
    });
  }
});


zooid.on( "test", function(signal){

  var start = moment().valueOf();
  zode.actions+=1

  console.log("CONVERTING GEOs")
  convertFromGeolocation(signal.geolocation, function(err, fake_geo){
    zooid.send({ parent_id:signal.id, name:"geojson", geojson:geojson, noun:"geojson", text:err })
    var stop = moment().valueOf();
    zode.work += stop - start
    zooid.muster(zode)
  });
});

console.log(zode.name, "intiated on",zooid.ip)

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})

zooid.muster(zode)

GeoJSON     = require( "geojson" )
tokml       = require( "tokml" )
Terraformer = require( "terraformer" )

createFile = function(fn, fd) {

var fs = require('fs');
fs.writeFile(fn, fd, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("file saved.");
    }
});
}


function convertFromGeolocation(obj, done){

  for (var i in obj ) {

    var name = obj[i].name || obj.id

    obj[i].name="llos" + i + 
      " - heading: " + Math.floor( obj[i].orientation * 1000) / 1000 + "˚" +
      " - score: " + Math.floor( obj[i].score * 1000) / 1000;

    var polygon = [];
    polygon.push( [ obj[i].lat, obj[i].lon ] )
    
    for (var j in obj[i].points ) {
      polygon.push( [ obj[i].points[j].lat, obj[i].points[j].lon ] )
    }
    polygon.sort()
    obj.push(
      { "name":"llos polygon: "+i
      , "description": "A description"
      , "marker-size": "large"
      , "marker-color": "#fff"
      , "polygon": [polygon] } 
    )
  }


  // parseOptions = { Point:['lat','lon'], include:['orientation', 'score'] }
  GeoJSON.parse(obj, {
      'Point': ['lon', 'lat'], 'Polygon': 'polygon',
      extra: {color: "#ff0000"},
        exclude:['points'],
      attrs: {'Creator': 'CGI'
      , 'records': obj.length
      , 'description': 'Results of terrain sillhoutte search.'}
    }, 
  function(geojson){

    geojson = new Terraformer.Primitive(geojson);
    console.log(geojson);

    geojson.features.forEach( function(g){
      if ( g.geometry.type == "Polygon" ){
        g.geometry = new Terraformer.Polygon(g.geometry).convexHull();
      }
    });

    var geoJSONString = JSON.stringify(geojson)

    // // // name and describe the KML document as a whole
    // var kmlDocument = tokml(geojson, {
    //   name: 'name',
    //   description: 'score',
    //   style: 'style',
    //   // documentName: 'Results',
    //   // documentDescription: "Results of terrain sillhoutte search.",
    //     simplestyle: false
    // })

    done(null, geojson)


  })
}


  // exports.getGeoJSON = function(req, done){
  //  client.hget( "geojson", "b", function( err, geojson ){
  //    console.log("api getgeojson ");
  //    console.log(geojson);
  //    done( null, geojson );
  //  }) 
  // }

  // exports.getAllGeoJSON = function(req, done){
  //  client.hgetall( "geojson", function( err, geojson ){
  //    done( null, geojson ) 
  //  }) 
  // }

  // exports.getKML = function(req, done){
  //  client.hget( "kml", "kml", function( err, kml ){
  //    done( null, kml ) 
  //  })
  // }

  // exports.clearAll = function(req, done){

  //  // client.hdel("kml", "kml" , console.log );
  //  client.hdel("geojson", "a" , console.log );
  //  done(1)
  //  // client.hdel("geojson", "geojson2", console.log );

  // }

var fake_geo = [
    {
      "lon": 34.740501403808594,
      "lat": 69.06809997558594,
      "score": 35.46286392211914,
      "orientation": 18.999996185302734,
      "points": [
        {
          "lon": 34.7401008605957,
          "lat": 69.0698013305664,
          "score": 35.24056625366211,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06729888916016,
          "score": 35.5703239440918,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06950378417969,
          "score": 35.38107681274414,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06639862060547,
          "score": 35.264488220214844,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.06809997558594,
          "score": 35.63505935668945,
          "orientation": 19
        },
        {
          "lon": 34.7411994934082,
          "lat": 69.06610107421875,
          "score": 35.08008575439453,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.06950378417969,
          "score": 35.366050720214844,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06890106201172,
          "score": 35.56797790527344,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06809997558594,
          "score": 35.639915466308594,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06919860839844,
          "score": 35.48634719848633,
          "orientation": 19
        },
        {
          "lon": 34.739498138427734,
          "lat": 69.07060241699219,
          "score": 34.68478012084961,
          "orientation": 19
        },
        {
          "lon": 34.74140167236328,
          "lat": 69.06639862060547,
          "score": 35.183685302734375,
          "orientation": 19
        },
        {
          "lon": 34.74140167236328,
          "lat": 69.06590270996094,
          "score": 34.93423080444336,
          "orientation": 19
        },
        {
          "lon": 34.7411994934082,
          "lat": 69.06729888916016,
          "score": 35.52418518066406,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.06839752197266,
          "score": 35.634742736816406,
          "orientation": 19
        },
        {
          "lon": 34.73979949951172,
          "lat": 69.0698013305664,
          "score": 35.211124420166016,
          "orientation": 19
        },
        {
          "lon": 34.74140167236328,
          "lat": 69.06610107421875,
          "score": 35.052799224853516,
          "orientation": 19
        },
        {
          "lon": 34.73979949951172,
          "lat": 69.07029724121094,
          "score": 34.9576301574707,
          "orientation": 19
        },
        {
          "lon": 34.7411994934082,
          "lat": 69.06700134277344,
          "score": 35.46136474609375,
          "orientation": 19
        },
        {
          "lon": 34.73979949951172,
          "lat": 69.06999969482422,
          "score": 35.124061584472656,
          "orientation": 19
        },
        {
          "lon": 34.73979949951172,
          "lat": 69.06919860839844,
          "score": 35.446388244628906,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06670379638672,
          "score": 35.41377639770508,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06780242919922,
          "score": 35.65970230102539,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.068603515625,
          "score": 35.65275573730469,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.06919860839844,
          "score": 35.50416946411133,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06890106201172,
          "score": 35.59867858886719,
          "orientation": 19
        },
        {
          "lon": 34.7411994934082,
          "lat": 69.06670379638672,
          "score": 35.38212585449219,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06749725341797,
          "score": 35.648231506347656,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.06890106201172,
          "score": 35.59303283691406,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06700134277344,
          "score": 35.55253601074219,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06839752197266,
          "score": 35.694252014160156,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06749725341797,
          "score": 35.6456298828125,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06700134277344,
          "score": 35.53725814819336,
          "orientation": 19
        },
        {
          "lon": 34.7401008605957,
          "lat": 69.068603515625,
          "score": 35.65143966674805,
          "orientation": 19
        },
        {
          "lon": 34.73979949951172,
          "lat": 69.06950378417969,
          "score": 35.374271392822266,
          "orientation": 19
        },
        {
          "lon": 34.74089813232422,
          "lat": 69.06729888916016,
          "score": 35.61282730102539,
          "orientation": 19
        },
        {
          "lon": 34.7411994934082,
          "lat": 69.06639862060547,
          "score": 35.28754425048828,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06809997558594,
          "score": 35.73432159423828,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06780242919922,
          "score": 35.7288703918457,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06780242919922,
          "score": 35.741455078125,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.068603515625,
          "score": 35.714988708496094,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06749725341797,
          "score": 35.716407775878906,
          "orientation": 19
        },
        {
          "lon": 34.740299224853516,
          "lat": 69.06809997558594,
          "score": 35.773799896240234,
          "orientation": 19
        },
        {
          "lon": 34.7406005859375,
          "lat": 69.06729888916016,
          "score": 35.700897216796875,
          "orientation": 19
        }
      ]
    },
    {
      "lon": 34.58919906616211,
      "lat": 69.11759948730469,
      "score": 10.408596992492676,
      "orientation": 54,
      "points": [
        {
          "lon": 34.58700180053711,
          "lat": 69.12059783935547,
          "score": 10.308582305908203,
          "orientation": 54
        },
        {
          "lon": 34.59370040893555,
          "lat": 69.11419677734375,
          "score": 9.674784660339355,
          "orientation": 54
        },
        {
          "lon": 34.58760070800781,
          "lat": 69.1177978515625,
          "score": 10.736954689025879,
          "orientation": 54
        },
        {
          "lon": 34.585899353027344,
          "lat": 69.12229919433594,
          "score": 9.606535911560059,
          "orientation": 54
        },
        {
          "lon": 34.58919906616211,
          "lat": 69.11669921875,
          "score": 10.819112777709961,
          "orientation": 54
        },
        {
          "lon": 34.58810043334961,
          "lat": 69.11920166015625,
          "score": 10.700284957885742,
          "orientation": 54
        },
        {
          "lon": 34.58700180053711,
          "lat": 69.12229919433594,
          "score": 9.824456214904785,
          "orientation": 54
        },
        {
          "lon": 34.589500427246094,
          "lat": 69.11640167236328,
          "score": 10.795015335083008,
          "orientation": 54
        },
        {
          "lon": 34.58729934692383,
          "lat": 69.12000274658203,
          "score": 10.486512184143066,
          "orientation": 54
        },
        {
          "lon": 34.58980178833008,
          "lat": 69.11589813232422,
          "score": 10.732330322265625,
          "orientation": 54
        },
        {
          "lon": 34.59170150756836,
          "lat": 69.114501953125,
          "score": 10.266496658325195,
          "orientation": 54
        },
        {
          "lon": 34.59199905395508,
          "lat": 69.11419677734375,
          "score": 10.137114524841309,
          "orientation": 54
        },
        {
          "lon": 34.58919906616211,
          "lat": 69.11720275878906,
          "score": 10.866739273071289,
          "orientation": 54
        },
        {
          "lon": 34.587799072265625,
          "lat": 69.11840057373047,
          "score": 10.765433311462402,
          "orientation": 54
        }
      ]
    },
    {
      "lon": 34.80609893798828,
      "lat": 69.12860107421875,
      "score": 31.361425399780273,
      "orientation": 238.9999542236328,
      "points": [
        {
          "lon": 34.80590057373047,
          "lat": 69.12920379638672,
          "score": 31.506269454956055,
          "orientation": 239
        },
        {
          "lon": 34.805301666259766,
          "lat": 69.12979888916016,
          "score": 31.311704635620117,
          "orientation": 239
        },
        {
          "lon": 34.80759811401367,
          "lat": 69.12750244140625,
          "score": 31.143354415893555,
          "orientation": 239
        },
        {
          "lon": 34.8047981262207,
          "lat": 69.12999725341797,
          "score": 31.133447647094727,
          "orientation": 239
        },
        {
          "lon": 34.80419921875,
          "lat": 69.12999725341797,
          "score": 30.92020606994629,
          "orientation": 239
        },
        {
          "lon": 34.80699920654297,
          "lat": 69.1272964477539,
          "score": 31.266340255737305,
          "orientation": 239
        },
        {
          "lon": 34.804500579833984,
          "lat": 69.12979888916016,
          "score": 31.100963592529297,
          "orientation": 239
        },
        {
          "lon": 34.80730056762695,
          "lat": 69.12699890136719,
          "score": 31.093027114868164,
          "orientation": 239
        },
        {
          "lon": 34.80759811401367,
          "lat": 69.1272964477539,
          "score": 31.093034744262695,
          "orientation": 239
        },
        {
          "lon": 34.80780029296875,
          "lat": 69.12670135498047,
          "score": 30.802980422973633,
          "orientation": 239
        },
        {
          "lon": 34.80509948730469,
          "lat": 69.12920379638672,
          "score": 31.414098739624023,
          "orientation": 239
        },
        {
          "lon": 34.8047981262207,
          "lat": 69.12950134277344,
          "score": 31.281408309936523,
          "orientation": 239
        },
        {
          "lon": 34.805599212646484,
          "lat": 69.12860107421875,
          "score": 31.5461368560791,
          "orientation": 239
        },
        {
          "lon": 34.80619812011719,
          "lat": 69.12809753417969,
          "score": 31.541810989379883,
          "orientation": 239
        },
        {
          "lon": 34.80670166015625,
          "lat": 69.12809753417969,
          "score": 31.493209838867188,
          "orientation": 239
        },
        {
          "lon": 34.80619812011719,
          "lat": 69.12860107421875,
          "score": 31.56660270690918,
          "orientation": 239
        },
        {
          "lon": 34.80590057373047,
          "lat": 69.12889862060547,
          "score": 31.554832458496094,
          "orientation": 239
        },
        {
          "lon": 34.80670166015625,
          "lat": 69.12750244140625,
          "score": 31.39208221435547,
          "orientation": 239
        },
        {
          "lon": 34.80759811401367,
          "lat": 69.12699890136719,
          "score": 31.006933212280273,
          "orientation": 239
        },
        {
          "lon": 34.805599212646484,
          "lat": 69.12920379638672,
          "score": 31.50412940979004,
          "orientation": 239
        },
        {
          "lon": 34.804500579833984,
          "lat": 69.12999725341797,
          "score": 31.056425094604492,
          "orientation": 239
        },
        {
          "lon": 34.80590057373047,
          "lat": 69.12840270996094,
          "score": 31.576454162597656,
          "orientation": 239
        },
        {
          "lon": 34.805301666259766,
          "lat": 69.12889862060547,
          "score": 31.503812789916992,
          "orientation": 239
        },
        {
          "lon": 34.806400299072266,
          "lat": 69.12840270996094,
          "score": 31.569055557250977,
          "orientation": 239
        },
        {
          "lon": 34.80699920654297,
          "lat": 69.12779998779297,
          "score": 31.419721603393555,
          "orientation": 239
        },
        {
          "lon": 34.805301666259766,
          "lat": 69.12920379638672,
          "score": 31.481775283813477,
          "orientation": 239
        },
        {
          "lon": 34.805599212646484,
          "lat": 69.12950134277344,
          "score": 31.47032356262207,
          "orientation": 239
        },
        {
          "lon": 34.80590057373047,
          "lat": 69.12860107421875,
          "score": 31.598155975341797,
          "orientation": 239
        },
        {
          "lon": 34.806400299072266,
          "lat": 69.12779998779297,
          "score": 31.52031898498535,
          "orientation": 239
        },
        {
          "lon": 34.80730056762695,
          "lat": 69.1272964477539,
          "score": 31.23026466369629,
          "orientation": 239
        },
        {
          "lon": 34.805301666259766,
          "lat": 69.12950134277344,
          "score": 31.437288284301758,
          "orientation": 239
        },
        {
          "lon": 34.80730056762695,
          "lat": 69.12750244140625,
          "score": 31.290908813476562,
          "orientation": 239
        },
        {
          "lon": 34.805599212646484,
          "lat": 69.12889862060547,
          "score": 31.578144073486328,
          "orientation": 239
        },
        {
          "lon": 34.80509948730469,
          "lat": 69.12950134277344,
          "score": 31.417251586914062,
          "orientation": 239
        },
        {
          "lon": 34.80619812011719,
          "lat": 69.12840270996094,
          "score": 31.624622344970703,
          "orientation": 239
        },
        {
          "lon": 34.8047981262207,
          "lat": 69.12979888916016,
          "score": 31.273820877075195,
          "orientation": 239
        },
        {
          "lon": 34.80699920654297,
          "lat": 69.12750244140625,
          "score": 31.406734466552734,
          "orientation": 239
        },
        {
          "lon": 34.806400299072266,
          "lat": 69.12809753417969,
          "score": 31.607101440429688,
          "orientation": 239
        },
        {
          "lon": 34.80509948730469,
          "lat": 69.12979888916016,
          "score": 31.360782623291016,
          "orientation": 239
        }
      ]
    },
    {
      "lon": 34.56549835205078,
      "lat": 69.1511001586914,
      "score": 8.278438568115234,
      "orientation": 44,
      "points": [
        {
          "lon": 34.56639862060547,
          "lat": 69.15029907226562,
          "score": 8.187856674194336,
          "orientation": 44
        },
        {
          "lon": 34.56560134887695,
          "lat": 69.1509017944336,
          "score": 8.279343605041504,
          "orientation": 44
        },
        {
          "lon": 34.56480026245117,
          "lat": 69.15170288085938,
          "score": 8.316089630126953,
          "orientation": 44
        },
        {
          "lon": 34.56529998779297,
          "lat": 69.1511001586914,
          "score": 8.29531478881836,
          "orientation": 44
        },
        {
          "lon": 34.566200256347656,
          "lat": 69.15059661865234,
          "score": 8.236554145812988,
          "orientation": 44
        },
        {
          "lon": 34.56449890136719,
          "lat": 69.1520004272461,
          "score": 8.31041145324707,
          "orientation": 44
        },
        {
          "lon": 34.56589889526367,
          "lat": 69.1509017944336,
          "score": 8.280228614807129,
          "orientation": 44
        },
        {
          "lon": 34.56529998779297,
          "lat": 69.15139770507812,
          "score": 8.321707725524902,
          "orientation": 44
        }
      ]
    },
    {
      "lon": 34.32979965209961,
      "lat": 69.15350341796875,
      "score": 8.303357124328613,
      "orientation": 3.000000238418579,
      "points": [
        {
          "lon": 34.32979965209961,
          "lat": 69.1520004272461,
          "score": 8.284263610839844,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15499877929688,
          "score": 8.22043514251709,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15450286865234,
          "score": 8.272357940673828,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15480041503906,
          "score": 8.244384765625,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15229797363281,
          "score": 8.308334350585938,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15249633789062,
          "score": 8.323258399963379,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15280151367188,
          "score": 8.337324142456055,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.1541976928711,
          "score": 8.310851097106934,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.1530990600586,
          "score": 8.34698486328125,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15390014648438,
          "score": 8.334275245666504,
          "orientation": 3
        },
        {
          "lon": 34.32979965209961,
          "lat": 69.15339660644531,
          "score": 8.354464530944824,
          "orientation": 3
        }
      ]
    },
    {
      "lon": 34.28450012207031,
      "lat": 69.16999816894531,
      "score": 64.82264709472656,
      "orientation": 358,
      "points": [
        {
          "lon": 34.28450012207031,
          "lat": 69.17169952392578,
          "score": 68.29730987548828,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.1708984375,
          "score": 66.46349334716797,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.17030334472656,
          "score": 65.55052947998047,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.16809844970703,
          "score": 60.475341796875,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.16950225830078,
          "score": 64.10061645507812,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.17060089111328,
          "score": 66.0257797241211,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.17140197753906,
          "score": 67.67147064208984,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.17109680175781,
          "score": 67.00653839111328,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.16999816894531,
          "score": 65.03418731689453,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.16840362548828,
          "score": 61.494285583496094,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.16919708251953,
          "score": 63.516151428222656,
          "orientation": 358
        },
        {
          "lon": 34.28450012207031,
          "lat": 69.1686019897461,
          "score": 62.23603820800781,
          "orientation": 358
        }
      ]
    },
    {
      "lon": 34.27429962158203,
      "lat": 69.17510223388672,
      "score": 111.68551635742188,
      "orientation": 352.99993896484375,
      "points": [
        {
          "lon": 34.273399353027344,
          "lat": 69.16780090332031,
          "score": 82.6761474609375,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17780303955078,
          "score": 125.5918197631836,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16809844970703,
          "score": 83.9710693359375,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.17839813232422,
          "score": 124.55892944335938,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17359924316406,
          "score": 109.26911926269531,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16809844970703,
          "score": 84.01146697998047,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17949676513672,
          "score": 124.98924255371094,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17610168457031,
          "score": 119.88277435302734,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.1719970703125,
          "score": 103.44559478759766,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.17859649658203,
          "score": 124.52574920654297,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.18090057373047,
          "score": 122.72086334228516,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.1719970703125,
          "score": 102.25564575195312,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18199920654297,
          "score": 119.38501739501953,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16840362548828,
          "score": 85.57894134521484,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17420196533203,
          "score": 113.87723541259766,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.16999816894531,
          "score": 92.81028747558594,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.17890167236328,
          "score": 124.42223358154297,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16840362548828,
          "score": 85.3540267944336,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17749786376953,
          "score": 124.7729263305664,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.1686019897461,
          "score": 86.03845977783203,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.1759033203125,
          "score": 120.1275863647461,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.17919921875,
          "score": 124.2757568359375,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.17169952392578,
          "score": 101.97748565673828,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.1686019897461,
          "score": 86.29087829589844,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16889953613281,
          "score": 87.29463958740234,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18170166015625,
          "score": 120.38448333740234,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17639923095703,
          "score": 121.29237365722656,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.18060302734375,
          "score": 123.32181549072266,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17230224609375,
          "score": 103.82603454589844,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16919708251953,
          "score": 89.08248138427734,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.17980194091797,
          "score": 123.80191802978516,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18060302734375,
          "score": 122.75062561035156,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17919921875,
          "score": 125.3515396118164,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.17140197753906,
          "score": 100.48662567138672,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17030334472656,
          "score": 94.57811737060547,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.1802978515625,
          "score": 123.21194458007812,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.181396484375,
          "score": 121.35774993896484,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16889953613281,
          "score": 87.58287048339844,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18090057373047,
          "score": 122.30965423583984,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18000030517578,
          "score": 123.62772369384766,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16950225830078,
          "score": 90.60773468017578,
          "orientation": 353
        },
        {
          "lon": 34.27510070800781,
          "lat": 69.18109893798828,
          "score": 121.97545623779297,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.1697998046875,
          "score": 92.32746124267578,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.16999816894531,
          "score": 93.19561004638672,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.17109680175781,
          "score": 98.68528747558594,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.17030334472656,
          "score": 94.90403747558594,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16919708251953,
          "score": 89.12216186523438,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.17060089111328,
          "score": 96.30078887939453,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17389678955078,
          "score": 112.48992919921875,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17669677734375,
          "score": 122.7359848022461,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.1802978515625,
          "score": 123.90568542480469,
          "orientation": 353
        },
        {
          "lon": 34.273399353027344,
          "lat": 69.1708984375,
          "score": 97.93144989013672,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17729949951172,
          "score": 124.97126770019531,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17060089111328,
          "score": 96.09136962890625,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17250061035156,
          "score": 104.96796417236328,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17559814453125,
          "score": 119.2939453125,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17890167236328,
          "score": 125.78651428222656,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16950225830078,
          "score": 90.71446228027344,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.18000030517578,
          "score": 124.41400909423828,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.177001953125,
          "score": 123.96113586425781,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17980194091797,
          "score": 124.78363800048828,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.1697998046875,
          "score": 92.2746353149414,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17359924316406,
          "score": 111.69869995117188,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.1708984375,
          "score": 97.62889099121094,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17279815673828,
          "score": 106.6251449584961,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17479705810547,
          "score": 115.15045166015625,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17949676513672,
          "score": 125.21257019042969,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17729949951172,
          "score": 124.85545349121094,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17859649658203,
          "score": 126.24298858642578,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.16999816894531,
          "score": 93.52604675292969,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.177001953125,
          "score": 124.7282943725586,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17919921875,
          "score": 125.5609130859375,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17530059814453,
          "score": 118.51863098144531,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17340087890625,
          "score": 110.71536254882812,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17749786376953,
          "score": 125.35430908203125,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17030334472656,
          "score": 95.04505157470703,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17109680175781,
          "score": 99.19133758544922,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17500305175781,
          "score": 116.18047332763672,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17310333251953,
          "score": 108.5526351928711,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17310333251953,
          "score": 109.44281768798828,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17890167236328,
          "score": 125.92083740234375,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.1781005859375,
          "score": 126.15774536132812,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.1708984375,
          "score": 98.3877182006836,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17780303955078,
          "score": 126.13484954833984,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17109680175781,
          "score": 99.18795013427734,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17060089111328,
          "score": 96.78929138183594,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17140197753906,
          "score": 100.79792022705078,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17839813232422,
          "score": 126.18475341796875,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17250061035156,
          "score": 106.36869049072266,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17279815673828,
          "score": 108.09723663330078,
          "orientation": 353
        },
        {
          "lon": 34.27479934692383,
          "lat": 69.17859649658203,
          "score": 126.16033935546875,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17230224609375,
          "score": 105.41439819335938,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17500305175781,
          "score": 117.6164779663086,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.17169952392578,
          "score": 102.39778137207031,
          "orientation": 353
        },
        {
          "lon": 34.27370071411133,
          "lat": 69.1719970703125,
          "score": 103.93975067138672,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17530059814453,
          "score": 118.13519287109375,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17839813232422,
          "score": 126.80597686767578,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17340087890625,
          "score": 110.20928192138672,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17669677734375,
          "score": 124.51918029785156,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17140197753906,
          "score": 100.82318878173828,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17479705810547,
          "score": 116.82868957519531,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17559814453125,
          "score": 119.81029510498047,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17169952392578,
          "score": 102.58112335205078,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17359924316406,
          "score": 111.12704467773438,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17639923095703,
          "score": 123.77999877929688,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.1781005859375,
          "score": 127.26847839355469,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.1719970703125,
          "score": 104.210693359375,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.1759033203125,
          "score": 121.2538070678711,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17230224609375,
          "score": 105.7762451171875,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17780303955078,
          "score": 127.13567352294922,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17250061035156,
          "score": 106.51802825927734,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17749786376953,
          "score": 126.83793640136719,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17279815673828,
          "score": 108.2640380859375,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17610168457031,
          "score": 122.43272399902344,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17310333251953,
          "score": 109.74304962158203,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17359924316406,
          "score": 112.35395812988281,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17729949951172,
          "score": 126.58073425292969,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17340087890625,
          "score": 111.18049621582031,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.177001953125,
          "score": 125.88568115234375,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17669677734375,
          "score": 124.6115493774414,
          "orientation": 353
        },
        {
          "lon": 34.27389907836914,
          "lat": 69.17389678955078,
          "score": 114.04154205322266,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17610168457031,
          "score": 122.23506927490234,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.1759033203125,
          "score": 121.86512756347656,
          "orientation": 353
        },
        {
          "lon": 34.27450180053711,
          "lat": 69.17639923095703,
          "score": 123.94982147216797,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17559814453125,
          "score": 120.87879943847656,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17530059814453,
          "score": 119.81465911865234,
          "orientation": 353
        },
        {
          "lon": 34.274200439453125,
          "lat": 69.17500305175781,
          "score": 118.30616760253906,
          "orientation": 353
        }
      ]
    },
    {
      "lon": 34.44200134277344,
      "lat": 69.17720031738281,
      "score": 14.481117248535156,
      "orientation": 87.99999237060547,
      "points": [
        {
          "lon": 34.441200256347656,
          "lat": 69.177001953125,
          "score": 14.53434944152832,
          "orientation": 88
        },
        {
          "lon": 34.43980026245117,
          "lat": 69.17749786376953,
          "score": 14.362356185913086,
          "orientation": 88
        },
        {
          "lon": 34.44449996948242,
          "lat": 69.17729949951172,
          "score": 14.145489692687988,
          "orientation": 88
        },
        {
          "lon": 34.44060134887695,
          "lat": 69.17729949951172,
          "score": 14.495128631591797,
          "orientation": 88
        },
        {
          "lon": 34.440101623535156,
          "lat": 69.17749786376953,
          "score": 14.423542022705078,
          "orientation": 88
        },
        {
          "lon": 34.44260025024414,
          "lat": 69.17729949951172,
          "score": 14.526350975036621,
          "orientation": 88
        },
        {
          "lon": 34.442298889160156,
          "lat": 69.17729949951172,
          "score": 14.551154136657715,
          "orientation": 88
        },
        {
          "lon": 34.444801330566406,
          "lat": 69.177001953125,
          "score": 14.049574851989746,
          "orientation": 88
        },
        {
          "lon": 34.44200134277344,
          "lat": 69.17729949951172,
          "score": 14.571182250976562,
          "orientation": 88
        },
        {
          "lon": 34.44089889526367,
          "lat": 69.17729949951172,
          "score": 14.539504051208496,
          "orientation": 88
        },
        {
          "lon": 34.44139862060547,
          "lat": 69.177001953125,
          "score": 14.56495189666748,
          "orientation": 88
        },
        {
          "lon": 34.44169998168945,
          "lat": 69.17729949951172,
          "score": 14.589807510375977,
          "orientation": 88
        },
        {
          "lon": 34.44449996948242,
          "lat": 69.177001953125,
          "score": 14.16576099395752,
          "orientation": 88
        },
        {
          "lon": 34.44139862060547,
          "lat": 69.17729949951172,
          "score": 14.605094909667969,
          "orientation": 88
        },
        {
          "lon": 34.441200256347656,
          "lat": 69.17729949951172,
          "score": 14.599082946777344,
          "orientation": 88
        },
        {
          "lon": 34.44169998168945,
          "lat": 69.177001953125,
          "score": 14.611188888549805,
          "orientation": 88
        },
        {
          "lon": 34.44279861450195,
          "lat": 69.177001953125,
          "score": 14.570566177368164,
          "orientation": 88
        },
        {
          "lon": 34.44200134277344,
          "lat": 69.177001953125,
          "score": 14.636409759521484,
          "orientation": 88
        },
        {
          "lon": 34.44260025024414,
          "lat": 69.177001953125,
          "score": 14.599719047546387,
          "orientation": 88
        }
      ]
    },
    {
      "lon": 34.2666015625,
      "lat": 69.1874008178711,
      "score": 83.79601287841797,
      "orientation": 348.0000305175781,
      "points": [
        {
          "lon": 34.26729965209961,
          "lat": 69.19110107421875,
          "score": 67.04010009765625,
          "orientation": 348
        },
        {
          "lon": 34.26530075073242,
          "lat": 69.18229675292969,
          "score": 101.8447265625,
          "orientation": 348
        },
        {
          "lon": 34.26559829711914,
          "lat": 69.18419647216797,
          "score": 97.015625,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18450164794922,
          "score": 98.70405578613281,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.1864013671875,
          "score": 91.23377990722656,
          "orientation": 348
        },
        {
          "lon": 34.26810073852539,
          "lat": 69.19280242919922,
          "score": 58.82234573364258,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.1885986328125,
          "score": 80.16486358642578,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18560028076172,
          "score": 94.15233612060547,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.19000244140625,
          "score": 73.01126861572266,
          "orientation": 348
        },
        {
          "lon": 34.26559829711914,
          "lat": 69.18309783935547,
          "score": 100.76615905761719,
          "orientation": 348
        },
        {
          "lon": 34.267799377441406,
          "lat": 69.19139862060547,
          "score": 66.51425170898438,
          "orientation": 348
        },
        {
          "lon": 34.26530075073242,
          "lat": 69.18250274658203,
          "score": 101.38044738769531,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19000244140625,
          "score": 74.42172241210938,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18360137939453,
          "score": 100.61113739013672,
          "orientation": 348
        },
        {
          "lon": 34.267799377441406,
          "lat": 69.19229888916016,
          "score": 61.548301696777344,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18810272216797,
          "score": 80.28718566894531,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.185302734375,
          "score": 93.39734649658203,
          "orientation": 348
        },
        {
          "lon": 34.26559829711914,
          "lat": 69.18389892578125,
          "score": 98.33316040039062,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19170379638672,
          "score": 64.51335906982422,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.1875,
          "score": 85.78040313720703,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18890380859375,
          "score": 77.56140899658203,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18669891357422,
          "score": 89.53975677490234,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18479919433594,
          "score": 97.1447982788086,
          "orientation": 348
        },
        {
          "lon": 34.26559829711914,
          "lat": 69.18340301513672,
          "score": 99.8956069946289,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18589782714844,
          "score": 92.53167724609375,
          "orientation": 348
        },
        {
          "lon": 34.267799377441406,
          "lat": 69.19170379638672,
          "score": 64.63603210449219,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18389892578125,
          "score": 99.69403839111328,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.18890380859375,
          "score": 78.93048858642578,
          "orientation": 348
        },
        {
          "lon": 34.267799377441406,
          "lat": 69.19200134277344,
          "score": 63.274566650390625,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19029998779297,
          "score": 72.86016082763672,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.19090270996094,
          "score": 68.49817657470703,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19139862060547,
          "score": 66.24696350097656,
          "orientation": 348
        },
        {
          "lon": 34.26559829711914,
          "lat": 69.18360137939453,
          "score": 99.42520904541016,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18669891357422,
          "score": 87.45047760009766,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.1897964477539,
          "score": 74.25353240966797,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18499755859375,
          "score": 94.92924499511719,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18499755859375,
          "score": 96.37869262695312,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18699645996094,
          "score": 87.92353057861328,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.1885986328125,
          "score": 78.99304962158203,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18779754638672,
          "score": 84.43061065673828,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18609619140625,
          "score": 91.74273681640625,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18419647216797,
          "score": 98.84735107421875,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18779754638672,
          "score": 82.58670043945312,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19059753417969,
          "score": 71.36282348632812,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.18920135498047,
          "score": 77.80622863769531,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19110107421875,
          "score": 68.04664611816406,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18840026855469,
          "score": 79.8965072631836,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.19059753417969,
          "score": 70.95429992675781,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18949890136719,
          "score": 76.21378326416016,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.1875,
          "score": 84.21347045898438,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18730163574219,
          "score": 86.06898498535156,
          "orientation": 348
        },
        {
          "lon": 34.267601013183594,
          "lat": 69.19090270996094,
          "score": 69.52501678466797,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18479919433594,
          "score": 96.09032440185547,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18810272216797,
          "score": 83.04849243164062,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.1864013671875,
          "score": 90.47303771972656,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.1864013671875,
          "score": 89.4596939086914,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.185302734375,
          "score": 95.24176788330078,
          "orientation": 348
        },
        {
          "lon": 34.265899658203125,
          "lat": 69.18450164794922,
          "score": 97.4684066772461,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18730163574219,
          "score": 85.01065826416016,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18699645996094,
          "score": 86.7789077758789,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18810272216797,
          "score": 81.82386016845703,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18920135498047,
          "score": 77.65522766113281,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.18949890136719,
          "score": 77.17523193359375,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.19029998779297,
          "score": 72.77909851074219,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.1875,
          "score": 85.31134033203125,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18840026855469,
          "score": 81.17893981933594,
          "orientation": 348
        },
        {
          "lon": 34.26639938354492,
          "lat": 69.18669891357422,
          "score": 88.98441314697266,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18609619140625,
          "score": 91.46634674072266,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18589782714844,
          "score": 92.42788696289062,
          "orientation": 348
        },
        {
          "lon": 34.26620101928711,
          "lat": 69.18560028076172,
          "score": 94.13716125488281,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.19000244140625,
          "score": 74.56687927246094,
          "orientation": 348
        },
        {
          "lon": 34.266700744628906,
          "lat": 69.18779754638672,
          "score": 83.91323852539062,
          "orientation": 348
        },
        {
          "lon": 34.266998291015625,
          "lat": 69.18890380859375,
          "score": 78.69693756103516,
          "orientation": 348
        },
        {
          "lon": 34.26729965209961,
          "lat": 69.1897964477539,
          "score": 75.81246185302734,
          "orientation": 348
        }
      ]
    },
    {
      "lon": 34.285099029541016,
      "lat": 69.18879699707031,
      "score": 24.030521392822266,
      "orientation": 357.9999694824219,
      "points": [
        {
          "lon": 34.285099029541016,
          "lat": 69.1875,
          "score": 29.561323165893555,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18779754638672,
          "score": 28.06965446472168,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18810272216797,
          "score": 26.59000587463379,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.19000244140625,
          "score": 19.839298248291016,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18840026855469,
          "score": 25.136720657348633,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.19059753417969,
          "score": 18.54224967956543,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.1885986328125,
          "score": 24.65081024169922,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18890380859375,
          "score": 23.775550842285156,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18920135498047,
          "score": 22.638399124145508,
          "orientation": 358
        },
        {
          "lon": 34.285099029541016,
          "lat": 69.18949890136719,
          "score": 21.501209259033203,
          "orientation": 358
        }
      ]
    },
    {
      "lon": 34.766998291015625,
      "lat": 69.20780181884766,
      "score": 142.1916961669922,
      "orientation": 73.99996948242188,
      "points": [
        {
          "lon": 34.75590133666992,
          "lat": 69.2125015258789,
          "score": 95.54247283935547,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.2074966430664,
          "score": 149.2711181640625,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.20780181884766,
          "score": 149.1171112060547,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20700073242188,
          "score": 146.66607666015625,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.20700073242188,
          "score": 149.29322814941406,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20610046386719,
          "score": 145.65597534179688,
          "orientation": 74
        },
        {
          "lon": 34.75559997558594,
          "lat": 69.21089935302734,
          "score": 97.63860321044922,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20610046386719,
          "score": 146.2290802001953,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.20980072021484,
          "score": 147.00279235839844,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20590209960938,
          "score": 141.44522094726562,
          "orientation": 74
        },
        {
          "lon": 34.76340103149414,
          "lat": 69.21029663085938,
          "score": 142.7577667236328,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.2074966430664,
          "score": 149.71194458007812,
          "orientation": 74
        },
        {
          "lon": 34.77119827270508,
          "lat": 69.20500183105469,
          "score": 131.8212432861328,
          "orientation": 74
        },
        {
          "lon": 34.75669860839844,
          "lat": 69.2125015258789,
          "score": 101.64508056640625,
          "orientation": 74
        },
        {
          "lon": 34.770599365234375,
          "lat": 69.20700073242188,
          "score": 141.4209442138672,
          "orientation": 74
        },
        {
          "lon": 34.75590133666992,
          "lat": 69.21219635009766,
          "score": 96.65301513671875,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.20590209960938,
          "score": 143.28799438476562,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.20860290527344,
          "score": 147.7601776123047,
          "orientation": 74
        },
        {
          "lon": 34.75640106201172,
          "lat": 69.2125015258789,
          "score": 99.41534423828125,
          "orientation": 74
        },
        {
          "lon": 34.77119827270508,
          "lat": 69.20590209960938,
          "score": 135.50518798828125,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.2052993774414,
          "score": 140.8994140625,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.20980072021484,
          "score": 146.45516967773438,
          "orientation": 74
        },
        {
          "lon": 34.75619888305664,
          "lat": 69.21219635009766,
          "score": 98.93042755126953,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.20860290527344,
          "score": 149.87014770507812,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.2052993774414,
          "score": 143.23867797851562,
          "orientation": 74
        },
        {
          "lon": 34.75559997558594,
          "lat": 69.2125015258789,
          "score": 93.26995086669922,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.2074966430664,
          "score": 148.1437225341797,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.2063980102539,
          "score": 143.39340209960938,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20559692382812,
          "score": 144.48448181152344,
          "orientation": 74
        },
        {
          "lon": 34.765098571777344,
          "lat": 69.20860290527344,
          "score": 148.8195343017578,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20700073242188,
          "score": 147.12326049804688,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.20700073242188,
          "score": 145.9554901123047,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.20809936523438,
          "score": 145.69906616210938,
          "orientation": 74
        },
        {
          "lon": 34.75619888305664,
          "lat": 69.21109771728516,
          "score": 101.73833465576172,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20559692382812,
          "score": 140.74563598632812,
          "orientation": 74
        },
        {
          "lon": 34.772300720214844,
          "lat": 69.20559692382812,
          "score": 127.1913070678711,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20700073242188,
          "score": 143.2613525390625,
          "orientation": 74
        },
        {
          "lon": 34.76340103149414,
          "lat": 69.20919799804688,
          "score": 144.5400390625,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.20860290527344,
          "score": 146.37771606445312,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20890045166016,
          "score": 147.9588623046875,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.20919799804688,
          "score": 148.63473510742188,
          "orientation": 74
        },
        {
          "lon": 34.770599365234375,
          "lat": 69.20670318603516,
          "score": 141.0956268310547,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.2074966430664,
          "score": 148.66729736328125,
          "orientation": 74
        },
        {
          "lon": 34.77199935913086,
          "lat": 69.20559692382812,
          "score": 128.5499725341797,
          "orientation": 74
        },
        {
          "lon": 34.764198303222656,
          "lat": 69.20999908447266,
          "score": 145.48773193359375,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.2072982788086,
          "score": 145.44029235839844,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.20860290527344,
          "score": 148.3714599609375,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.20700073242188,
          "score": 144.27027893066406,
          "orientation": 74
        },
        {
          "lon": 34.75590133666992,
          "lat": 69.21109771728516,
          "score": 99.41034698486328,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.20860290527344,
          "score": 149.85964965820312,
          "orientation": 74
        },
        {
          "lon": 34.77090072631836,
          "lat": 69.20559692382812,
          "score": 136.65963745117188,
          "orientation": 74
        },
        {
          "lon": 34.75529861450195,
          "lat": 69.21109771728516,
          "score": 94.65252685546875,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.2083969116211,
          "score": 147.87588500976562,
          "orientation": 74
        },
        {
          "lon": 34.764198303222656,
          "lat": 69.20980072021484,
          "score": 145.86082458496094,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.20670318603516,
          "score": 145.61660766601562,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.20700073242188,
          "score": 145.1744384765625,
          "orientation": 74
        },
        {
          "lon": 34.77090072631836,
          "lat": 69.2063980102539,
          "score": 139.17239379882812,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.2083969116211,
          "score": 148.46144104003906,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.20809936523438,
          "score": 149.52371215820312,
          "orientation": 74
        },
        {
          "lon": 34.7578010559082,
          "lat": 69.2114028930664,
          "score": 112.42210388183594,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20780181884766,
          "score": 147.28692626953125,
          "orientation": 74
        },
        {
          "lon": 34.770301818847656,
          "lat": 69.20670318603516,
          "score": 142.23065185546875,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20670318603516,
          "score": 142.938720703125,
          "orientation": 74
        },
        {
          "lon": 34.75529861450195,
          "lat": 69.21089935302734,
          "score": 94.99275970458984,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.2083969116211,
          "score": 149.96636962890625,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20919799804688,
          "score": 149.00572204589844,
          "orientation": 74
        },
        {
          "lon": 34.770599365234375,
          "lat": 69.2063980102539,
          "score": 140.68507385253906,
          "orientation": 74
        },
        {
          "lon": 34.75669860839844,
          "lat": 69.21219635009766,
          "score": 102.57972717285156,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.20809936523438,
          "score": 146.60426330566406,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.2083969116211,
          "score": 149.49884033203125,
          "orientation": 74
        },
        {
          "lon": 34.770301818847656,
          "lat": 69.20809936523438,
          "score": 143.14244079589844,
          "orientation": 74
        },
        {
          "lon": 34.766700744628906,
          "lat": 69.20780181884766,
          "score": 150.03048706054688,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.2052993774414,
          "score": 141.8400115966797,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.20780181884766,
          "score": 150.023193359375,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.20780181884766,
          "score": 146.58721923828125,
          "orientation": 74
        },
        {
          "lon": 34.76390075683594,
          "lat": 69.20980072021484,
          "score": 145.1914825439453,
          "orientation": 74
        },
        {
          "lon": 34.75590133666992,
          "lat": 69.21089935302734,
          "score": 100.1012191772461,
          "orientation": 74
        },
        {
          "lon": 34.75590133666992,
          "lat": 69.21060180664062,
          "score": 100.5823974609375,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.20809936523438,
          "score": 144.8799285888672,
          "orientation": 74
        },
        {
          "lon": 34.766700744628906,
          "lat": 69.20700073242188,
          "score": 149.4253692626953,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.20780181884766,
          "score": 145.77102661132812,
          "orientation": 74
        },
        {
          "lon": 34.770301818847656,
          "lat": 69.20559692382812,
          "score": 140.15090942382812,
          "orientation": 74
        },
        {
          "lon": 34.765098571777344,
          "lat": 69.20919799804688,
          "score": 148.46046447753906,
          "orientation": 74
        },
        {
          "lon": 34.765098571777344,
          "lat": 69.20980072021484,
          "score": 147.5907440185547,
          "orientation": 74
        },
        {
          "lon": 34.76390075683594,
          "lat": 69.20890045166016,
          "score": 146.31471252441406,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.2072982788086,
          "score": 148.12210083007812,
          "orientation": 74
        },
        {
          "lon": 34.770301818847656,
          "lat": 69.2063980102539,
          "score": 141.83311462402344,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.20780181884766,
          "score": 149.9940948486328,
          "orientation": 74
        },
        {
          "lon": 34.770599365234375,
          "lat": 69.20780181884766,
          "score": 142.05026245117188,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.2072982788086,
          "score": 146.36305236816406,
          "orientation": 74
        },
        {
          "lon": 34.765899658203125,
          "lat": 69.20860290527344,
          "score": 149.80810546875,
          "orientation": 74
        },
        {
          "lon": 34.76369857788086,
          "lat": 69.20999908447266,
          "score": 144.35037231445312,
          "orientation": 74
        },
        {
          "lon": 34.757598876953125,
          "lat": 69.20980072021484,
          "score": 114.00639343261719,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.20950317382812,
          "score": 147.6254119873047,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.20890045166016,
          "score": 147.72793579101562,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20780181884766,
          "score": 147.82972717285156,
          "orientation": 74
        },
        {
          "lon": 34.765098571777344,
          "lat": 69.20950317382812,
          "score": 148.09646606445312,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20610046386719,
          "score": 145.37530517578125,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20809936523438,
          "score": 147.41201782226562,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20780181884766,
          "score": 148.4330596923828,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.2083969116211,
          "score": 149.34201049804688,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.2063980102539,
          "score": 146.97402954101562,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20670318603516,
          "score": 146.44912719726562,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.2072982788086,
          "score": 149.72140502929688,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.2063980102539,
          "score": 142.57699584960938,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.20780181884766,
          "score": 144.92787170410156,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.2074966430664,
          "score": 149.2382354736328,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20670318603516,
          "score": 147.50204467773438,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.2083969116211,
          "score": 146.645751953125,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.20950317382812,
          "score": 147.11346435546875,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20860290527344,
          "score": 149.61427307128906,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.20780181884766,
          "score": 148.98451232910156,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20860290527344,
          "score": 148.36187744140625,
          "orientation": 74
        },
        {
          "lon": 34.770301818847656,
          "lat": 69.20780181884766,
          "score": 143.2421417236328,
          "orientation": 74
        },
        {
          "lon": 34.769798278808594,
          "lat": 69.2083969116211,
          "score": 144.91314697265625,
          "orientation": 74
        },
        {
          "lon": 34.764198303222656,
          "lat": 69.20950317382812,
          "score": 146.4834442138672,
          "orientation": 74
        },
        {
          "lon": 34.75559997558594,
          "lat": 69.21109771728516,
          "score": 97.14501190185547,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.2083969116211,
          "score": 149.91029357910156,
          "orientation": 74
        },
        {
          "lon": 34.75559997558594,
          "lat": 69.21029663085938,
          "score": 98.66669464111328,
          "orientation": 74
        },
        {
          "lon": 34.765899658203125,
          "lat": 69.2083969116211,
          "score": 149.97625732421875,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.20670318603516,
          "score": 148.43869018554688,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.2074966430664,
          "score": 150.02064514160156,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20809936523438,
          "score": 144.01817321777344,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20809936523438,
          "score": 149.77688598632812,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.20780181884766,
          "score": 149.45216369628906,
          "orientation": 74
        },
        {
          "lon": 34.77009963989258,
          "lat": 69.20780181884766,
          "score": 144.0072479248047,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.2072982788086,
          "score": 148.76356506347656,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.20780181884766,
          "score": 149.70135498046875,
          "orientation": 74
        },
        {
          "lon": 34.76369857788086,
          "lat": 69.20919799804688,
          "score": 145.6588134765625,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.20809936523438,
          "score": 150.0273895263672,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.2074966430664,
          "score": 149.83102416992188,
          "orientation": 74
        },
        {
          "lon": 34.76390075683594,
          "lat": 69.20950317382812,
          "score": 145.8414306640625,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.20670318603516,
          "score": 148.1045684814453,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.20860290527344,
          "score": 147.40443420410156,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.2072982788086,
          "score": 149.7122344970703,
          "orientation": 74
        },
        {
          "lon": 34.765899658203125,
          "lat": 69.20809936523438,
          "score": 150.10946655273438,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.2063980102539,
          "score": 144.594970703125,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.20919799804688,
          "score": 148.20912170410156,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.2063980102539,
          "score": 146.15023803710938,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20780181884766,
          "score": 149.826171875,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.2072982788086,
          "score": 147.33555603027344,
          "orientation": 74
        },
        {
          "lon": 34.76369857788086,
          "lat": 69.20890045166016,
          "score": 146.02467346191406,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.20700073242188,
          "score": 148.08961486816406,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.2072982788086,
          "score": 149.95465087890625,
          "orientation": 74
        },
        {
          "lon": 34.76919937133789,
          "lat": 69.2063980102539,
          "score": 145.48068237304688,
          "orientation": 74
        },
        {
          "lon": 34.76890182495117,
          "lat": 69.2083969116211,
          "score": 147.6094512939453,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.2063980102539,
          "score": 146.6523895263672,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.20780181884766,
          "score": 150.1162567138672,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.20890045166016,
          "score": 149.34115600585938,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.2083969116211,
          "score": 150.31765747070312,
          "orientation": 74
        },
        {
          "lon": 34.757598876953125,
          "lat": 69.20999908447266,
          "score": 114.00923919677734,
          "orientation": 74
        },
        {
          "lon": 34.758399963378906,
          "lat": 69.2114028930664,
          "score": 116.5287857055664,
          "orientation": 74
        },
        {
          "lon": 34.76340103149414,
          "lat": 69.20999908447266,
          "score": 143.8118438720703,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.2072982788086,
          "score": 150.09811401367188,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20860290527344,
          "score": 148.02670288085938,
          "orientation": 74
        },
        {
          "lon": 34.76390075683594,
          "lat": 69.20919799804688,
          "score": 146.4137420654297,
          "orientation": 74
        },
        {
          "lon": 34.76369857788086,
          "lat": 69.20950317382812,
          "score": 145.50286865234375,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20890045166016,
          "score": 149.73159790039062,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.20700073242188,
          "score": 149.76217651367188,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.2074966430664,
          "score": 150.23175048828125,
          "orientation": 74
        },
        {
          "lon": 34.766700744628906,
          "lat": 69.2074966430664,
          "score": 150.31564331054688,
          "orientation": 74
        },
        {
          "lon": 34.766700744628906,
          "lat": 69.2072982788086,
          "score": 150.16290283203125,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.20860290527344,
          "score": 149.62078857421875,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.20919799804688,
          "score": 149.90518188476562,
          "orientation": 74
        },
        {
          "lon": 34.766998291015625,
          "lat": 69.20809936523438,
          "score": 150.463134765625,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.2072982788086,
          "score": 149.46240234375,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.20670318603516,
          "score": 147.2793426513672,
          "orientation": 74
        },
        {
          "lon": 34.767799377441406,
          "lat": 69.20700073242188,
          "score": 149.1832275390625,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.20950317382812,
          "score": 149.13185119628906,
          "orientation": 74
        },
        {
          "lon": 34.766700744628906,
          "lat": 69.20809936523438,
          "score": 150.6305694580078,
          "orientation": 74
        },
        {
          "lon": 34.76340103149414,
          "lat": 69.20950317382812,
          "score": 144.76844787597656,
          "orientation": 74
        },
        {
          "lon": 34.769500732421875,
          "lat": 69.2083969116211,
          "score": 146.25563049316406,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.2072982788086,
          "score": 148.05409240722656,
          "orientation": 74
        },
        {
          "lon": 34.76559829711914,
          "lat": 69.2083969116211,
          "score": 150.1538848876953,
          "orientation": 74
        },
        {
          "lon": 34.764801025390625,
          "lat": 69.20890045166016,
          "score": 148.80482482910156,
          "orientation": 74
        },
        {
          "lon": 34.768699645996094,
          "lat": 69.2083969116211,
          "score": 148.31138610839844,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.20780181884766,
          "score": 150.55740356445312,
          "orientation": 74
        },
        {
          "lon": 34.764198303222656,
          "lat": 69.20919799804688,
          "score": 147.33644104003906,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.2072982788086,
          "score": 149.86094665527344,
          "orientation": 74
        },
        {
          "lon": 34.767601013183594,
          "lat": 69.20700073242188,
          "score": 149.58197021484375,
          "orientation": 74
        },
        {
          "lon": 34.765899658203125,
          "lat": 69.20780181884766,
          "score": 150.48284912109375,
          "orientation": 74
        },
        {
          "lon": 34.76839828491211,
          "lat": 69.2083969116211,
          "score": 149.03445434570312,
          "orientation": 74
        },
        {
          "lon": 34.76369857788086,
          "lat": 69.20980072021484,
          "score": 145.32781982421875,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.2083969116211,
          "score": 149.56031799316406,
          "orientation": 74
        },
        {
          "lon": 34.76729965209961,
          "lat": 69.20700073242188,
          "score": 149.89627075195312,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.20919799804688,
          "score": 150.148681640625,
          "orientation": 74
        },
        {
          "lon": 34.765899658203125,
          "lat": 69.20890045166016,
          "score": 150.3428192138672,
          "orientation": 74
        },
        {
          "lon": 34.76340103149414,
          "lat": 69.20980072021484,
          "score": 144.5648651123047,
          "orientation": 74
        },
        {
          "lon": 34.76810073852539,
          "lat": 69.20700073242188,
          "score": 149.08265686035156,
          "orientation": 74
        },
        {
          "lon": 34.765098571777344,
          "lat": 69.20890045166016,
          "score": 149.6355743408203,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.20950317382812,
          "score": 149.25747680664062,
          "orientation": 74
        },
        {
          "lon": 34.76449966430664,
          "lat": 69.20919799804688,
          "score": 148.5297088623047,
          "orientation": 74
        },
        {
          "lon": 34.76530075073242,
          "lat": 69.2083969116211,
          "score": 150.4735870361328,
          "orientation": 74
        },
        {
          "lon": 34.76639938354492,
          "lat": 69.20890045166016,
          "score": 151.3123779296875,
          "orientation": 74
        },
        {
          "lon": 34.76620101928711,
          "lat": 69.20890045166016,
          "score": 151.35069274902344,
          "orientation": 74
        }
      ]
    },
    {
      "lon": 34.29159927368164,
      "lat": 69.20860290527344,
      "score": 30.1689510345459,
      "orientation": 358.0000305175781,
      "points": [
        {
          "lon": 34.29140090942383,
          "lat": 69.21060180664062,
          "score": 29.741674423217773,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20480346679688,
          "score": 30.1634578704834,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21199798583984,
          "score": 28.643665313720703,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.21029663085938,
          "score": 29.901060104370117,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.2074966430664,
          "score": 30.403270721435547,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21170043945312,
          "score": 28.883533477783203,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20500183105469,
          "score": 30.0214786529541,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20999908447266,
          "score": 30.047298431396484,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20780181884766,
          "score": 30.45063018798828,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2114028930664,
          "score": 29.11812400817871,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20980072021484,
          "score": 30.14641571044922,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2052993774414,
          "score": 29.956661224365234,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20559692382812,
          "score": 30.125080108642578,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20809936523438,
          "score": 30.48877716064453,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20590209960938,
          "score": 30.018251419067383,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21109771728516,
          "score": 29.352590560913086,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20950317382812,
          "score": 30.2769775390625,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20610046386719,
          "score": 30.119709014892578,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2063980102539,
          "score": 30.243131637573242,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20670318603516,
          "score": 30.34627914428711,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20700073242188,
          "score": 30.426706314086914,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2072982788086,
          "score": 30.4928035736084,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20919799804688,
          "score": 30.390148162841797,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2074966430664,
          "score": 30.541601181030273,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.2083969116211,
          "score": 30.52889633178711,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21089935302734,
          "score": 29.712230682373047,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20780181884766,
          "score": 30.591310501098633,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20890045166016,
          "score": 30.484512329101562,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20809936523438,
          "score": 30.623062133789062,
          "orientation": 358
        },
        {
          "lon": 34.29140090942383,
          "lat": 69.20860290527344,
          "score": 30.55229949951172,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21060180664062,
          "score": 29.94928741455078,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.2083969116211,
          "score": 30.65802574157715,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.21029663085938,
          "score": 30.1575927734375,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20860290527344,
          "score": 30.68719482421875,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20980072021484,
          "score": 30.400672912597656,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20890045166016,
          "score": 30.66207504272461,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20950317382812,
          "score": 30.510528564453125,
          "orientation": 358
        },
        {
          "lon": 34.29169845581055,
          "lat": 69.20919799804688,
          "score": 30.603246688842773,
          "orientation": 358
        }
      ]
    },
    {
      "lon": 34.60609817504883,
      "lat": 69.22949981689453,
      "score": 31.929977416992188,
      "orientation": 24.000001907348633,
      "points": [
        {
          "lon": 34.60530090332031,
          "lat": 69.23059844970703,
          "score": 33.09524917602539,
          "orientation": 24
        },
        {
          "lon": 34.606201171875,
          "lat": 69.22859954833984,
          "score": 33.29510498046875,
          "orientation": 24
        },
        {
          "lon": 34.604801177978516,
          "lat": 69.23059844970703,
          "score": 32.953922271728516,
          "orientation": 24
        },
        {
          "lon": 34.60919952392578,
          "lat": 69.2249984741211,
          "score": 30.307037353515625,
          "orientation": 24
        },
        {
          "lon": 34.604801177978516,
          "lat": 69.2333984375,
          "score": 31.32825469970703,
          "orientation": 24
        },
        {
          "lon": 34.606998443603516,
          "lat": 69.22750091552734,
          "score": 32.89895248413086,
          "orientation": 24
        },
        {
          "lon": 34.60419845581055,
          "lat": 69.23390197753906,
          "score": 30.64293670654297,
          "orientation": 24
        },
        {
          "lon": 34.609798431396484,
          "lat": 69.2238998413086,
          "score": 28.810129165649414,
          "orientation": 24
        },
        {
          "lon": 34.60919952392578,
          "lat": 69.22480010986328,
          "score": 30.125394821166992,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.23249816894531,
          "score": 32.16792678833008,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.22949981689453,
          "score": 33.26066207885742,
          "orientation": 24
        },
        {
          "lon": 34.60559844970703,
          "lat": 69.23200225830078,
          "score": 32.5401611328125,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.23200225830078,
          "score": 32.48956298828125,
          "orientation": 24
        },
        {
          "lon": 34.609500885009766,
          "lat": 69.22450256347656,
          "score": 29.64472198486328,
          "orientation": 24
        },
        {
          "lon": 34.60449981689453,
          "lat": 69.23310089111328,
          "score": 31.482906341552734,
          "orientation": 24
        },
        {
          "lon": 34.609798431396484,
          "lat": 69.22339630126953,
          "score": 28.24895477294922,
          "orientation": 24
        },
        {
          "lon": 34.609798431396484,
          "lat": 69.22309875488281,
          "score": 27.902036666870117,
          "orientation": 24
        },
        {
          "lon": 34.604801177978516,
          "lat": 69.23090362548828,
          "score": 32.877986907958984,
          "orientation": 24
        },
        {
          "lon": 34.60449981689453,
          "lat": 69.23359680175781,
          "score": 31.066591262817383,
          "orientation": 24
        },
        {
          "lon": 34.60559844970703,
          "lat": 69.22949981689453,
          "score": 33.3387451171875,
          "orientation": 24
        },
        {
          "lon": 34.609798431396484,
          "lat": 69.22360229492188,
          "score": 28.500465393066406,
          "orientation": 24
        },
        {
          "lon": 34.605899810791016,
          "lat": 69.22920227050781,
          "score": 33.37904357910156,
          "orientation": 24
        },
        {
          "lon": 34.60639953613281,
          "lat": 69.22810363769531,
          "score": 33.210243225097656,
          "orientation": 24
        },
        {
          "lon": 34.609500885009766,
          "lat": 69.2238998413086,
          "score": 29.04365348815918,
          "orientation": 24
        },
        {
          "lon": 34.604801177978516,
          "lat": 69.23280334472656,
          "score": 31.84882926940918,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.23030090332031,
          "score": 33.20547866821289,
          "orientation": 24
        },
        {
          "lon": 34.60449981689453,
          "lat": 69.2333984375,
          "score": 31.268260955810547,
          "orientation": 24
        },
        {
          "lon": 34.60559844970703,
          "lat": 69.23169708251953,
          "score": 32.75345230102539,
          "orientation": 24
        },
        {
          "lon": 34.60559844970703,
          "lat": 69.22979736328125,
          "score": 33.35554504394531,
          "orientation": 24
        },
        {
          "lon": 34.606201171875,
          "lat": 69.22889709472656,
          "score": 33.397911071777344,
          "orientation": 24
        },
        {
          "lon": 34.6067008972168,
          "lat": 69.22750091552734,
          "score": 32.99605941772461,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.22979736328125,
          "score": 33.30246353149414,
          "orientation": 24
        },
        {
          "lon": 34.609500885009766,
          "lat": 69.22419738769531,
          "score": 29.38935661315918,
          "orientation": 24
        },
        {
          "lon": 34.605098724365234,
          "lat": 69.23249816894531,
          "score": 32.183738708496094,
          "orientation": 24
        },
        {
          "lon": 34.60559844970703,
          "lat": 69.22920227050781,
          "score": 33.3835334777832,
          "orientation": 24
        },
        {
          "lon": 34.605098724365234,
          "lat": 69.23280334472656,
          "score": 31.969879150390625,
          "orientation": 24
        },
        {
          "lon": 34.604801177978516,
          "lat": 69.23310089111328,
          "score": 31.658506393432617,
          "orientation": 24
        },
        {
          "lon": 34.60639953613281,
          "lat": 69.22859954833984,
          "score": 33.378173828125,
          "orientation": 24
        },
        {
          "lon": 34.605098724365234,
          "lat": 69.23030090332031,
          "score": 33.20289611816406,
          "orientation": 24
        },
        {
          "lon": 34.6067008972168,
          "lat": 69.22779846191406,
          "score": 33.14287185668945,
          "orientation": 24
        },
        {
          "lon": 34.60639953613281,
          "lat": 69.22840118408203,
          "score": 33.3491325378418,
          "orientation": 24
        },
        {
          "lon": 34.6067008972168,
          "lat": 69.22810363769531,
          "score": 33.26030731201172,
          "orientation": 24
        },
        {
          "lon": 34.60530090332031,
          "lat": 69.2300033569336,
          "score": 33.3321647644043,
          "orientation": 24
        }
      ]
    },
    {
      "lon": 34.85649871826172,
      "lat": 69.2509994506836,
      "score": 55.128753662109375,
      "orientation": 49,
      "points": [
        {
          "lon": 34.85810089111328,
          "lat": 69.24980163574219,
          "score": 53.46723175048828,
          "orientation": 49
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.25250244140625,
          "score": 55.53645706176758,
          "orientation": 49
        },
        {
          "lon": 34.85559844970703,
          "lat": 69.2522964477539,
          "score": 55.654075622558594,
          "orientation": 49
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.25,
          "score": 54.16653823852539,
          "orientation": 49
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.25170135498047,
          "score": 55.4604606628418,
          "orientation": 49
        },
        {
          "lon": 34.8577995300293,
          "lat": 69.24949645996094,
          "score": 53.09519577026367,
          "orientation": 49
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.25199890136719,
          "score": 55.725093841552734,
          "orientation": 49
        },
        {
          "lon": 34.855098724365234,
          "lat": 69.25250244140625,
          "score": 55.460121154785156,
          "orientation": 49
        },
        {
          "lon": 34.85810089111328,
          "lat": 69.24949645996094,
          "score": 52.620574951171875,
          "orientation": 49
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.25029754638672,
          "score": 54.4814453125,
          "orientation": 49
        },
        {
          "lon": 34.85559844970703,
          "lat": 69.25140380859375,
          "score": 55.51797103881836,
          "orientation": 49
        },
        {
          "lon": 34.856201171875,
          "lat": 69.25090026855469,
          "score": 55.175899505615234,
          "orientation": 49
        },
        {
          "lon": 34.855098724365234,
          "lat": 69.2522964477539,
          "score": 55.524593353271484,
          "orientation": 49
        },
        {
          "lon": 34.857601165771484,
          "lat": 69.24980163574219,
          "score": 53.8466682434082,
          "orientation": 49
        },
        {
          "lon": 34.8577995300293,
          "lat": 69.25,
          "score": 53.90989303588867,
          "orientation": 49
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.2510986328125,
          "score": 55.555091857910156,
          "orientation": 49
        },
        {
          "lon": 34.856201171875,
          "lat": 69.25170135498047,
          "score": 55.82129669189453,
          "orientation": 49
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.25140380859375,
          "score": 55.7365837097168,
          "orientation": 49
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.2510986328125,
          "score": 55.6155891418457,
          "orientation": 49
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.25060272216797,
          "score": 55.07119369506836,
          "orientation": 49
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.2522964477539,
          "score": 55.71714782714844,
          "orientation": 49
        },
        {
          "lon": 34.8577995300293,
          "lat": 69.24980163574219,
          "score": 53.81585693359375,
          "orientation": 49
        },
        {
          "lon": 34.8572998046875,
          "lat": 69.25,
          "score": 54.255069732666016,
          "orientation": 49
        },
        {
          "lon": 34.857601165771484,
          "lat": 69.25029754638672,
          "score": 54.3465576171875,
          "orientation": 49
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.25199890136719,
          "score": 55.76224899291992,
          "orientation": 49
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.25090026855469,
          "score": 55.56303405761719,
          "orientation": 49
        },
        {
          "lon": 34.8572998046875,
          "lat": 69.25060272216797,
          "score": 55.00822448730469,
          "orientation": 49
        },
        {
          "lon": 34.857601165771484,
          "lat": 69.25,
          "score": 54.22430419921875,
          "orientation": 49
        },
        {
          "lon": 34.8572998046875,
          "lat": 69.25029754638672,
          "score": 54.62394332885742,
          "orientation": 49
        },
        {
          "lon": 34.85559844970703,
          "lat": 69.25199890136719,
          "score": 56.0068244934082,
          "orientation": 49
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.25029754638672,
          "score": 54.7462158203125,
          "orientation": 49
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.25170135498047,
          "score": 56.15928649902344,
          "orientation": 49
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.25140380859375,
          "score": 56.07314682006836,
          "orientation": 49
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.25090026855469,
          "score": 55.915435791015625,
          "orientation": 49
        },
        {
          "lon": 34.85559844970703,
          "lat": 69.25170135498047,
          "score": 56.13526153564453,
          "orientation": 49
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.25060272216797,
          "score": 55.42264175415039,
          "orientation": 49
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.25060272216797,
          "score": 55.449058532714844,
          "orientation": 49
        },
        {
          "lon": 34.856201171875,
          "lat": 69.2510986328125,
          "score": 56.05554962158203,
          "orientation": 49
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.25090026855469,
          "score": 56.078033447265625,
          "orientation": 49
        },
        {
          "lon": 34.856201171875,
          "lat": 69.25140380859375,
          "score": 56.35027313232422,
          "orientation": 49
        }
      ]
    },
    {
      "lon": 34.41270065307617,
      "lat": 69.2511978149414,
      "score": 8.528489112854004,
      "orientation": 118,
      "points": [
        {
          "lon": 34.41230010986328,
          "lat": 69.2510986328125,
          "score": 8.574591636657715,
          "orientation": 118
        },
        {
          "lon": 34.41279983520508,
          "lat": 69.2510986328125,
          "score": 8.469322204589844,
          "orientation": 118
        },
        {
          "lon": 34.41310119628906,
          "lat": 69.25140380859375,
          "score": 8.442488670349121,
          "orientation": 118
        },
        {
          "lon": 34.412601470947266,
          "lat": 69.2510986328125,
          "score": 8.555157661437988,
          "orientation": 118
        },
        {
          "lon": 34.412601470947266,
          "lat": 69.25140380859375,
          "score": 8.600884437561035,
          "orientation": 118
        }
      ]
    },
    {
      "lon": 34.856201171875,
      "lat": 69.25140380859375,
      "score": 54.92857360839844,
      "orientation": 68,
      "points": [
        {
          "lon": 34.856998443603516,
          "lat": 69.25090026855469,
          "score": 54.50947952270508,
          "orientation": 68
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.25060272216797,
          "score": 54.125579833984375,
          "orientation": 68
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.2510986328125,
          "score": 54.67249298095703,
          "orientation": 68
        },
        {
          "lon": 34.856201171875,
          "lat": 69.25170135498047,
          "score": 54.96760177612305,
          "orientation": 68
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.2510986328125,
          "score": 54.800193786621094,
          "orientation": 68
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.25140380859375,
          "score": 54.96665573120117,
          "orientation": 68
        },
        {
          "lon": 34.85559844970703,
          "lat": 69.25170135498047,
          "score": 54.93193054199219,
          "orientation": 68
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.25090026855469,
          "score": 54.74081802368164,
          "orientation": 68
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.2522964477539,
          "score": 54.99127960205078,
          "orientation": 68
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.25090026855469,
          "score": 54.86450958251953,
          "orientation": 68
        },
        {
          "lon": 34.85530090332031,
          "lat": 69.25199890136719,
          "score": 55.06383514404297,
          "orientation": 68
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.25170135498047,
          "score": 55.22455978393555,
          "orientation": 68
        },
        {
          "lon": 34.855899810791016,
          "lat": 69.25140380859375,
          "score": 55.131595611572266,
          "orientation": 68
        },
        {
          "lon": 34.856201171875,
          "lat": 69.2510986328125,
          "score": 55.134765625,
          "orientation": 68
        },
        {
          "lon": 34.856201171875,
          "lat": 69.25140380859375,
          "score": 55.402435302734375,
          "orientation": 68
        },
        {
          "lon": 34.85639953613281,
          "lat": 69.2510986328125,
          "score": 55.3294677734375,
          "orientation": 68
        }
      ]
    },
    {
      "lon": 34.40530014038086,
      "lat": 69.25779724121094,
      "score": 9.352280616760254,
      "orientation": 123,
      "points": [
        {
          "lon": 34.40620040893555,
          "lat": 69.2583999633789,
          "score": 9.31308364868164,
          "orientation": 123
        },
        {
          "lon": 34.40510177612305,
          "lat": 69.25749969482422,
          "score": 9.394987106323242,
          "orientation": 123
        },
        {
          "lon": 34.405601501464844,
          "lat": 69.25810241699219,
          "score": 9.334817886352539,
          "orientation": 123
        },
        {
          "lon": 34.40449905395508,
          "lat": 69.2573013305664,
          "score": 9.338539123535156,
          "orientation": 123
        },
        {
          "lon": 34.40480041503906,
          "lat": 69.25749969482422,
          "score": 9.360856056213379,
          "orientation": 123
        },
        {
          "lon": 34.40589904785156,
          "lat": 69.25810241699219,
          "score": 9.371402740478516,
          "orientation": 123
        }
      ]
    },
    {
      "lon": 34.8572998046875,
      "lat": 69.2655029296875,
      "score": 32.907562255859375,
      "orientation": 59,
      "points": [
        {
          "lon": 34.8577995300293,
          "lat": 69.26499938964844,
          "score": 34.219425201416016,
          "orientation": 59
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.26589965820312,
          "score": 31.798425674438477,
          "orientation": 59
        },
        {
          "lon": 34.856998443603516,
          "lat": 69.2656021118164,
          "score": 32.85950469970703,
          "orientation": 59
        },
        {
          "lon": 34.8577995300293,
          "lat": 69.26529693603516,
          "score": 33.479408264160156,
          "orientation": 59
        },
        {
          "lon": 34.8567008972168,
          "lat": 69.26589965820312,
          "score": 31.532400131225586,
          "orientation": 59
        },
        {
          "lon": 34.857601165771484,
          "lat": 69.26529693603516,
          "score": 33.55620574951172,
          "orientation": 59
        }
      ]
    },
    {
      "lon": 34.670101165771484,
      "lat": 69.27169799804688,
      "score": 12.311393737792969,
      "orientation": 279,
      "points": [
        {
          "lon": 34.6702995300293,
          "lat": 69.27200317382812,
          "score": 12.3577299118042,
          "orientation": 279
        },
        {
          "lon": 34.6692008972168,
          "lat": 69.27140045166016,
          "score": 12.061716079711914,
          "orientation": 279
        },
        {
          "lon": 34.669498443603516,
          "lat": 69.27140045166016,
          "score": 12.157098770141602,
          "orientation": 279
        },
        {
          "lon": 34.6708984375,
          "lat": 69.27200317382812,
          "score": 12.490971565246582,
          "orientation": 279
        },
        {
          "lon": 34.669498443603516,
          "lat": 69.27169799804688,
          "score": 12.15737247467041,
          "orientation": 279
        },
        {
          "lon": 34.67060089111328,
          "lat": 69.27200317382812,
          "score": 12.43726921081543,
          "orientation": 279
        },
        {
          "lon": 34.67060089111328,
          "lat": 69.27169799804688,
          "score": 12.462130546569824,
          "orientation": 279
        },
        {
          "lon": 34.6697998046875,
          "lat": 69.27169799804688,
          "score": 12.266617774963379,
          "orientation": 279
        },
        {
          "lon": 34.6702995300293,
          "lat": 69.27169799804688,
          "score": 12.411645889282227,
          "orientation": 279
        }
      ]
    },
    {
      "lon": 34.88990020751953,
      "lat": 69.27320098876953,
      "score": 9.992588996887207,
      "orientation": 153,
      "points": [
        {
          "lon": 34.889801025390625,
          "lat": 69.27249908447266,
          "score": 10.009095191955566,
          "orientation": 153
        },
        {
          "lon": 34.889198303222656,
          "lat": 69.27169799804688,
          "score": 9.921226501464844,
          "orientation": 153
        },
        {
          "lon": 34.889198303222656,
          "lat": 69.27339935302734,
          "score": 10.008434295654297,
          "orientation": 153
        },
        {
          "lon": 34.88949966430664,
          "lat": 69.27359771728516,
          "score": 10.016489028930664,
          "orientation": 153
        },
        {
          "lon": 34.88890075683594,
          "lat": 69.27279663085938,
          "score": 9.986945152282715,
          "orientation": 153
        },
        {
          "lon": 34.88949966430664,
          "lat": 69.27200317382812,
          "score": 9.969276428222656,
          "orientation": 153
        },
        {
          "lon": 34.89030075073242,
          "lat": 69.27310180664062,
          "score": 10.024382591247559,
          "orientation": 153
        },
        {
          "lon": 34.890899658203125,
          "lat": 69.27420043945312,
          "score": 9.950265884399414,
          "orientation": 153
        },
        {
          "lon": 34.890899658203125,
          "lat": 69.2739028930664,
          "score": 9.970829010009766,
          "orientation": 153
        },
        {
          "lon": 34.89030075073242,
          "lat": 69.27339935302734,
          "score": 10.026280403137207,
          "orientation": 153
        },
        {
          "lon": 34.889801025390625,
          "lat": 69.27359771728516,
          "score": 10.029481887817383,
          "orientation": 153
        },
        {
          "lon": 34.89059829711914,
          "lat": 69.2739028930664,
          "score": 9.998353958129883,
          "orientation": 153
        }
      ]
    },
    {
      "lon": 34.64929962158203,
      "lat": 69.2759017944336,
      "score": 11.600492477416992,
      "orientation": 308,
      "points": [
        {
          "lon": 34.64950180053711,
          "lat": 69.2759017944336,
          "score": 11.395747184753418,
          "orientation": 308
        },
        {
          "lon": 34.64979934692383,
          "lat": 69.2761001586914,
          "score": 11.291569709777832,
          "orientation": 308
        },
        {
          "lon": 34.64870071411133,
          "lat": 69.27559661865234,
          "score": 11.912432670593262,
          "orientation": 308
        },
        {
          "lon": 34.65010070800781,
          "lat": 69.27639770507812,
          "score": 11.283364295959473,
          "orientation": 308
        },
        {
          "lon": 34.648399353027344,
          "lat": 69.2750015258789,
          "score": 11.885732650756836,
          "orientation": 308
        },
        {
          "lon": 34.65060043334961,
          "lat": 69.2770004272461,
          "score": 11.234797477722168,
          "orientation": 308
        },
        {
          "lon": 34.64979934692383,
          "lat": 69.27639770507812,
          "score": 11.313016891479492,
          "orientation": 308
        },
        {
          "lon": 34.64870071411133,
          "lat": 69.27529907226562,
          "score": 11.7814302444458,
          "orientation": 308
        },
        {
          "lon": 34.650299072265625,
          "lat": 69.27670288085938,
          "score": 11.281906127929688,
          "orientation": 308
        },
        {
          "lon": 34.648101806640625,
          "lat": 69.2750015258789,
          "score": 12.17155647277832,
          "orientation": 308
        },
        {
          "lon": 34.64950180053711,
          "lat": 69.2761001586914,
          "score": 11.491676330566406,
          "orientation": 308
        },
        {
          "lon": 34.648399353027344,
          "lat": 69.27529907226562,
          "score": 12.016732215881348,
          "orientation": 308
        },
        {
          "lon": 34.64889907836914,
          "lat": 69.27559661865234,
          "score": 11.746435165405273,
          "orientation": 308
        }
      ]
    },
    {
      "lon": 34.63199996948242,
      "lat": 69.28359985351562,
      "score": 71.09986877441406,
      "orientation": 28.000001907348633,
      "points": [
        {
          "lon": 34.63309860229492,
          "lat": 69.2802963256836,
          "score": 69.42880249023438,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28559875488281,
          "score": 70.82617950439453,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.27999877929688,
          "score": 68.84373474121094,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28060150146484,
          "score": 69.84719848632812,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28230285644531,
          "score": 71.53218841552734,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28230285644531,
          "score": 71.85686492919922,
          "orientation": 28
        },
        {
          "lon": 34.63370132446289,
          "lat": 69.28089904785156,
          "score": 70.03121948242188,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.2874984741211,
          "score": 68.05643463134766,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28730010986328,
          "score": 68.42527770996094,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28279876708984,
          "score": 71.96302795410156,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28389739990234,
          "score": 72.27442169189453,
          "orientation": 28
        },
        {
          "lon": 34.63010025024414,
          "lat": 69.28839874267578,
          "score": 65.79730987548828,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.28140258789062,
          "score": 70.73741149902344,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28340148925781,
          "score": 72.20905303955078,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.2802963256836,
          "score": 69.36357879638672,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28060150146484,
          "score": 69.87276458740234,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.28669738769531,
          "score": 69.63047790527344,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28359985351562,
          "score": 72.24236297607422,
          "orientation": 28
        },
        {
          "lon": 34.63370132446289,
          "lat": 69.27999877929688,
          "score": 68.74417877197266,
          "orientation": 28
        },
        {
          "lon": 34.63010025024414,
          "lat": 69.28730010986328,
          "score": 68.04137420654297,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28450012207031,
          "score": 72.13650512695312,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28199768066406,
          "score": 71.32127380371094,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28089904785156,
          "score": 70.30071258544922,
          "orientation": 28
        },
        {
          "lon": 34.63370132446289,
          "lat": 69.28060150146484,
          "score": 69.68085479736328,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28089904785156,
          "score": 70.26171875,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28109741210938,
          "score": 70.58963775634766,
          "orientation": 28
        },
        {
          "lon": 34.63370132446289,
          "lat": 69.2802963256836,
          "score": 69.26129150390625,
          "orientation": 28
        },
        {
          "lon": 34.63029861450195,
          "lat": 69.2863998413086,
          "score": 69.66439056396484,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.28500366210938,
          "score": 71.55767059326172,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28500366210938,
          "score": 71.8368911743164,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28450012207031,
          "score": 71.99344635009766,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.28060150146484,
          "score": 69.81891632080078,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28610229492188,
          "score": 70.62976837158203,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28109741210938,
          "score": 70.54057312011719,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28559875488281,
          "score": 71.27644348144531,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.28109741210938,
          "score": 70.46640014648438,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28309631347656,
          "score": 72.2713623046875,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28250122070312,
          "score": 71.86368560791016,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28170013427734,
          "score": 71.14144134521484,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28199768066406,
          "score": 71.6624755859375,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28109741210938,
          "score": 70.51703643798828,
          "orientation": 28
        },
        {
          "lon": 34.633399963378906,
          "lat": 69.28089904785156,
          "score": 70.27461242675781,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28309631347656,
          "score": 72.20903778076172,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28199768066406,
          "score": 71.52394104003906,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28250122070312,
          "score": 72.05886840820312,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28359985351562,
          "score": 72.36451721191406,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28140258789062,
          "score": 70.94123077392578,
          "orientation": 28
        },
        {
          "lon": 34.63029861450195,
          "lat": 69.28669738769531,
          "score": 69.27690887451172,
          "orientation": 28
        },
        {
          "lon": 34.63309860229492,
          "lat": 69.28140258789062,
          "score": 70.8564224243164,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28230285644531,
          "score": 71.78028869628906,
          "orientation": 28
        },
        {
          "lon": 34.6328010559082,
          "lat": 69.28170013427734,
          "score": 71.27649688720703,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28589630126953,
          "score": 70.6088638305664,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28389739990234,
          "score": 72.31693267822266,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.2842025756836,
          "score": 72.33780670166016,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28250122070312,
          "score": 72.0011215209961,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28700256347656,
          "score": 69.05426025390625,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28279876708984,
          "score": 72.16114044189453,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.2853012084961,
          "score": 71.4205322265625,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28479766845703,
          "score": 72.08203887939453,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28479766845703,
          "score": 71.96842193603516,
          "orientation": 28
        },
        {
          "lon": 34.632598876953125,
          "lat": 69.28230285644531,
          "score": 71.93279266357422,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28610229492188,
          "score": 70.44286346435547,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.2853012084961,
          "score": 71.69563293457031,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28230285644531,
          "score": 72.02812957763672,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28340148925781,
          "score": 72.4812240600586,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28309631347656,
          "score": 72.4233627319336,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28340148925781,
          "score": 72.51710510253906,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28389739990234,
          "score": 72.5438003540039,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28279876708984,
          "score": 72.36942291259766,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28279876708984,
          "score": 72.3985824584961,
          "orientation": 28
        },
        {
          "lon": 34.63029861450195,
          "lat": 69.28780364990234,
          "score": 67.48429107666016,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28589630126953,
          "score": 71.1085433959961,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.28669738769531,
          "score": 69.70130920410156,
          "orientation": 28
        },
        {
          "lon": 34.63059997558594,
          "lat": 69.2863998413086,
          "score": 70.13984680175781,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.28559875488281,
          "score": 71.29629516601562,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.2842025756836,
          "score": 72.43810272216797,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.28589630126953,
          "score": 70.99484252929688,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.2863998413086,
          "score": 70.36210632324219,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28450012207031,
          "score": 72.43311309814453,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28359985351562,
          "score": 72.66650390625,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28500366210938,
          "score": 72.10517883300781,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28559875488281,
          "score": 71.5357437133789,
          "orientation": 28
        },
        {
          "lon": 34.63090133666992,
          "lat": 69.28610229492188,
          "score": 70.82108306884766,
          "orientation": 28
        },
        {
          "lon": 34.632301330566406,
          "lat": 69.28250122070312,
          "score": 72.35310363769531,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.28359985351562,
          "score": 72.6924819946289,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28340148925781,
          "score": 72.7042007446289,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.28500366210938,
          "score": 72.10222625732422,
          "orientation": 28
        },
        {
          "lon": 34.63119888305664,
          "lat": 69.2853012084961,
          "score": 71.89846801757812,
          "orientation": 28
        },
        {
          "lon": 34.63199996948242,
          "lat": 69.28309631347656,
          "score": 72.73706817626953,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28479766845703,
          "score": 72.41217803955078,
          "orientation": 28
        },
        {
          "lon": 34.63140106201172,
          "lat": 69.28450012207031,
          "score": 72.57738494873047,
          "orientation": 28
        },
        {
          "lon": 34.63169860839844,
          "lat": 69.2842025756836,
          "score": 72.76221466064453,
          "orientation": 28
        }
      ]
    },
    {
      "lon": 35.02619934082031,
      "lat": 69.28489685058594,
      "score": 24.280033111572266,
      "orientation": 177.99996948242188,
      "points": [
        {
          "lon": 35.025901794433594,
          "lat": 69.28610229492188,
          "score": 24.167905807495117,
          "orientation": 178
        },
        {
          "lon": 35.02669906616211,
          "lat": 69.28500366210938,
          "score": 24.287601470947266,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.2842025756836,
          "score": 24.252002716064453,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28610229492188,
          "score": 24.17795181274414,
          "orientation": 178
        },
        {
          "lon": 35.02669906616211,
          "lat": 69.28450012207031,
          "score": 24.272741317749023,
          "orientation": 178
        },
        {
          "lon": 35.02669906616211,
          "lat": 69.28479766845703,
          "score": 24.288278579711914,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.28450012207031,
          "score": 24.28510093688965,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28589630126953,
          "score": 24.21932601928711,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.28559875488281,
          "score": 24.25863265991211,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.28479766845703,
          "score": 24.301061630249023,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.28589630126953,
          "score": 24.212818145751953,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28359985351562,
          "score": 24.15086555480957,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.28500366210938,
          "score": 24.30254554748535,
          "orientation": 178
        },
        {
          "lon": 35.025901794433594,
          "lat": 69.2853012084961,
          "score": 24.29061508178711,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28359985351562,
          "score": 24.159130096435547,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28589630126953,
          "score": 24.23338508605957,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28559875488281,
          "score": 24.282270431518555,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28389739990234,
          "score": 24.240463256835938,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28389739990234,
          "score": 24.244518280029297,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.2853012084961,
          "score": 24.328170776367188,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28559875488281,
          "score": 24.302392959594727,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.2842025756836,
          "score": 24.313371658325195,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.2842025756836,
          "score": 24.316198348999023,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28500366210938,
          "score": 24.367462158203125,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28450012207031,
          "score": 24.360082626342773,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28450012207031,
          "score": 24.364553451538086,
          "orientation": 178
        },
        {
          "lon": 35.02640151977539,
          "lat": 69.28479766845703,
          "score": 24.377887725830078,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.2853012084961,
          "score": 24.36980438232422,
          "orientation": 178
        },
        {
          "lon": 35.02619934082031,
          "lat": 69.28479766845703,
          "score": 24.39374542236328,
          "orientation": 178
        }
      ]
    },
    {
      "lon": 34.55720138549805,
      "lat": 69.28970336914062,
      "score": 14.062569618225098,
      "orientation": 118,
      "points": [
        {
          "lon": 34.56169891357422,
          "lat": 69.29109954833984,
          "score": 13.564154624938965,
          "orientation": 118
        },
        {
          "lon": 34.555599212646484,
          "lat": 69.28919982910156,
          "score": 14.362896919250488,
          "orientation": 118
        },
        {
          "lon": 34.5547981262207,
          "lat": 69.2885971069336,
          "score": 14.161145210266113,
          "orientation": 118
        },
        {
          "lon": 34.556400299072266,
          "lat": 69.28949737548828,
          "score": 14.495898246765137,
          "orientation": 118
        },
        {
          "lon": 34.55730056762695,
          "lat": 69.28980255126953,
          "score": 14.555557250976562,
          "orientation": 118
        },
        {
          "lon": 34.555599212646484,
          "lat": 69.28890228271484,
          "score": 14.378894805908203,
          "orientation": 118
        },
        {
          "lon": 34.554500579833984,
          "lat": 69.28839874267578,
          "score": 14.063050270080566,
          "orientation": 118
        },
        {
          "lon": 34.55509948730469,
          "lat": 69.2885971069336,
          "score": 14.25373363494873,
          "orientation": 118
        },
        {
          "lon": 34.55699920654297,
          "lat": 69.28980255126953,
          "score": 14.54000186920166,
          "orientation": 118
        },
        {
          "lon": 34.555301666259766,
          "lat": 69.28890228271484,
          "score": 14.313971519470215,
          "orientation": 118
        },
        {
          "lon": 34.55590057373047,
          "lat": 69.28919982910156,
          "score": 14.44330883026123,
          "orientation": 118
        },
        {
          "lon": 34.55670166015625,
          "lat": 69.28949737548828,
          "score": 14.550775527954102,
          "orientation": 118
        },
        {
          "lon": 34.5630989074707,
          "lat": 69.29199981689453,
          "score": 12.429825782775879,
          "orientation": 118
        },
        {
          "lon": 34.55619812011719,
          "lat": 69.28919982910156,
          "score": 14.510764122009277,
          "orientation": 118
        },
        {
          "lon": 34.56340026855469,
          "lat": 69.29199981689453,
          "score": 12.314570426940918,
          "orientation": 118
        }
      ]
    },
    {
      "lon": 34.73540115356445,
      "lat": 69.29969787597656,
      "score": 15.842954635620117,
      "orientation": 23.000001907348633,
      "points": [
        {
          "lon": 34.73619842529297,
          "lat": 69.29779815673828,
          "score": 15.614144325256348,
          "orientation": 23
        },
        {
          "lon": 34.73529815673828,
          "lat": 69.29920196533203,
          "score": 15.866585731506348,
          "orientation": 23
        },
        {
          "lon": 34.734798431396484,
          "lat": 69.30139923095703,
          "score": 15.710232734680176,
          "orientation": 23
        },
        {
          "lon": 34.73509979248047,
          "lat": 69.3009033203125,
          "score": 15.811240196228027,
          "orientation": 23
        },
        {
          "lon": 34.73590087890625,
          "lat": 69.29840087890625,
          "score": 15.76246166229248,
          "orientation": 23
        },
        {
          "lon": 34.734798431396484,
          "lat": 69.30110168457031,
          "score": 15.767293930053711,
          "orientation": 23
        },
        {
          "lon": 34.73619842529297,
          "lat": 69.29810333251953,
          "score": 15.690117835998535,
          "orientation": 23
        },
        {
          "lon": 34.734798431396484,
          "lat": 69.30059814453125,
          "score": 15.83324146270752,
          "orientation": 23
        },
        {
          "lon": 34.735599517822266,
          "lat": 69.29889678955078,
          "score": 15.853322982788086,
          "orientation": 23
        },
        {
          "lon": 34.73509979248047,
          "lat": 69.30000305175781,
          "score": 15.906222343444824,
          "orientation": 23
        },
        {
          "lon": 34.73529815673828,
          "lat": 69.29949951171875,
          "score": 15.912334442138672,
          "orientation": 23
        },
        {
          "lon": 34.73590087890625,
          "lat": 69.29859924316406,
          "score": 15.821789741516113,
          "orientation": 23
        },
        {
          "lon": 34.73590087890625,
          "lat": 69.29889678955078,
          "score": 15.860613822937012,
          "orientation": 23
        },
        {
          "lon": 34.734798431396484,
          "lat": 69.3009033203125,
          "score": 15.834049224853516,
          "orientation": 23
        },
        {
          "lon": 34.735599517822266,
          "lat": 69.29920196533203,
          "score": 15.932969093322754,
          "orientation": 23
        },
        {
          "lon": 34.73509979248047,
          "lat": 69.30059814453125,
          "score": 15.917604446411133,
          "orientation": 23
        },
        {
          "lon": 34.73509979248047,
          "lat": 69.30030059814453,
          "score": 15.956901550292969,
          "orientation": 23
        },
        {
          "lon": 34.735599517822266,
          "lat": 69.29949951171875,
          "score": 15.977788925170898,
          "orientation": 23
        },
        {
          "lon": 34.73529815673828,
          "lat": 69.29979705810547,
          "score": 15.987249374389648,
          "orientation": 23
        }
      ]
    },
    {
      "lon": 34.84230041503906,
      "lat": 69.30960083007812,
      "score": 9.682339668273926,
      "orientation": 347.9999694824219,
      "points": [
        {
          "lon": 34.84230041503906,
          "lat": 69.30950164794922,
          "score": 9.668183326721191,
          "orientation": 348
        },
        {
          "lon": 34.84260177612305,
          "lat": 69.310302734375,
          "score": 9.656328201293945,
          "orientation": 348
        },
        {
          "lon": 34.84199905395508,
          "lat": 69.30889892578125,
          "score": 9.678145408630371,
          "orientation": 348
        },
        {
          "lon": 34.84199905395508,
          "lat": 69.30860137939453,
          "score": 9.66249942779541,
          "orientation": 348
        },
        {
          "lon": 34.84230041503906,
          "lat": 69.30979919433594,
          "score": 9.746540069580078,
          "orientation": 348
        }
      ]
    },
    {
      "lon": 34.691001892089844,
      "lat": 69.3333969116211,
      "score": 12.170116424560547,
      "orientation": 338,
      "points": [
        {
          "lon": 34.69139862060547,
          "lat": 69.33390045166016,
          "score": 12.060081481933594,
          "orientation": 338
        },
        {
          "lon": 34.69089889526367,
          "lat": 69.3324966430664,
          "score": 12.336165428161621,
          "orientation": 338
        },
        {
          "lon": 34.69060134887695,
          "lat": 69.3322982788086,
          "score": 12.321927070617676,
          "orientation": 338
        },
        {
          "lon": 34.69060134887695,
          "lat": 69.33200073242188,
          "score": 12.299885749816895,
          "orientation": 338
        },
        {
          "lon": 34.69060134887695,
          "lat": 69.33280181884766,
          "score": 12.060866355895996,
          "orientation": 338
        },
        {
          "lon": 34.69139862060547,
          "lat": 69.33480072021484,
          "score": 11.988155364990234,
          "orientation": 338
        },
        {
          "lon": 34.691200256347656,
          "lat": 69.3333969116211,
          "score": 12.093658447265625,
          "orientation": 338
        },
        {
          "lon": 34.691200256347656,
          "lat": 69.33419799804688,
          "score": 12.07022476196289,
          "orientation": 338
        },
        {
          "lon": 34.69060134887695,
          "lat": 69.3324966430664,
          "score": 12.370560646057129,
          "orientation": 338
        },
        {
          "lon": 34.69139862060547,
          "lat": 69.33450317382812,
          "score": 12.0565185546875,
          "orientation": 338
        },
        {
          "lon": 34.69139862060547,
          "lat": 69.33419799804688,
          "score": 12.089591026306152,
          "orientation": 338
        },
        {
          "lon": 34.69089889526367,
          "lat": 69.33280181884766,
          "score": 12.136301040649414,
          "orientation": 338
        },
        {
          "lon": 34.69089889526367,
          "lat": 69.3333969116211,
          "score": 12.178242683410645,
          "orientation": 338
        },
        {
          "lon": 34.691200256347656,
          "lat": 69.33360290527344,
          "score": 12.248421669006348,
          "orientation": 338
        },
        {
          "lon": 34.691200256347656,
          "lat": 69.33390045166016,
          "score": 12.241146087646484,
          "orientation": 338
        }
      ]
    },
    {
      "lon": 34.825199127197266,
      "lat": 69.33719635009766,
      "score": 84.77265930175781,
      "orientation": 323,
      "points": [
        {
          "lon": 34.82870101928711,
          "lat": 69.34200286865234,
          "score": 81.37947845458984,
          "orientation": 323
        },
        {
          "lon": 34.82889938354492,
          "lat": 69.34310150146484,
          "score": 77.97628784179688,
          "orientation": 323
        },
        {
          "lon": 34.829200744628906,
          "lat": 69.3427963256836,
          "score": 78.28418731689453,
          "orientation": 323
        },
        {
          "lon": 34.8213996887207,
          "lat": 69.33200073242188,
          "score": 80.31939697265625,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33529663085938,
          "score": 90.05625915527344,
          "orientation": 323
        },
        {
          "lon": 34.82229995727539,
          "lat": 69.33450317382812,
          "score": 87.22811126708984,
          "orientation": 323
        },
        {
          "lon": 34.82529830932617,
          "lat": 69.33670043945312,
          "score": 91.170654296875,
          "orientation": 323
        },
        {
          "lon": 34.826698303222656,
          "lat": 69.34030151367188,
          "score": 87.70365142822266,
          "orientation": 323
        },
        {
          "lon": 34.822601318359375,
          "lat": 69.33390045166016,
          "score": 86.71466064453125,
          "orientation": 323
        },
        {
          "lon": 34.8213996887207,
          "lat": 69.3322982788086,
          "score": 81.09725189208984,
          "orientation": 323
        },
        {
          "lon": 34.82170104980469,
          "lat": 69.3322982788086,
          "score": 81.67753601074219,
          "orientation": 323
        },
        {
          "lon": 34.82640075683594,
          "lat": 69.3395004272461,
          "score": 89.1429214477539,
          "orientation": 323
        },
        {
          "lon": 34.82529830932617,
          "lat": 69.3375015258789,
          "score": 91.2527847290039,
          "orientation": 323
        },
        {
          "lon": 34.82419967651367,
          "lat": 69.33589935302734,
          "score": 90.98480987548828,
          "orientation": 323
        },
        {
          "lon": 34.82889938354492,
          "lat": 69.34249877929688,
          "score": 79.71009063720703,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33390045166016,
          "score": 87.97184753417969,
          "orientation": 323
        },
        {
          "lon": 34.82780075073242,
          "lat": 69.3416976928711,
          "score": 83.5848388671875,
          "orientation": 323
        },
        {
          "lon": 34.825599670410156,
          "lat": 69.33719635009766,
          "score": 91.23899841308594,
          "orientation": 323
        },
        {
          "lon": 34.82809829711914,
          "lat": 69.34200286865234,
          "score": 82.39649963378906,
          "orientation": 323
        },
        {
          "lon": 34.82509994506836,
          "lat": 69.33609771728516,
          "score": 90.85848236083984,
          "orientation": 323
        },
        {
          "lon": 34.82619857788086,
          "lat": 69.33920288085938,
          "score": 89.63136291503906,
          "orientation": 323
        },
        {
          "lon": 34.821998596191406,
          "lat": 69.33309936523438,
          "score": 84.14154052734375,
          "orientation": 323
        },
        {
          "lon": 34.828399658203125,
          "lat": 69.3416976928711,
          "score": 82.68350219726562,
          "orientation": 323
        },
        {
          "lon": 34.828399658203125,
          "lat": 69.34230041503906,
          "score": 81.1512451171875,
          "orientation": 323
        },
        {
          "lon": 34.82529830932617,
          "lat": 69.33719635009766,
          "score": 91.29045104980469,
          "orientation": 323
        },
        {
          "lon": 34.825599670410156,
          "lat": 69.33809661865234,
          "score": 91.04730224609375,
          "orientation": 323
        },
        {
          "lon": 34.821998596191406,
          "lat": 69.3324966430664,
          "score": 82.73321533203125,
          "orientation": 323
        },
        {
          "lon": 34.82310104370117,
          "lat": 69.33419799804688,
          "score": 87.93290710449219,
          "orientation": 323
        },
        {
          "lon": 34.82170104980469,
          "lat": 69.3324966430664,
          "score": 82.20470428466797,
          "orientation": 323
        },
        {
          "lon": 34.824798583984375,
          "lat": 69.33560180664062,
          "score": 90.70360565185547,
          "orientation": 323
        },
        {
          "lon": 34.82229995727539,
          "lat": 69.3324966430664,
          "score": 83.22416687011719,
          "orientation": 323
        },
        {
          "lon": 34.821998596191406,
          "lat": 69.33280181884766,
          "score": 83.48076629638672,
          "orientation": 323
        },
        {
          "lon": 34.826698303222656,
          "lat": 69.33920288085938,
          "score": 89.32428741455078,
          "orientation": 323
        },
        {
          "lon": 34.82509994506836,
          "lat": 69.33670043945312,
          "score": 91.20983123779297,
          "orientation": 323
        },
        {
          "lon": 34.82310104370117,
          "lat": 69.3333969116211,
          "score": 86.4234619140625,
          "orientation": 323
        },
        {
          "lon": 34.82389831542969,
          "lat": 69.33529663085938,
          "score": 90.28067779541016,
          "orientation": 323
        },
        {
          "lon": 34.82419967651367,
          "lat": 69.33480072021484,
          "score": 89.85894775390625,
          "orientation": 323
        },
        {
          "lon": 34.82229995727539,
          "lat": 69.33309936523438,
          "score": 84.69134521484375,
          "orientation": 323
        },
        {
          "lon": 34.822601318359375,
          "lat": 69.33280181884766,
          "score": 84.4535140991211,
          "orientation": 323
        },
        {
          "lon": 34.827598571777344,
          "lat": 69.34110260009766,
          "score": 85.28565216064453,
          "orientation": 323
        },
        {
          "lon": 34.822601318359375,
          "lat": 69.33360290527344,
          "score": 86.22293090820312,
          "orientation": 323
        },
        {
          "lon": 34.82229995727539,
          "lat": 69.33280181884766,
          "score": 84.01871490478516,
          "orientation": 323
        },
        {
          "lon": 34.828399658203125,
          "lat": 69.34200286865234,
          "score": 81.99027252197266,
          "orientation": 323
        },
        {
          "lon": 34.82339859008789,
          "lat": 69.33360290527344,
          "score": 87.196533203125,
          "orientation": 323
        },
        {
          "lon": 34.824798583984375,
          "lat": 69.33609771728516,
          "score": 90.89080047607422,
          "orientation": 323
        },
        {
          "lon": 34.82699966430664,
          "lat": 69.34030151367188,
          "score": 87.53803253173828,
          "orientation": 323
        },
        {
          "lon": 34.824501037597656,
          "lat": 69.33589935302734,
          "score": 90.93612670898438,
          "orientation": 323
        },
        {
          "lon": 34.827598571777344,
          "lat": 69.3405990600586,
          "score": 86.3283920288086,
          "orientation": 323
        },
        {
          "lon": 34.82640075683594,
          "lat": 69.33889770507812,
          "score": 89.9351577758789,
          "orientation": 323
        },
        {
          "lon": 34.81340026855469,
          "lat": 69.32389831542969,
          "score": 21.407318115234375,
          "orientation": 323
        },
        {
          "lon": 34.82640075683594,
          "lat": 69.33979797363281,
          "score": 88.85685729980469,
          "orientation": 323
        },
        {
          "lon": 34.82619857788086,
          "lat": 69.33889770507812,
          "score": 90.08733367919922,
          "orientation": 323
        },
        {
          "lon": 34.824798583984375,
          "lat": 69.33589935302734,
          "score": 90.79529571533203,
          "orientation": 323
        },
        {
          "lon": 34.815101623535156,
          "lat": 69.32589721679688,
          "score": 33.3975944519043,
          "orientation": 323
        },
        {
          "lon": 34.82699966430664,
          "lat": 69.33999633789062,
          "score": 88.11744689941406,
          "orientation": 323
        },
        {
          "lon": 34.822601318359375,
          "lat": 69.33309936523438,
          "score": 85.24918365478516,
          "orientation": 323
        },
        {
          "lon": 34.82640075683594,
          "lat": 69.34030151367188,
          "score": 88.1047134399414,
          "orientation": 323
        },
        {
          "lon": 34.824501037597656,
          "lat": 69.33529663085938,
          "score": 90.7632827758789,
          "orientation": 323
        },
        {
          "lon": 34.82310104370117,
          "lat": 69.33360290527344,
          "score": 87.00494384765625,
          "orientation": 323
        },
        {
          "lon": 34.82419967651367,
          "lat": 69.33529663085938,
          "score": 90.66832733154297,
          "orientation": 323
        },
        {
          "lon": 34.82419967651367,
          "lat": 69.33499908447266,
          "score": 90.31694793701172,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33419799804688,
          "score": 88.75896453857422,
          "orientation": 323
        },
        {
          "lon": 34.830101013183594,
          "lat": 69.34420013427734,
          "score": 72.2322998046875,
          "orientation": 323
        },
        {
          "lon": 34.82310104370117,
          "lat": 69.33390045166016,
          "score": 87.63075256347656,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33450317382812,
          "score": 89.2734603881836,
          "orientation": 323
        }
      ]
    },
    {
      "lon": 34.82529830932617,
      "lat": 69.33719635009766,
      "score": 86.1883773803711,
      "orientation": 323.0000305175781,
      "points": [
        {
          "lon": 34.82889938354492,
          "lat": 69.34140014648438,
          "score": 82.42338562011719,
          "orientation": 323
        },
        {
          "lon": 34.82509994506836,
          "lat": 69.33719635009766,
          "score": 91.25763702392578,
          "orientation": 323
        },
        {
          "lon": 34.82640075683594,
          "lat": 69.3386001586914,
          "score": 90.073486328125,
          "orientation": 323
        },
        {
          "lon": 34.82389831542969,
          "lat": 69.33560180664062,
          "score": 90.52682495117188,
          "orientation": 323
        },
        {
          "lon": 34.82590103149414,
          "lat": 69.33779907226562,
          "score": 91.0599594116211,
          "orientation": 323
        },
        {
          "lon": 34.82809829711914,
          "lat": 69.34110260009766,
          "score": 84.49948120117188,
          "orientation": 323
        },
        {
          "lon": 34.82699966430664,
          "lat": 69.3395004272461,
          "score": 88.65632629394531,
          "orientation": 323
        },
        {
          "lon": 34.82509994506836,
          "lat": 69.33699798583984,
          "score": 91.24304962158203,
          "orientation": 323
        },
        {
          "lon": 34.827598571777344,
          "lat": 69.34030151367188,
          "score": 86.76177215576172,
          "orientation": 323
        },
        {
          "lon": 34.829200744628906,
          "lat": 69.34310150146484,
          "score": 77.40499877929688,
          "orientation": 323
        },
        {
          "lon": 34.825599670410156,
          "lat": 69.3375015258789,
          "score": 91.2255859375,
          "orientation": 323
        },
        {
          "lon": 34.82699966430664,
          "lat": 69.3405990600586,
          "score": 86.90875244140625,
          "orientation": 323
        },
        {
          "lon": 34.824501037597656,
          "lat": 69.33609771728516,
          "score": 90.70134735107422,
          "orientation": 323
        },
        {
          "lon": 34.82870101928711,
          "lat": 69.34249877929688,
          "score": 80.09089660644531,
          "orientation": 323
        },
        {
          "lon": 34.82590103149414,
          "lat": 69.3386001586914,
          "score": 90.34598541259766,
          "orientation": 323
        },
        {
          "lon": 34.82529830932617,
          "lat": 69.33699798583984,
          "score": 91.27051544189453,
          "orientation": 323
        },
        {
          "lon": 34.82889938354492,
          "lat": 69.3427963256836,
          "score": 78.89370727539062,
          "orientation": 323
        },
        {
          "lon": 34.821998596191406,
          "lat": 69.3322982788086,
          "score": 82.22444152832031,
          "orientation": 323
        },
        {
          "lon": 34.82339859008789,
          "lat": 69.33480072021484,
          "score": 89.18818664550781,
          "orientation": 323
        },
        {
          "lon": 34.82229995727539,
          "lat": 69.3333969116211,
          "score": 85.29843139648438,
          "orientation": 323
        },
        {
          "lon": 34.824798583984375,
          "lat": 69.3364028930664,
          "score": 91.01798248291016,
          "orientation": 323
        },
        {
          "lon": 34.826698303222656,
          "lat": 69.33999633789062,
          "score": 88.25021362304688,
          "orientation": 323
        },
        {
          "lon": 34.825599670410156,
          "lat": 69.33779907226562,
          "score": 91.18960571289062,
          "orientation": 323
        },
        {
          "lon": 34.827301025390625,
          "lat": 69.34089660644531,
          "score": 86.04010009765625,
          "orientation": 323
        },
        {
          "lon": 34.82870101928711,
          "lat": 69.34230041503906,
          "score": 80.64884185791016,
          "orientation": 323
        },
        {
          "lon": 34.82780075073242,
          "lat": 69.34089660644531,
          "score": 85.41191101074219,
          "orientation": 323
        },
        {
          "lon": 34.82619857788086,
          "lat": 69.3384017944336,
          "score": 90.38133239746094,
          "orientation": 323
        },
        {
          "lon": 34.827301025390625,
          "lat": 69.33999633789062,
          "score": 87.67097473144531,
          "orientation": 323
        },
        {
          "lon": 34.82279968261719,
          "lat": 69.33309936523438,
          "score": 85.39177703857422,
          "orientation": 323
        },
        {
          "lon": 34.82809829711914,
          "lat": 69.34140014648438,
          "score": 83.89482879638672,
          "orientation": 323
        },
        {
          "lon": 34.82590103149414,
          "lat": 69.33809661865234,
          "score": 90.993896484375,
          "orientation": 323
        },
        {
          "lon": 34.82509994506836,
          "lat": 69.3364028930664,
          "score": 91.09407806396484,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33499908447266,
          "score": 89.77896118164062,
          "orientation": 323
        },
        {
          "lon": 34.82780075073242,
          "lat": 69.34140014648438,
          "score": 84.35599517822266,
          "orientation": 323
        },
        {
          "lon": 34.82809829711914,
          "lat": 69.3416976928711,
          "score": 83.23103332519531,
          "orientation": 323
        },
        {
          "lon": 34.82780075073242,
          "lat": 69.34110260009766,
          "score": 85.0244369506836,
          "orientation": 323
        },
        {
          "lon": 34.82389831542969,
          "lat": 69.33450317382812,
          "score": 89.25035095214844,
          "orientation": 323
        },
        {
          "lon": 34.82699966430664,
          "lat": 69.33979797363281,
          "score": 88.3392562866211,
          "orientation": 323
        },
        {
          "lon": 34.82419967651367,
          "lat": 69.33560180664062,
          "score": 90.83063507080078,
          "orientation": 323
        },
        {
          "lon": 34.827301025390625,
          "lat": 69.3405990600586,
          "score": 86.7044906616211,
          "orientation": 323
        },
        {
          "lon": 34.827301025390625,
          "lat": 69.34030151367188,
          "score": 87.2452621459961,
          "orientation": 323
        },
        {
          "lon": 34.822601318359375,
          "lat": 69.3333969116211,
          "score": 85.8622817993164,
          "orientation": 323
        },
        {
          "lon": 34.82279968261719,
          "lat": 69.33390045166016,
          "score": 87.13594055175781,
          "orientation": 323
        },
        {
          "lon": 34.826698303222656,
          "lat": 69.3395004272461,
          "score": 89.07820892333984,
          "orientation": 323
        },
        {
          "lon": 34.827598571777344,
          "lat": 69.34089660644531,
          "score": 85.80256652832031,
          "orientation": 323
        },
        {
          "lon": 34.82619857788086,
          "lat": 69.3386001586914,
          "score": 90.38284301757812,
          "orientation": 323
        },
        {
          "lon": 34.82590103149414,
          "lat": 69.3384017944336,
          "score": 90.65850830078125,
          "orientation": 323
        },
        {
          "lon": 34.826698303222656,
          "lat": 69.33979797363281,
          "score": 88.70679473876953,
          "orientation": 323
        },
        {
          "lon": 34.82389831542969,
          "lat": 69.33499908447266,
          "score": 90.05669403076172,
          "orientation": 323
        },
        {
          "lon": 34.82279968261719,
          "lat": 69.33360290527344,
          "score": 86.60651397705078,
          "orientation": 323
        },
        {
          "lon": 34.82339859008789,
          "lat": 69.33390045166016,
          "score": 87.89215087890625,
          "orientation": 323
        },
        {
          "lon": 34.823699951171875,
          "lat": 69.33480072021484,
          "score": 89.65780639648438,
          "orientation": 323
        },
        {
          "lon": 34.82279968261719,
          "lat": 69.3333969116211,
          "score": 86.20352172851562,
          "orientation": 323
        },
        {
          "lon": 34.824501037597656,
          "lat": 69.33560180664062,
          "score": 91.1140365600586,
          "orientation": 323
        },
        {
          "lon": 34.82339859008789,
          "lat": 69.33450317382812,
          "score": 88.99623107910156,
          "orientation": 323
        },
        {
          "lon": 34.830101013183594,
          "lat": 69.34390258789062,
          "score": 73.22433471679688,
          "orientation": 323
        },
        {
          "lon": 34.812599182128906,
          "lat": 69.32450103759766,
          "score": 20.788761138916016,
          "orientation": 323
        },
        {
          "lon": 34.82389831542969,
          "lat": 69.33480072021484,
          "score": 89.95820617675781,
          "orientation": 323
        }
      ]
    },
    {
      "lon": 34.9838981628418,
      "lat": 69.34929656982422,
      "score": 30.36616325378418,
      "orientation": 142.99996948242188,
      "points": [
        {
          "lon": 34.9822998046875,
          "lat": 69.34860229492188,
          "score": 30.135875701904297,
          "orientation": 143
        },
        {
          "lon": 34.984798431396484,
          "lat": 69.35060119628906,
          "score": 29.850330352783203,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.34860229492188,
          "score": 30.347864151000977,
          "orientation": 143
        },
        {
          "lon": 34.98310089111328,
          "lat": 69.34950256347656,
          "score": 30.364246368408203,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.3499984741211,
          "score": 30.35792350769043,
          "orientation": 143
        },
        {
          "lon": 34.98310089111328,
          "lat": 69.3488998413086,
          "score": 30.37040138244629,
          "orientation": 143
        },
        {
          "lon": 34.9833984375,
          "lat": 69.34860229492188,
          "score": 30.381954193115234,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.35060119628906,
          "score": 29.90123176574707,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.34839630126953,
          "score": 30.36998748779297,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.34950256347656,
          "score": 30.378089904785156,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.34860229492188,
          "score": 30.388511657714844,
          "orientation": 143
        },
        {
          "lon": 34.984798431396484,
          "lat": 69.3488998413086,
          "score": 30.325340270996094,
          "orientation": 143
        },
        {
          "lon": 34.9833984375,
          "lat": 69.34980010986328,
          "score": 30.375591278076172,
          "orientation": 143
        },
        {
          "lon": 34.984798431396484,
          "lat": 69.34950256347656,
          "score": 30.322895050048828,
          "orientation": 143
        },
        {
          "lon": 34.98310089111328,
          "lat": 69.34919738769531,
          "score": 30.38238525390625,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.34860229492188,
          "score": 30.407934188842773,
          "orientation": 143
        },
        {
          "lon": 34.9838981628418,
          "lat": 69.34860229492188,
          "score": 30.410511016845703,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.3488998413086,
          "score": 30.425519943237305,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.34950256347656,
          "score": 30.422250747680664,
          "orientation": 143
        },
        {
          "lon": 34.9833984375,
          "lat": 69.3488998413086,
          "score": 30.421039581298828,
          "orientation": 143
        },
        {
          "lon": 34.984798431396484,
          "lat": 69.34919738769531,
          "score": 30.34287452697754,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.3488998413086,
          "score": 30.39078140258789,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.34919738769531,
          "score": 30.406219482421875,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.3499984741211,
          "score": 30.371379852294922,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.34980010986328,
          "score": 30.418193817138672,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.34919738769531,
          "score": 30.463369369506836,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.34919738769531,
          "score": 30.449865341186523,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.3488998413086,
          "score": 30.45878791809082,
          "orientation": 143
        },
        {
          "lon": 34.9838981628418,
          "lat": 69.34980010986328,
          "score": 30.423757553100586,
          "orientation": 143
        },
        {
          "lon": 34.9833984375,
          "lat": 69.34919738769531,
          "score": 30.448205947875977,
          "orientation": 143
        },
        {
          "lon": 34.9838981628418,
          "lat": 69.34950256347656,
          "score": 30.457347869873047,
          "orientation": 143
        },
        {
          "lon": 34.9838981628418,
          "lat": 69.3488998413086,
          "score": 30.461196899414062,
          "orientation": 143
        },
        {
          "lon": 34.9838981628418,
          "lat": 69.34919738769531,
          "score": 30.47918128967285,
          "orientation": 143
        },
        {
          "lon": 34.98419952392578,
          "lat": 69.34980010986328,
          "score": 30.43045997619629,
          "orientation": 143
        },
        {
          "lon": 34.984500885009766,
          "lat": 69.3499984741211,
          "score": 30.362442016601562,
          "orientation": 143
        },
        {
          "lon": 34.983699798583984,
          "lat": 69.34950256347656,
          "score": 30.477733612060547,
          "orientation": 143
        }
      ]
    },
    {
      "lon": 34.6797981262207,
      "lat": 69.37310028076172,
      "score": 9.38588809967041,
      "orientation": 3,
      "points": [
        {
          "lon": 34.6797981262207,
          "lat": 69.37200164794922,
          "score": 9.307806015014648,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.37419891357422,
          "score": 9.446211814880371,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.37229919433594,
          "score": 9.310665130615234,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.3739013671875,
          "score": 9.487574577331543,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.37249755859375,
          "score": 9.32098388671875,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.37359619140625,
          "score": 9.541374206542969,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.372802734375,
          "score": 9.335569381713867,
          "orientation": 3
        },
        {
          "lon": 34.6797981262207,
          "lat": 69.37310028076172,
          "score": 9.336923599243164,
          "orientation": 3
        }
      ]
    },
    {
      "lon": 34.894100189208984,
      "lat": 69.39900207519531,
      "score": 21.745426177978516,
      "orientation": 328.0000305175781,
      "points": [
        {
          "lon": 34.894500732421875,
          "lat": 69.39949798583984,
          "score": 21.870891571044922,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.39810180664062,
          "score": 21.67677116394043,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.40029907226562,
          "score": 21.77956771850586,
          "orientation": 328
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.39859771728516,
          "score": 21.71990203857422,
          "orientation": 328
        },
        {
          "lon": 34.89509963989258,
          "lat": 69.40170288085938,
          "score": 21.277475357055664,
          "orientation": 328
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.39779663085938,
          "score": 21.6108455657959,
          "orientation": 328
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.39859771728516,
          "score": 21.721101760864258,
          "orientation": 328
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.39810180664062,
          "score": 21.665874481201172,
          "orientation": 328
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.3998031616211,
          "score": 21.847570419311523,
          "orientation": 328
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.39839935302734,
          "score": 21.705059051513672,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.4000015258789,
          "score": 21.832698822021484,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.3998031616211,
          "score": 21.86082649230957,
          "orientation": 328
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.3989028930664,
          "score": 21.73792266845703,
          "orientation": 328
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.39920043945312,
          "score": 21.73824691772461,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39779663085938,
          "score": 21.626750946044922,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.3998031616211,
          "score": 21.863920211791992,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.39839935302734,
          "score": 21.726932525634766,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.39949798583984,
          "score": 21.89730453491211,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.39920043945312,
          "score": 21.76638412475586,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.3989028930664,
          "score": 21.771142959594727,
          "orientation": 328
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.39859771728516,
          "score": 21.758241653442383,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39949798583984,
          "score": 21.909685134887695,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39810180664062,
          "score": 21.7100887298584,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39920043945312,
          "score": 21.781145095825195,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39839935302734,
          "score": 21.751384735107422,
          "orientation": 328
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.39859771728516,
          "score": 21.773378372192383,
          "orientation": 328
        }
      ]
    },
    {
      "lon": 34.894100189208984,
      "lat": 69.44409942626953,
      "score": 20.0768985748291,
      "orientation": 267.9999694824219,
      "points": [
        {
          "lon": 34.89419937133789,
          "lat": 69.443603515625,
          "score": 20.094966888427734,
          "orientation": 268
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.44419860839844,
          "score": 20.109107971191406,
          "orientation": 268
        },
        {
          "lon": 34.89310073852539,
          "lat": 69.44450378417969,
          "score": 20.025178909301758,
          "orientation": 268
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.44390106201172,
          "score": 20.100797653198242,
          "orientation": 268
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.4447021484375,
          "score": 20.080095291137695,
          "orientation": 268
        },
        {
          "lon": 34.89339828491211,
          "lat": 69.44499969482422,
          "score": 20.011871337890625,
          "orientation": 268
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.44419860839844,
          "score": 20.102157592773438,
          "orientation": 268
        },
        {
          "lon": 34.89509963989258,
          "lat": 69.44280242919922,
          "score": 19.910585403442383,
          "orientation": 268
        },
        {
          "lon": 34.89310073852539,
          "lat": 69.4447021484375,
          "score": 20.011878967285156,
          "orientation": 268
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.44390106201172,
          "score": 20.112791061401367,
          "orientation": 268
        },
        {
          "lon": 34.893699645996094,
          "lat": 69.44499969482422,
          "score": 20.039405822753906,
          "orientation": 268
        },
        {
          "lon": 34.89509963989258,
          "lat": 69.443603515625,
          "score": 20.019941329956055,
          "orientation": 268
        },
        {
          "lon": 34.894798278808594,
          "lat": 69.44339752197266,
          "score": 20.045032501220703,
          "orientation": 268
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.44390106201172,
          "score": 20.105236053466797,
          "orientation": 268
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.443603515625,
          "score": 20.104633331298828,
          "orientation": 268
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.44419860839844,
          "score": 20.108177185058594,
          "orientation": 268
        },
        {
          "lon": 34.89339828491211,
          "lat": 69.44450378417969,
          "score": 20.075288772583008,
          "orientation": 268
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.44450378417969,
          "score": 20.112499237060547,
          "orientation": 268
        },
        {
          "lon": 34.894500732421875,
          "lat": 69.44339752197266,
          "score": 20.088748931884766,
          "orientation": 268
        },
        {
          "lon": 34.895301818847656,
          "lat": 69.443603515625,
          "score": 20.00554656982422,
          "orientation": 268
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.44419860839844,
          "score": 20.145788192749023,
          "orientation": 268
        },
        {
          "lon": 34.89310073852539,
          "lat": 69.44419860839844,
          "score": 20.099388122558594,
          "orientation": 268
        },
        {
          "lon": 34.89419937133789,
          "lat": 69.44450378417969,
          "score": 20.159658432006836,
          "orientation": 268
        },
        {
          "lon": 34.89390182495117,
          "lat": 69.44390106201172,
          "score": 20.176780700683594,
          "orientation": 268
        }
      ]
    }
    ]
    