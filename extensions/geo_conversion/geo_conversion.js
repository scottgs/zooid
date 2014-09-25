  
/**
* Processes signature from the input path and responds with an llos
* which contains an array4of llos'
* @param  {[type]} searchSquiggle
* @return {[Array<clusterResults>]} signal
*/

var merge = require("merge")
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




zooid.on( zode.takes, function(signal){
  console.log("CONVERTING GEOs")
  convertFromGeolocation(signal.geolocation, function(err, geojson){
    zooid.send({ parent_id:signal.id, name:"geojson", geojson:geojson, noun:"geojson", text:err })
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

    obj[i].name="llos" + i + 
      " - heading: " + Math.floor( obj[i].orientation * 1000) / 1000 + "˚" +
      " - score: " + Math.floor( obj[i].score * 1000) / 1000;

    obj[i].href= "http://canyon.cgi.missouri.edu:1337/uploads/" + name;

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

    // // name and describe the KML document as a whole
    var kmlDocument = tokml(geojson, {
      name: 'name',
      description: 'score',
      style: 'style',
      // documentName: 'Results',
      // documentDescription: "Results of terrain sillhoutte search.",
        simplestyle: false
    })

    done(null, geoJSONString)


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

