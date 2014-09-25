
/**
* Processes signature from the input path and responds with an llos
* which contains an array4of llos'
* @param  {[type]} searchSquiggle
* @return {[Array<clusterResults>]} signal
*/
var Geolocator_module   = require('./build/Release/Geolocator_module');
var geolocator          = new Geolocator_module.Geolocator_module();
geolocator.initialize("/etc/vmr/geolocate.conf");

var merge = require("merge")
var zooid = require("../../zooid_core")

var zode = merge( require("./package.json"), { 
    name:"Terrain Based Geolocation"
  , takes:"terrain_signature"
  , gives:"geojson, kml"
  , status:"?"
  , ip:zooid.ip||'unknown'
  , work:0
  , actions:0 
})

console.log(zode.name, "intiated on",zooid.ip)

zooid.on( "muster", function(signal){
  zooid.muster(zode)
})

zooid.muster(zode)

// zooid.on( "*", function(signal){
//   console.log(zode.name, "rcvd message:", signal);
// })


/******************************************************************************
 * TEST WITH BASE CASE
******************************************************************************/

zooid.on( "test", function (test_signal){
  test(test_signal)
})


function test(test_signal){

  signal = {}
  signal.terrain_signature = [[
      0.7071067811865475,
      -0.8392803240259068,
      0.9990958406831207,
      -0.9990958406831207,
      0.2693687899828503,
      0.9509826718461247,
      -0.9993628874431991,
      0.9993773483135557,
      0.7071067811865475,
      -0.16944238478267
  ],[
      0.7071067811865475,
      0.9990958406831207,
      0.2993773483135557,
      -0.9990958406831207,
      0.2693687899828503,
      0.2693687899828503,
      0.9509826718461247,
      -0.9993628874431991,
      0.2993773483135557,
      -0.8392803240259068,
      0.2071067811865475,
      0.9990958406831207,
      -0.16944238478267
  ]]

  geolocate(signal, function(err, res){
    console.log(err || res.length)
    
    if (res) 
      zode.status = "active"
    else
      zode.status = "error"
    
    zooid.muster(zode)

    zooid.send({
      parent_id:test_signal.id
      , noun:'geolocation'
      , name:zode.name
      text:res 
    });
  })

}



zooid.on(zode.takes, function(signal){

  geolocate(signal, function(err, res){
    zooid.send({ parent_id:signal.id, noun:'geolocation',name:"Geolocation", map:res });
  })

})

/******************************************************************************
* GEOLOCATES a terrain sillhoutte by smashing against the database.
* @param terrain_silhouette
* @param clusterSize
* @param clusterDistance
* @param dataset
* @return err, clusterResults
******************************************************************************/

function geolocate(signal, done){

  dataset           = signal['dataset']         || "feature_small_gpu_afghan_360" 
  clusterSize       = signal['clusterSize']     || 500
  clusterDistance   = signal['clusterDistance'] || 8
  
  console.log('  dataset: ' , dataset )
  console.log('  clusterSize: ' , clusterSize )
  console.log('  clusterDistance: ' , clusterDistance )
  console.log('   ')
  
  geolocator.search( 
      signal.terrain_signature
    , dataset
    , clusterSize
    , clusterDistance
    , function(err, clusterResults){
      done( err, clusterResults )
    // zooid.send({text:clusterResults, name:clusterResults});
  })
}

// test({id:"test"})

