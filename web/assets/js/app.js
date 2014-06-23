/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
  }

  socket.on('connect', function socketConnected() {

    console.log("connected");
    socket.get("/signal", function(err,res){

    });
  });



  socket.on('message', function(item) {
    if(models[item.model] && models[item.model][item.verb]){
      models[item.model][item.verb](item);
    }
    log(item, 'stuff10'); 
  }); // end socket


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }

  function t(msg){
    socket.send(msg);
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);
 var createSignalDiv = function(item){

    $('<div/>', {
      'class': 'signal alert alert-info',
      id: "item"+item.id,
      href: 'http://google.com',
      title: 'TITTY DICKS',
      rel: 'external',
      text: item.name
    }).appendTo('#signal_container');

  };

var models = {
  signal : {
    create : function(item){
      $(createSignalDiv(item.data)).prependTo("#signal_container").fadeIn('slow');
    },//create
    destroy : function(item){
      $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
    },//destroy
    update : function(item){
      $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
      $(createSignalDiv(item.data)).prependTo("#signal_container").fadeIn('slow');
    }
  },//signal
};


$(document).ready(function(){
  $('#signal_container')
  .on('click', '.signal', function(e){
    models.signal.destroy({id:this.id.substr(4)});
  })
  .on('mouseover', '.signal', function(e){
    $(this).removeClass('alert-info').addClass('alert-danger');
  })
  .on('mouseout', '.signal', function(e){
    $(this).removeClass('alert-danger').addClass('alert-info');
  })
});

