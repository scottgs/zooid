var cluster = require("cluster")

if(cluster.isMaster)
  if(cluster.workers.length < w)
    cluster.fork()
