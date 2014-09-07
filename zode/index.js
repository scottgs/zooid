var cluster = require("cluster")
var w = 4

if(cluster.isMaster){
  if(cluster.workers.length < w)
      cluster.fork()
}


require("./zode.js");


// if(cluster.isWorker)
  // require("./zode.js")