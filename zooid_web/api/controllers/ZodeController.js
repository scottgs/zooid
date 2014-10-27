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



module.exports = {

};

