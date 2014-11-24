const computecluster = require('compute-cluster');

/**
 * Defines this zodes identity and function within the organism.
 * @type {Zode}
 */

var zooid = require("../zooid_core")
var merge = require("merge")
var fs = require("fs")
var moment = require("moment")
var path = require("path")

var zode = merge( {}, { 
    name:"Transformer"
  , filename:"app.js"
  , transforms:"app.js"
  , takes:"cv matrix"
  , gives:"cv matrix"
  , ip:zooid.ip || 'unkown'
  , status:"active"
  , work:0
  , actions:0 
})

console.log(zode.name, "intiated.")

/**
 * Responds to it's listener handler noun.
 * @param  {Signal} signal input signal
 * @return {}
 */

// zooid.on( "image", function(signal){
  // if(!zode.status) return 1;
  // var start = moment().valueOf();
  // zode.actions += 1

  // createHistogram( signal, function(err, res){
  //   var stop = moment().valueOf();
  //   zode.work += stop - start
  //   zooid.muster(zode)
  //   zooid.send(res)

  // });

// })

function charge(filename){

  zooid.on( filename, function(signal){

    if(!zode.status) return 1;
    var start = moment().valueOf();
    zode.actions += 1

    var cc = new computecluster({
      module: './'+filename+'.js'
    })

    cc.enqueue(signal, function(err, result) {
      if(!err){
        result.parent_id      = signal.id
        result.transformation = filename
        zooid.send(result)
      }

      zode.actions += 1
      var stop = moment().valueOf();
      zode.work += stop - start
      var z = merge(true,zode) 
      z.name +="::"+filename
      z.layer = 2
      
      zooid.muster(z)

      console.log("finished", filename, result[0])
      cc.exit()
    })

  })
}




fs.readdirSync("./").forEach(function(file) {
  if(file === "app.js") return;
    
  var name = path.basename(file, '.js')
  console.log(name);
  charge(name);
  var i =10;
  zooid.send({name:name, noun:name, filename:"/Users/macproretina/Desktop/dev/zooid/test_data/cbr/url.jpg"})

});


