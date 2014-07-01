/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};




(function (io) {

  function img(link, s){
    var s = (s == "HEAD") ? 3 :  s ;
    return "<div class='' ><img src='/files/"+link+"' class='thumbnail img-responsive col-sm-"+s+"' /></div>";
  }
  function dump(item){ content = ""
    for(i in item){
      if(Object.prototype.toString.call( item[i] ) === '[object Object]')
        content+= dump( item[i] )+""
      else
        content+= "<small><b>"+i+": </b>"+item[i]+"</small><br />"+""
    }
    return content
  } 

  var socket = io.connect();

  var createSignalDiv = function(item){

    var classes = (item.type == "HEAD") ? "  panel panel-default panel-body col-md-12 " : " h100 pull-left well-sm ";
    var sub_classes = (item.type == "HEAD") ? "   " : "  ";
 
    var id = item.id || id
    var div = $('<div/>', {
      id: "item"+id,
      class: classes,
      title: "created "+item.created,
      "data-content": img(item.filename, 12) + " <small> "+ dump(item) + "</small><br />",
      "data-toggle":"popover",
      "data-placement":"bottom"
    }).html(function(){

      var name = item.name || item.service
      var content = "<div id='"+item.id+"' class=' signal "+sub_classes+" '>"
      content+= "<b><small>"+""+"</small></b>  "
      content+= item.filename ? img(item.filename,item.type) : ""
      content+= item.text ? textBox(item.text, item.type)    : ""
      // content+= "<i>"+ item.created +"</i>  "
      // content+= item.filename ? "<code><small>"+ JSON.stringify( item.data || item.location ) + "</small></code>":"";
      content+= "</div>"

      return content 
    }).popover({ trigger: 'hover', html:true, delay:200 }).addClass("animated bounceIn")
    return div
  };

  var models = {
    signal : {
      create : function(item){

        $("#"+item.id).fadeOut(110, function(){$(this).remove();});
        var pend = !item.parent_id ? "prependTo" : "appendTo";
        var pre  = item.parent_id ? "#"+item.parent_id : "#signal_container";
        
        $(createSignalDiv(item))[pend]( pre ).fadeIn(3333, function(){console.log("faded")});
        console.log('ITEM: ', item);
      },//create
      destroy : function(item){
        $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
      },//destroy
      update : function(item){
        $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
        $(createSignalDiv(item.data))[pend]("#signal_container").addClass("animate fadeIn");
      }//update
    },//signal
  };

  $(document).ready(function() {

    $(".signal-gen").unbind('click')
    $(document).on('click', '.signal-gen', function(e){
      socket.get('/signal/create',{ service: $(this).attr('method'),name: $(this).attr('method') }, function(err, sig){
        console.log(err || 'New Signal:' , 1);
      });
    });

    $(document).on('click', '.signal', function(e){
      var parent_id = $(this).attr('id')
      socket.get('/signal/find', { parent_id: parent_id }, function(signals){
        console.log("Children:", signals);
        for(signal in signals){
          $("#"+signals[signal].id).parent().fadeOut( 0 , function(){$(this).remove();});
          $(createSignalDiv(signals[signal])).appendTo("#item"+parent_id).fadeIn("slow");
        }
      });
    });

    $(document).on('click', '.createSignal', function(e){
      // var f = $("form").submit()
        socket.post("/signal/create", $("form").serializeObject(), function(a,b){console.log(a,b);} )
    })

      var $container = $('#signal_container');
        // init
        $container.isotope({
        // options
        itemSelector: '.signal',
        layoutMode: 'fitRows'
      });
  });

  socket.on('connect', function socketConnected() {
    console.log("connected");
  });

  socket.request('/signal/pretty',{}, function(signals){
    for(signal in signals.reverse()){
      models['signal']['create'](signals[signal]);
    }
  });

  socket.request('/signal', {limit:1}, function(a,b){console.log(a,b)});


  function parseMessage(message){
    if(models[message.model] && models[message.model][message.verb]){
      models[message.model][message.verb](message.data);
    } else {
      log("don't know what to do with the recieved message.")
    }
    log("Parsd: ", message);
  }

  socket.on('message', function(message){ parseMessage(message); } ); 

  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
})(window.io);




