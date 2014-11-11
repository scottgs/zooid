/**
 * ZodeController
 *
 * @description :: Server-side logic for managing zodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// var Axon = require('axon');
// var ganglion = Axon.socket('pull');
// var moment = require("moment");

  
// ganglion.bind(42001);

// ganglion.on('message', function( signal ){

//   Zode.find({name:signal.name, ip:signal.ip}, function(err,zode){
//     console.log(err || zode);
//     if(zode.length){
//       console.log("UPDATING", zode[0])
//       Zode.update( {id:zode[0].id}, signal ).exec(function(err,updated){
//         console.log(err, updated)
//         if(zode[0].actions != signal.actions || zode[0].status != signal.status)
//           Zode.publishUpdate( zode[0].id, signal );
//       })
//     } else {
//       Zode.create( signal, function(err, res){
//         console.log("UPDATING" + err || res)
//         if(res) Zode.publishCreate( res.toJSON() )
//       })
//     }
//   })
// })


/**
 * Creates a socket for publishing and binds to it.
 * @type {Socket Object}
 */
var Axon = require("axon");
var axon = Axon.socket('req');
axon.bind(42000);


module.exports = {

  toggle:function(req,res){
    var id = req.param("id")
    console.log(id)
    Zode.find({id:id}, function(err,zodes){
      var zode = zodes[0]
      console.log("err",err)
      console.log("zode",zode)
      if(err) return res.json(err)
      axon.send( zode.ip, zode.service, function(err, response){
        return res.json(err||response)
      })
    })
  }

};




