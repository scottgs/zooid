/******************************************************************************
 *
 * app.js
 *
 * This file serves as the interface between the drone and overmind.
 * Signals createsd through this interface are subscribed to and the
 * work performed on them.
 *
 * - Ben'
******************************************************************************/

(function (io) {

  var socket = io.connect();

  /**
   * Wrap objects into DOM coherent structures
   * @param  {String} text 
   * @return {html}      
   */

  // function img(link){
  //   return "<img src='/files/"+link+"' />";
  // }
  // function text(text){
  //   return "<p class=' btn-block well-sm code small'>"+text+"</p>";
  // }
  // function icon(name){
  //   return " <div class='fa fa-fw fa-"+name+" fa-lg '></div> "
  // }

  /**
   * recursively walk and print any object.
   * @param  {Object} item 
   * @return {html}      
   */

  // function dump(item){ var content = ""
  //   for(i in item){
  //   content+= "<tr>"
  //     if(Object.prototype.toString.call( item[i] ) === '[object Object]')
  //       content+= dump( item[i] )+""
  //     else
  //       content+= "<td class='text-muted'  id ='"+i+"'>"+i+"</td><td>"+item[i]+"</td>"
  //   }
  //   content+= "<tr>"
  //   return content 
  // } 

  /**
   * Recursively walk and print an service object
   * @param  {Object} item 
   * @return {html}      
   */

  // function createServiceDiv(item){ content = ""
    
  //   content+= "<table id='item"+item.id+"' class=' table table-condensed small  ' >"
  //   content+= dump(item)
  //   content+= dump( {actions:"<a class='delete btn btn-xs pull-right' model-name='service'> DELETE </a>"})
  //   content+= "</table>"
  //   return content
  // } 

  /**
   * Wraps a prototypical signal object in HTML
   * @param  {Object} item_object 
   * @return {html}             
   */


  // function createSignalDiv(item_object){

  //   var item     = item_object
  //   var filename = item.filename

  //   var classes = (!item.parent_id) ? " signal_HEAD sigStack " : " sigStack ";
 
  //   // var bg = (!item.parent_id) ? {
  //   //   "background": 'url(/files/'+item.filename+')',
  //   //   "background-color": 'rgba(0,0,0,0.5)',
  //   //   "background-size": ' 100% ',
  //   //   "background-repeat": ' no-repeat',
  //   // } : {};


  //   var id = item.id || id

  //   var div = $('<div/>', {

  //     id: ""+id
  //     , class: classes
  //     , title: item.created
  //     , service: item.name  || item.operation || item.service 
  //     , "data-content": function(item){ return img(filename, 12) + " " + dump(item) ; }
  //     , "data-toggle":"popover"
  //     , "data-placement":"right"
    
  //   }).popover({ 

  //       trigger: 'hover'
  //     , html:true
  //     , delay:5000 
    
  //   }).append(function(){

  //       var name = item.name || item.text || item.service || "NO NAME"
  //       var content = ""
        
  //       content+= "<div id=item'"+item.id+"' class=' signal "+" '>"
  //       content+= "<a class='text-muted '>"
  //       content+= name + icon("angle-double-right") + "  "
  //       content+= "  "
  //       content+= "</a>"
  //       content+= filename ? img(filename) : "";

  //       content+= item.text ? text(item.text, item.type) : "";
  //       content+= item.text ? text(item.text, item.type) : "";
  //       content+= "<small>"+ item.created +"</small>  "
  //       content+= item.histogram ? "<pre><small>"
  //         + item.histogram 
  //         + "</small></pre>":"";
  //       content+= "</div>"

  //       return content 
  //   })
  //   return div
  // };//createSignalDiv




/******************************************************************************
 * Bind Model CRUD events to DOM events
 * 
 * First by model, then by verb.
 * @type {Object} item
 * @return {}
******************************************************************************/


//   var models = {

    // signal : {

    //   create: function(signal){
      



    //     var item = signal
    //     var pend = "appendTo"
    //     var target  = item.parent_id ? "#"+item.parent_id : "#signal_container";
        
    //     $( createSignalDiv(item) )[pend](target);

    //     if(item.histogram){
    //       var u = Math.round( Math.random() *200 );
    //       $('<div class=" sigStack "><canvas class="signal" id="chart'+u+item.parent_id
    //         +'" ></canvas></div>')[pend]( target )
    //       histogram( item.histogram, u+item.parent_id )
    //     } 

    //     $(target).children().sort(function (a, b) {
    //         return a.id < b.id;
    //     }).each(function(){
    //         var elem = $(this);
    //         elem.remove();
    //         $(elem).appendTo(target);
    //     })


    //   }, //create

    //   destroy: function(item){
    //     $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
    //   }, //destroy

    //   update: function(item){

    //     for(var i in item){
    //       $("#item"+item.id ).find('.'+i).html(item[i]).addClass("animated pulse");
    //     }
        
    //     // $("#item"+item.id ).replaceWith(createSignalDiv(item)).addClass("animated pulse")
    //     // 
    //   } //update

    // }, //signal


/**
 * [service description]
 * @type {Object}
 */

//    service: {

//       create : function(item){
//         var pend = item.parent_id ? "appendTo" : "appendTo";
//         if(item.type=="HEAD") pend = "prependTo"
//         var pre  = item.parent_id ? "#"+item.parent_id : "#service_container";
//         $(createServiceDiv(item))[pend]( pre ).addClass(" animated bounceIn ");
//       }, //create

//       destroy : function(item){
//         $("#item"+item.id).remove()
//       }, //destroy

//       update : function(item){
//         $("#item"+item.id)
//           .replaceWith(createServiceDiv(item))
//           .addClass("animated tada")
//       } //update
//     }, //signal
//   };


/******************************************************************************
 * Bind DOM events to Model events
******************************************************************************/




  // socket.on('connect', function socketConnected() {

  //   $(document).ready(function() {
      
  //       socket.get('/service', function(services){
  //         console.log(services)
  //         for (var i = 0; i < services.length; i++) {
  //           models['service']['create'](services[i]);
  //         };
  //       });

  //       // socket.get('/signal/find?type=HEAD&limit=1&sort=createdAt DESC', function(signals){
  //       //   console.log(signals)
  //       //   for (var i = 0; i < signals.length; i++) {
  //       //     models['signal']['create'](signals[i]);
  //       //   };
  //       // });


  //   });

  // });

////////////////////////////////////////////////////////////////////////////////
  /**
   * Create histogram from an image
   * @param  {Object} hist Histogram Data Structure
   * @param  {String} div  Target for paiting chart
   * @return {}
   */
////////////////////////////////////////////////////////////////////////////////

  function histogram(hist, div){

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("chart"+div).getContext("2d");

    // Set rate at which color data will be accum.
    var step = Math.ceil( hist.red.length / 16 );

    // instantiate vars
    var red   = []
    var green = []
    var blue  = []
    var r,g,b

    // walk histogram colors
    for(var i = hist.red.length - 1; i >= 0; i--) {

      // add up all the values
      r+=hist.red[i]
      g+=hist.green[i]
      b+=hist.blue[i]

      // accumulate on step
      if(i%step==0){
        red.push( r )
        green.push( g )
        blue.push( b )
        r=g=b=0
      }
    };

    // Set options for chart
    var options = {

        animation: false,
        scaleShowLabels: false,
        showScale: true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(255,255,255,.1)",
        scaleGridLineWidth : 2,
        bezierCurve : true,
        bezierCurveTension : 0.2,
        pointDot : false,
        pointDotRadius : 1,
        pointDotStrokeWidth : 0,
        // pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 4,
        datasetFill : true,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    // create labels array
    var labels = function(){
      var labels = []
      for (var i = 0; i < red.length-1; i++) {
        labels.push("");
      } return labels;
    }

    // mutate data into chart data
    var data = {
        labels: labels(),
        datasets: [
            {
                fillColor: "rgba(255,0,0,0.15)",
                strokeColor: "rgba(220,0,0,1)",
                pointColor: "rgba(220,0,0,1)",
                pointStrokeColor: "#f00",
                pointHighlightFill: "#fcc",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: red
            },
            {
                fillColor: "rgba(0,255,0,0.15)",
                strokeColor: "rgba(0,220,0,1)",
                pointColor: "rgba(0,220,0,1)",
                pointStrokeColor: "#0f0",
                pointHighlightFill: "#cfc",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: green
            },
            {
                fillColor: "rgba(0,0,255,0.15)",
                strokeColor: "rgba(0,0,220,1)",
                pointColor: "rgba(0,0,220,1)",
                pointStrokeColor: "#00f",
                pointHighlightFill: "#ccf",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: blue
            }
        ]
    };

    // Create chart
    var myNewChart = new Chart(ctx).Line(data, options);

    return myNewChart
    
  }




  /**
   * Get a few recently processed signals into the DOM
   * @param  {Array} signals Model query response
   * @return {}
   */

  // socket.get('/signal/find?type=HEAD&limit=1&sort=createdAt DESC', function(signals){
  //   for(signal in signals.reverse()){
  //     models['signal']['create'](signals[signal]);
  //     // socket.request('/signal/find?parent_id='+signals[signal].id, function(signals2){
  //     //   for(signal2 in signals2.reverse()){
  //     //     models['signal']['create'](signals2[signal2]);
  //     //   }
  //     // });
  //   }
  // });





  // /**
  //  * Dispatches socket message to DOM elements
  //  * @param  {Object} message 
  //  * @return {}
  //  */

  // function parseMessage(message){
  //   if(models[message.model] && models[message.model][message.verb]){
  //     if(!message.data) message.data={} 
  //     message.data.id = message.id
  //     models[message.model][message.verb](message.data || message);
  //   } else { console.log("parseMessage(): don't know what to do with the recieved message.") }
  //   console.log("Parsed: ", message);
  // }

  // /**
  //  * Listens to socket
  //  * @param  {Object} message
  //  * @return {}
  //  */

  // socket.on('message', function(message){ parseMessage(message);});


})(window.io);

/**
 * Instantiates and configures Dropzone.js in the DOM
 * @return {}
 */

$(document).ready(function() {

  var r = Math.round(Math.random()*1000)
  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
  var previewNode = document.querySelector("#template");
  var parent_id  = "item"+r;
  previewNode.id = parent_id;
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
    $("#total-progress .progress-bar").css( "width", progress+"%" ) 
  });
   
  myDropzone.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector("#total-progress").style.opacity = "1";
    // And disable the start button
    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
  });
   
  // Hide the total progress bar when nothing's uploading anymore
  myDropzone.on("queuecomplete", function(progress) {
    console.log(progress);
  });

    // Hide the total progress bar when nothing's uploading anymore
  myDropzone.on("complete", function(file) {
    $("#"+file.previewElement.id).remove()
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


/**
 * Extends jQuery with an obvious object serializer
 * @return {Object} Results of serialization
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
