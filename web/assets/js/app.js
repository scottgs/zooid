/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */
$.fn.serializeObject = function(){
    
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

  var socket = io.connect();
  

  function img(link, s){
    n = s == "HEAD" ? 3321 : 123

    return "<img src='/files/"+link+"' class='thumbnail img img-responsive col-xs-"+n+" ' style='min-height:120px!important;max-height:300px!important;',  />";
  }

  function textBox(text){
    return "<div class=' img-thumbnail well-sm '>"+text+"</div>";
  }

  function dump(item){ content = ""
    for(i in item){
      if(Object.prototype.toString.call( item[i] ) === '[object Object]')
        content+= dump( item[i] )+""
      else
        content+= "<br /><small><b>"+i+": </b>"+item[i]+"</small>"+""
    }
    return content
  } 


  function histogram(hist, div){

    // console.log(hist.pallettes.rgb, div);

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("chart"+div).getContext("2d");
    console.log(ctx);

    var step = Math.ceil( hist.red.length / 16 );

    var red   = []
    var green = []
    var blue  = []
    var r,g,b

    for(var i = hist.red.length - 1; i >= 0; i--) {

      r+=hist.red[i]
      g+=hist.green[i]
      b+=hist.blue[i]

      if(i%step==0){
        red.push( r )
        green.push( g )
        blue.push( b )
        r=g=b=0
      }
      console.log(r,g,b);

    };


    var options = {

        animation: false,
        scaleShowLabels: false,
        // showScale: false,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : true,
        bezierCurveTension : 0.2,
        pointDot : false,
        // pointDotRadius : 4,
        // pointDotStrokeWidth : 1,
        // pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true
        // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var labels = function(){
      var labels = []
      for (var i = 0; i < red.length-1; i++) {
        labels.push(i);
      } return labels;
    }

    var data = {
        labels: labels(),
        datasets: [
            {
                fillColor: "rgba(255,220,220,0.35)",
                strokeColor: "rgba(220,0,0,1)",
                pointColor: "rgba(220,0,0,1)",
                pointStrokeColor: "#f00",
                pointHighlightFill: "#fcc",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: red
            },
            {
                fillColor: "rgba(220,255,220,0.35)",
                strokeColor: "rgba(0,220,0,1)",
                pointColor: "rgba(0,220,0,1)",
                pointStrokeColor: "#0f0",
                pointHighlightFill: "#cfc",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: green
            },
            {
                fillColor: "rgba(255,220,255,0.35)",
                strokeColor: "rgba(0,0,220,1)",
                pointColor: "rgba(0,0,220,1)",
                pointStrokeColor: "#00f",
                pointHighlightFill: "#ccf",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: blue
            }
        ]
    };

    var myNewChart = new Chart(ctx).Line(data, options);


    
  }


  var createSignalDiv = function(item_object){

    var item = item_object;

    var classes = (!item.parent_id) ? " sigStack panel panel-body well-sm container-fluid pull-left" : " pull-left sigStack ";
    var sub_classes = (item.type == "HEAD") ? "  " : "  ";
 
    var id = item.id || id
    var div = $('<div/>', {
      id: "item"+id,
      class: classes,
      title: item.created,
      "data-content": function(item){ return img(item.filename, 12) + " " + dump(item) ; },
      "data-toggle":"popover",
      "data-placement":"bottom"
    }).popover({ trigger: 'hover', html:true, container:$('infoTarget'), delay:300 }).addClass("")

      .html(function(){

        var name = item.name || item.service, content = ""
        content+= "<sig id='"+item.id+"' class=' signal "+sub_classes+" '>"
        
        content+= item.filename ? img(item.filename, item.type) : "";
        
        content+= item.text ? textBox(item.text, item.type) : "";

        // content+= "<i>"+ item.created +"</i>  "
        // content+= item.filename ? "<code><small>"+ JSON.stringify( item.data || item.location ) + "</small></code>":"";
        content+= "</sig>"

        return content 
    })
    return div
  };

  var models = {
    signal : {
      create : function(item){

        // $("#"+item.id).fadeOut(110, function(){$(this).remove();});
        var pend = item.parent_id ? "insertAfter" : "appendTo";
        if(item.type=="HEAD") pend = "prependTo"
        var pre  = item.parent_id ? "#"+item.parent_id : "#signal_container";

        if(item.histogram){
          var u = Math.round( Math.random() *200 );
          $(pre).append('<div class="pull-left panel panel-body well-sm"><canvas id="chart'+u+item.parent_id+'"  width=420 height=200  ></canvas></div>');
          histogram( item.histogram, u+item.parent_id );
        }

        $(createSignalDiv(item))[pend]( pre );

      },//create
      destroy : function(item){
        $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
      },//destroy
      update : function(item){
        $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
        $(createSignalDiv(item.data))[pend]("#signal_container").addClass("");


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
      var u = Math.round( Math.random() *200 );
      var parent_id = $(this).attr('id')
      socket.get('/signal/find', { parent_id: parent_id }, function(signals){
        console.log("Children:", signals);
        for(signal in signals){
          $("#"+signals[signal].id).parent().fadeOut( 0 , function(){$(this).remove();});
          $(createSignalDiv(signals[signal])).appendTo("#item"+parent_id).fadeIn("slow");
          if(signals[signal].histogram){
            $(pre).append('<div class="pull-left panel panel-body well-sm"><canvas id="chart'+u+signals[signal].parent_id+'"  width=420 height=200 ></canvas></div>');
            histogram( signals[signal].histogram, u+item.parent_id );
            $(pre).append( signals[signal].text ? textBox(signals[signal].text, signals[signal].type) : "" )
        }
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

  socket.get('/signal/find?type=HEAD&limit=1&sort=createdAt DESC', function(signals){
    for(signal in signals.reverse()){
      models['signal']['create'](signals[signal]);
      socket.request('/signal/find?parent_id='+signals[signal].id, function(signals2){
        for(signal2 in signals2.reverse()){
          models['signal']['create'](signals2[signal2]);
        }
      });
    }
  });

  // socket.request('/signal/find?type=HEAD&limit=5', function(a,b){console.log(a,b)});


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


$(document).ready(function() {

  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
  var previewNode = document.querySelector("#template");
  previewNode.id = "";
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);
   
  var myDropzone = new Dropzone( "#fileUpload", { // Make the dropzone
    url: "signal/upload", // Set the url
    thumbnailWidth: 100,
    thumbnailHeight: 100,
    parallelUploads: 4,
    previewTemplate: previewTemplate,
    autoQueue: true, 
    autoRemove: true, 
    previewsContainer: "#previews", // Define the container to display the previews
    clickable: ".dz-clickable" // Define the element that should be used as click trigger to select files.
  });
   
  myDropzone.on("addedfile", function(file) {
    // Hookup the start button
    file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file); };
  });
   
  // Update the total progress bar
  myDropzone.on("totaluploadprogress", function(progress) {
    document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
  });
   
  myDropzone.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector("#total-progress").style.opacity = "1";
    // And disable the start button
    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
  });
   
  // Hide the total progress bar when nothing's uploading anymore
  myDropzone.on("queuecomplete", function(progress) {
    document.querySelector("#total-progress").destroy();

  });
   
  // Setup the buttons for all transfers
  // The "add files" button doesn't need to be setup because the config
  // `clickable` has already been specified.
  // document.querySelector("#actions .start").onclick = function() {
  //   myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
  // };
  // document.querySelector("#actions .cancel").onclick = function() {
  //   myDropzone.removeAllFiles(true);
  // };


});


