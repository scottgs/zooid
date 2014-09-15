extends ../layout

block body
  include nav
  br
  .container-fluid.row
    .col-sm-3.col-lg-2
      ul.nav.nav-stacked.nav-pills.nav-stacked-sm(role='navigation').panel.panel-default.boxShadow
        include sidebar

    .col-sm-9.col-lg-10

      .col-sm-4
        .panel.well
          #graphVisualization(style="width:100%;height:200px;")

      .col-sm-4
        .panel.well
          #system_chart(style="height:200px;")

      .col-sm-4
        .panel.well
          #nodes_chart(style="height:200px;")
    
      .col-sm-12
        .panel.well
          #visualization


    //- a(href="https://github.com/benbaker/zooid").scootRight
    //-   .button.button-pill.button-flat-action 
    //-     b test



      //- .col-sm-3
      //-   .btn.button.button-flat.square.btn-block
      //-     b.lead signal activity

      //- .col-sm-3
      //-   .btn.button.button-flat.square.btn-block
      //-     b.lead signal activity

      //- .col-sm-3
      //-   .btn.button.button-flat.square.btn-block
      //-     b.lead signal activity
      //- .col-sm-3
      //-   .btn.button.button-flat.square.btn-block
      //-     b.lead cluster





    script.
              
        (function (io) {
          


          socket = io.connect();
          var graph  = forceGraph()

          /**
           * DOM UTILITIES
           * Wrap objects into DOM coherent structures
           * @param  {String} text 
           * @return {html}      
           */

          function img(link){
            // TODO popover
            return "<img src='/files/"+link+"' class='img-responsive img-circle'/>"
          }
          function web_img(link){
            // TODO popover
            return "<img src='"+link+"' class='img-responsive'/>"
          }
          function text(text){
            return "<p class='signalText'>"+text+"</p>"
          }
          function icon(name){
            return " <i class='icon ion-"+name+" '></i> "
          }
          function cell(a, id) {
            return "<td class='"+id+"'>"+a+"</td>"
          }
          function head(a) {
            return "<th>"+a+"</th>"
          }
          function link(a, href, classes) {
            return "<a href='"+ href +"' class=' "+classes+" '>"+a+"</a>"
          }
          function confirmButton(id){
            return "<a id='"+ id +"'>"+icon("ios7-plus-outline fa-lg text-danger")+"</a>";
          }
          function rejectButton(id){
            return "<a id='"+ id +"'>"+icon("ios7-minus-outline fa-lg text-success")+"</a>";
          }

          function question(questions){
            var content = "<span class='  '>"
            for(var i=0;i<questions.length;i++){
              content +="<input class=' input ' type='"
              + (questions[i].type || "text") 
              + "' placeholder='"
              + questions[i].question
              + "' name='"
              + questions[i].response+"'>"
            } return content + "</form>";
          }
          function confirmation(signal){
            var content = "<scootRight>"
            for(var i=0;i<confirmation.length;i++){
              content += confirmButton(signal.id)
              content += rejectButton(signal.id)
              content +=  "</scootRight>"
            }
              content += "</form>"
            return content;

          }
          /**
           * recursively walk and print an object.
           * @param  {Object} item 
           * @return {html}      
           */

          function dump(item, tag1, tag2){ 
            var content = ""; 
            var tag1 = tag1 || "tr"
            var tag2 = tag2 || "td"
              for(i in item){
              content+= "<"+tag1+">"
                if(Object.prototype.toString.call( item[i] ) === '[object Object]')
                  content+= dump( item[i], tag1, tag2 )+""
                else
                  content+= "<"+tag2+" class='' id ='"+i+"'>"+i+""+item[i]+"</"+tag2+">"
              }
              content+= "<"+tag1+">"
              return content 
            } 


          /**
           * Recursively walk and print a service object
           * @param  {Object} item 
           * @return {html}      
           */

          function createServiceDiv(item){ 
            
              var content = ""
              content+= "<a id = '"+item.id+"' class='button button-sm button-default  getService'>"
              content+= item.name
              content+= "</a>"
              return content
          }


          function createSignalDiv(item_object){

            var item     = item_object
            var filename = item.filename || null
            var classes = (!item.parent_id) ? " signal_HEAD " : " sigStack ";
            var id = item.id || id


            if(item.parent_id){
                graph.addLink( id, item.parent_id, "Parent" )
                graph.addLink( item.parent_id, id, "Child"  )

              if(filename)
                graph.addNode( id, filename )

              if(item.text && !(item.text =="" || typeof item.text == 'undefined') ){
                var txt = item.text
                graph.addNode( txt, txt )
                graph.addLink( txt, id, "Child" )
                graph.addLink( txt, id, "Parent" )
              }
              if(item.text){
                graph.addNode( item.text, item.text )
                graph.addLink( item.text, id, "Parent" )
                graph.addLink( item.text, id, "Child" )
                graph.addLink( item.text, item.parent_id, "Parent" )
                graph.addLink( item.text, item.parent_id, "Child" )
              }
            }
            //- var background = (!item.parent_id) ? {} : {"background":"url(/files/"+ filename +") no-repeat left center "}

            var div = $('<div/>', {

              id: ""+id
              , class: classes
              , title: item.created

              , service: item.name  || item.operation || item.service 
              , "data-content": function(item){ return img(filename, 12) + " " + dump(item) ; }
              , "data-toggle":"popover"
              , "data-placement":"top"
            
            })

            //- .css( background )

            .append(function(){

                var name = item.name || item.noun || item.service
                var content = ""
                
                var head_class = (!item.parent_id) ? " head_class " : " sigStack ";

                content+= item.href ? " "+ link( name, item.href)+" " : "";

                content+= "<div id=item'"+item.id+"' class=' signal "+head_class+" '>"
                content+= item.filename ? img(filename) : "";
                content+= item.src ? web_img(item.src) : "";

                content+= name ? icon("ios7-caret-right") + "<span class='signalName'>"+name+"</span> " : "";

                content+= item.text ? text(item.text, item.type) : "";

                content+= item.questions ? question(item.questions) : "";
                content+= item.confirm ? confirmation(item) : "";
                content+= item.listeners ? item.listeners : "";

                //- content+= "<small>"+ item.created +"</small>  "
                content+= item.histogram ? "<pre><small>"
                  + JSON.stringify( item.histogram )
                  + "</small></pre>":"";
                content+= link(icon("ios7-information-outline fa-lg"), "/signal/"+item.id, " text-right " )
                content+= "</div>"

                return content 
            })
            //- .popover({ 
            //-     trigger: 'click'
            //-   , html:true
            //-   , target:'body'
            
            //- })
            return div
          };//createSignalDiv



          function createSystemDiv(item){ 

            var content = ""
            var color = "text-"+item.color

            content+= "<tr id="+ item.id +" class='"+ color +"' style='color:#77777b' >"
            
            content+= cell( link( item.name, "/system/find/" + item.id ) )
            content+= cell(item.node)
            //- content+= cell("<small>"+item.last_update+"</small>", "last_update")
            //- content+= cell(item.status, "status")
            content+= cell(item.new_actions, "new_actions")

            content+= cell("<a id='"+ item.id +"' class='delete button-sm small' model-name='system'>"+
                      "<fa class='fa fa-fw fa-times'></fa></a>")

            content+= "</tr>"
            return content
          } 








        /******************************************************************************
         * Bind Model CRUD events to DOM events
         * 
         * First by model, then by verb.
         * @type {Object} item
         * @return {}
        ******************************************************************************/


        var models = {

           service: {

              create : function(item){
                var pend = item.parent_id ? "prependTo" : "appendTo";
                var pre  = item.parent_id ? "#"+item.parent_id : "#service_container";
                $(createServiceDiv(item))[pend]( pre );

              }, //create

              destroy : function(item){
                $("#item"+item.id).remove()
              }, //destroy

              update : function(item){
                $("#item"+item.id)
                  .replaceWith(createServiceDiv(item))
                  .show("animated pulse")
              } //update
            }, //signal

           service_description: {
              create : function(item){
                var pend = item.parent_id ? "appendTo" : "appendTo";
                var pre  = item.parent_id ? "#"+item.parent_id : "#service_description";
                $(dump(item))[pend]( pre );
              }, //create
              destroy : function(item){
                $("#item"+item.id).remove()
              }, //destroy
              update : function(item){
                $("#item"+item.id)
                  .replaceWith(createServiceDiv(item))
                  .show("animated pulse")
              } //update
            }, //signal

           system: {

              create  : function(item){
                $( "#system_container" )
                  .append( createSystemDiv(item) )

                  //- var node_id= item.info.address+":"+item.node
                  //- chart.addSeries({ id:item.info.address })
                  //- var val = item.workDone || 1
                  //- nodes_chart.series[0].addPoint({ id:item.id, category:item.id, value:val })

              },

              destroy : function(item){
                $("#"+item.id).fadeOut("slow")
              }, 

              update : function(item){

                for (var attr in item) {
                  $("#"+item.id)
                    .find("."+attr)
                    .html(item[attr])
                };
                
                var node_id = item.info.address+":"+item.node
                var ch = nodes_chart.get(node_id);
                if(item.new_actions) ch.update(item.new_actions)

                  var chrt = chart.get(item.info.address)
                  var shift = (chrt.data.length > 5)
                    console.log(shift)
                    chrt.addPoint( [item.last_report, item.new_actions] , true, shift)

                //- nodes_chart.get(item.id).update( [ item.id, item.new_actions ] )
                //- chart.series[0].addPoint( Math.random() , true, (chart.series[0].data.length > 10) );
              } 
            }, 



           signal: {
              
              create: function(signal){
              
                var item = signal
                var pend = signal.parent_id ? "appendTo" : "prependTo" 
                var target  = item.parent_id ? "#"+item.parent_id : "#signal_container";
                $( createSignalDiv(item) )[pend](target);


                if(item.histogram){
                  var u = Math.round( Math.random() *200 );
                  $('<div class=" sigStack " date="'+ item.date +'"  ><canvas class="signal" id="chart'+u+item.parent_id
                    +'" ></canvas></div>')[pend]( target )
                  histogram( item.histogram, u+item.parent_id )
                } 

                //- $(target).children().not(".head_class").sort(function (a, b) {
                //-     return $(a).attr('date') > $(b).attr('date');
                //- }).each(function(){
                //-     var elem = $(this);
                //-     elem.remove();
                //-     $(elem).appendTo(target);
                //- })

              }, //create

              destroy: function(item){
                $("#item"+item.id).fadeOut(0, function(){$(this).remove();});
              }, //destroy

              update: function(item){

                for(var i in item){
                  $("#item"+item.id ).find('.'+i).html(item[i]).addClass("animated pulse");
                }
                
                // $("#item"+item.id ).replaceWith(createSignalDiv(item)).addClass("animated pulse")
                // 
              } //update

            }, //signal


          };


        /******************************************************************************
         * Bind DOM events to Model events
        ******************************************************************************/



          $(document).ready(function() {


            //- $('#myTab  #connectionsTab').tab('show')



            // SIGNAL GENERATOR BUTTON
            $(document).on('click', '.signal-gen', function(e){
              socket.get('/signal/create',
                { service: $(this).attr('method'),
                  name: $(this).attr('method') }, 
                function(err, sig){
                console.log(err || 'New Signal:' , 1);
              });
            });

            // SIGNAL ELEMENT
            $(document).on('click', '.signal a', function(e){
              var parent_id = $(e).attr('id')
              socket.get('/signal/find', { parent_id: parent_id }, function(signals){
                console.log("Children:", signals);
                for(signal in signals){
                  models["signal"]["create"]( signals[signal] );
                }
              });
            });

            // CREATE SIGNAL BUTTON
            $(document).on('click', '.createSignal', function(e){
              // var f = $("form").submit()
              socket.post("/signal/create", $("form").serializeObject(), function(a,b){console.log(a,b);} )
            })

            // DELETE SIGNAL BUTTON
            $(document).on('click', '.delete', function(e){
              // var f = $("form").submit()
              var id = $(this).id || $(this).parent().id;
              var model = $(this).attr('model-name');
              console.log(id)
              socket.post("/"+model+"/destroy", {id:id}, function(a,b){console.log(a,b);} )
            })
            
            // TEST SIGNAL BUTTON
            $(document).on('click', '.test_cluster', function(e){
              socket.post("/signal/test", {});
            })


            // TEST URL BUTTON
            $(document).on('click', '.test_signal', function(e){
              socket.post("/signal/getURL",{getURL:""}, function(a,b){
                $(".submitURL").append("<i class='fa fa-spinner'></i>")
                })
              //- $(".fa-spinner").hide()
                
            })


            // SUBMIT URL BUTTON
            $(document).on('click', '.submitURL', function(e){
              socket.post("/signal/getURL"
                , $(".getURL").serializeObject()
                , function(a,b){
                $(".submitURL").append("<i class='fa fa-spinner'></i>")
                })
              //- $(".fa-spinner").hide()
                
            })

            // BOUNCE SERVER BUTTON
            $(document).on('click', '.bounce_server', function(e){
              socket.post("/system/bounce", {});
            })

            // GET SERVICE BUTTON
            $(document).on('click', 'a.getService', function(){
              var parent_id = $(this).attr('id');
              console.log(parent_id);
              socket.post("/service/find", { id:parent_id } , function(a,b){
                models.signal.create(a);
              })
            })

            // CODE TAB
            $(document).on('click', '.docs', function(){
              $("#docsTab").tab('show')
            });


            // MAKE IMAGES BIG ON CLICK
            $(document).on('click', '.signal', function(){
              $(this).find("img").toggleClass("bigSignal img-circle");
            })

            });



            $(document).ready(function() {

              //- socket.get('/signal/find?type=HEAD&sort=createdAt DESC&limit=2', function(signals){
              //-   for (var i = 0; i < signals.length; i++) {
              //-     models['signal']['create'](signals[i]);

              //-     socket.get('/signal/find/',{parent_id:signals[i].id}, function(ch1s){
              //-       for (var i = 0; i < ch1s.length; i++) {
              //-         models['signal']['create'](ch1s[i]);

              //-         socket.get('/signal/find/',{parent_id:ch1s[i].id}, function(ch2s){
              //-           for (var i = 0; i < ch2s.length; i++) {
              //-             models['signal']['create'](ch2s[i]);

              //-           };
              //-         });
              //-       };
              //-     });
              //-   };
              //- });

              socket.get('/signal/find?type=HEAD&sort=createdAt DESC&limit=4', function(signals){
                for (var i = 0; i < signals.length; i++) {
                  models['signal']['create'](signals[i]);
                };
              });


              socket.get('/service/find', function(services){
                console.log(services)
                for (var i = 0; i < services.length; i++) {
                  models['service']['create'](services[i]);
                };
              });

              socket.get('/system/find', function(system){
                console.log(system)
                for (var i = 0; i < system.length; i++) {
                  models['system']['create'](system[i]);
                };
              });

          
          });



            ////////////////////////////////////////////////////////////////////////////////
              /**
               * Create histogram from an image
               * @param  {Object} hist Histogram Data Structure
               * @param  {String} div  Target for paiting chart
               * @return {}
               */
            ////////////////////////////////////////////////////////////////////////////////


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







                // JOE!



          //- var container = document.getElementById('visualization');
          //- var data = [
          //-   {id: 1, content: 'item 1', start: '2013-04-20'},
          //-   {id: 2, content: 'item 2', start: '2013-04-14'},
          //-   {id: 3, content: 'item 3', start: '2013-04-18'},
          //-   {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
          //-   {id: 5, content: 'item 5', start: '2013-04-25'},
          //-   {id: 6, content: 'item 6', start: '2013-04-27'}
          //- ];
          //- var options = {};
          //- var timeline = new vis.Timeline(container, data, options);


          //- var data = null;
          //- var graph = null;

          //- function custom(x, y) {
          //-   return (1 * Math.round(Math.random())* 50 + 50);
          //- }

          //- // Called when the Visualization API is loaded.
          //- function drawVisualization() {
          //-   // Create and populate a data table.
          //-   data = new vis.DataSet();
          //-   // create some nice looking data with sin/cos
          //-   var counter = 0;
          //-   var steps = 50;  // number of datapoints will be steps*steps
          //-   var axisMax = 314;
          //-   var axisStep = axisMax / steps;
          //-   for (var x = 0; x < axisMax; x+=axisStep) {
          //-     for (var y = 0; y < axisMax; y+=axisStep) {
          //-       var value = custom(x,y);
          //-       data.add({id:counter++,x:x,y:y,z:value,style:value});
          //-     }
          //-   }

          //-   // specify options
          //-   var options = {
          //-     width:  '600px',
          //-     height: '600px',
          //-     style: 'surface',
          //-     showPerspective: true,
          //-     showGrid: true,
          //-     showShadow: false,
          //-     keepAspectRatio: true,
          //-     verticalRatio: 0.5
          //-   };

          //-   // Instantiate our graph object.
          //-   var container = document.getElementById('visualization');
          //-   graph = new vis.Graph3d(container, data, options);
          //- }



          var nodes = null;
          var edges = null;
          var network = null;
          var DIR = "/"

          function draw() {
             nodes = [
              {id: 1,  label: 'Algie',   image: DIR + 'Smiley-Angry-icon.png', shape: 'image'},
              {id: 2,  label: 'Alston',  image: DIR + 'Smiley-Grin-icon.png', shape: 'image'},
              {id: 3,  label: 'Barney',  image: DIR + 'User-Administrator-Blue-icon.png', shape: 'image'},
              {id: 4,  label: 'Coley',   image: DIR + 'User-Administrator-Green-icon.png', shape: 'image'},
              {id: 5,  label: 'Grant',   image: DIR + 'User-Coat-Blue-icon.png', shape: 'image'},
              {id: 6,  label: 'Langdon', image: DIR + 'User-Coat-Green-icon.png', shape: 'image'},
              {id: 7,  label: 'Lee',     image: DIR + 'User-Coat-Red-icon.png', shape: 'image'},
              {id: 8,  label: 'Merlin',  image: DIR + 'User-Executive-Green-icon.png', shape: 'image'},
              {id: 9,  label: 'Mick',    image: DIR + 'User-Preppy-Blue-icon.png', shape: 'image'},
              {id: 10, label: 'Tod',     image: DIR + 'User-Preppy-Red-icon.png', shape: 'image'}
            ];

            // create connections
            var color = '#BFBFBF';
            edges = [
              {from: 1,   to: 8,  value: 3,   label: 3,   color: color},
              {from: 1,   to: 9,  value: 5,   label: 5,   color: color},
              {from: 2,   to: 10, value: 1,   label: 1,   color: color},
              {from: 4,   to: 6,  value: 8,   label: 8,   color: color},
              {from: 5,   to: 7,  value: 2,   label: 2,   color: color},
              {from: 4,   to: 5,  value: 1,   label: 1,   color: color},
              {from: 9,   to: 10, value: 2,   label: 2,   color: color},
              {from: 2,   to: 3,  value: 6,   label: 6,   color: color},
              {from: 3,   to: 9,  value: 4,   label: 4,   color: color},
              {from: 5,   to: 3,  value: 1,   label: 1,   color: color},
              {from: 2,   to: 7,  value: 4,   label: 4,   color: color}
            ];

            // create a network
            var container = document.getElementById('visualization');
            var data = {
              nodes: nodes,
              edges: edges
            };



          var options = {
              stabilize: false,
              smoothCurves: true,

              //- hierarchicalLayout: {
              //-     direction: 'UD'
              //- }
          };
            network = new vis.Network(container, data, options);

            // add event listeners
            network.on('select', function(params) {
              document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
            });

            //- console.log(network)
            //- network.addNode({id: 1,  label: 'Algie',   image: DIR + 'Smiley-Angry-icon.png', shape: 'image'})
          }

            draw()


         








        function forceGraph() {
            // This demo shows how to create an SVG node which is a bit more complex
            // than single image. Do accomplish this we use 'g' element and
            // compose group of elements to represent a node.
            graph = Viva.Graph.graph();

            var graphics = Viva.Graph.View.svgGraphics(),
                nodeSize = 28;

            graphics.node(function(node) {

              nodeSize = node.size || nodeSize


              console.log(node.data || node.id)

              var ui      = Viva.Graph.svg('g'),
                  title   =  ( node.data || node.id ),
                  svgText = Viva.Graph.svg('text')
                    .attr('y', '-4px')
                    .text(title),

                  img     = Viva.Graph.svg('image')
                             .attr('width', nodeSize)
                             .attr('height', nodeSize)
                             .link('/files/' + node.data);

              //- if(node.data) ui.append(svgText);
              if( node.data ) 
                if( node.data.split('.').pop() === "jpg"  ) 
                  ui.append(img);
                else
                  ui.append(svgText);



              return ui;
            }).placeNode(function(nodeUI, pos) {
                // 'g' element doesn't have convenient (x,y) attributes, instead
                // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
                nodeUI.attr('transform',
                            'translate(' +
                                  (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
                            ')');
            });

            graphics.link(function(link){
                var isParent = (link.data === 'Child'),
                    ui = Viva.Graph.svg('path')
                           .attr('stroke', isParent ? '#e7e7e7' : '#e7e7e7')
                           .attr('fill', "none");

                ui.isParent = isParent; // remember for future.

                return ui;
            }).placeLink(function(linkUI, fromPos, toPos) {
                
                // linkUI - is the object returend from link() callback above.
                var ry = linkUI.isParent ? 1: -1,

                // using arc command: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
                    data = 'M' + fromPos.x + ',' + fromPos.y +
                           ' A 1,' + ry + ',-30,0,0,' + toPos.x + ',' + toPos.y;

                // 'Path data' (http://www.w3.org/TR/SVG/paths.html#DAttribute )
                // is a common way of rendering paths in SVG:
                linkUI.attr("d", data);
            });



            var createMarker = function(id) {

              return Viva.Graph.svg('marker')
                .attr('id', id)
                .attr('viewBox', "0 0 10 10")
                .attr('refX', "10")
                .attr('refY', "5")
                .attr('markerUnits', "strokeWidth")
                .attr('markerWidth', "10")
                .attr('markerHeight', "5")
                .attr('orient', "auto");
            }



            var layout = Viva.Graph.Layout.forceDirected(graph, {
                springLength : 14,
                springCoeff : 0.0001,
                dragCoeff : 0.05,
                gravity : -1.4
            });

            //- graph.addLink('a', 'c', 'Parent');
            //- graph.addLink('a', 'c', 'Child');
            //- graph.addLink('b', 'c', 'Child');

            // Render the graph
            var renderer = Viva.Graph.View.renderer(graph, {
                graphics : graphics
              , layout : layout
              , container : document.getElementById('graphVisualization')

                });
            

            renderer.run();

            return graph
            console.log("trying to renderer")
        }











          function columnChart(opts){

            return { chart: {
              //- inverted:true,
              renderTo: (opts.div || "body"),
              animation:{ easing:"linear", duration:255 },
              backgroundColor:'rgba(0,0,0,0)',
              type: "area",
              },
              credits: {enabled:false},
              legend:  {enabled:false},
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                gridLineWidth: 0,
                  minorGridLineWidth: 0, lineColor: 'transparent', minorTickLength: 5, tickLength: 0, 
                        type: 'category',
                        labels: {
                            //- rotation: -45,
                            style: {
                                fontSize: '10px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                  minorGridLineWidth: 0, lineColor: 'transparent', minorTickLength: 5, tickLength: 0, 
                gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: ''
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y:.1f} </b>',
                    },
                    series: [{
                        lineWidth: 0,
                        color:'#444',
                        shadow : { color:'#000000', offsetX:0, offsetY:2, opacity:0.5, width:3 },
                        name: '',
                        data: [],
                        dataLabels: {
                            color: '#ccc',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '10px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 3px black'
                            }
                        }
                    }]
            };

          }


          function chartOptions(div, type, categories){
            return {
              chart: {
              //- inverted:true,
                renderTo: (div || "body"),
              backgroundColor:'rgba(0,0,0,0)',
                animation:{ easing:"linear", duration:200 },
               type: (type || "line")
              },
              title: { text: '' },
                 xAxis: { 
                  type: categories || null,
                  lineWidth: 0,
                  minorGridLineWidth: 0, lineColor: 'transparent', minorTickLength: 5, tickLength: 0, 
                  title: null, 
                  labels : { enabled: false }, gridLineWidth: 0},
                yAxis: { title: null, labels : { enabled: false }, gridLineWidth: 0},
                gridLineWidth: 0,
              tooltip: { enabled: false },
              legend: {
                  enabled: false,
                  align: 'right',
                  verticalAlign: 'middle',
                  borderWidth: 0
              },
              plotOptions: {
                line: {
                    pointStart: 0,
                    lineWidth: 2,
                    max:100,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 0,
                        states: { hover: { enabled: true } }
                    }
                }
              },
              credits: {enabled:false},
              legend:  {enabled:false},
              series: [{                 
                name: 'system',
                //- shadow : { color:'#222222', offsetX:0, offsetY:2, opacity:0.5, width:3 },
                color:'#222'
              }
              ]
              };

          }


          chart = new Highcharts.Chart(chartOptions("system_chart", "line"));

          nodes_chart = new Highcharts.Chart(columnChart( { div:"nodes_chart" } ));

          /**
           * Dispatches socket message to DOM elements
           * @param  {Object} message 
           * @return {}
           */

          function parseMessage(message){

            if(models[message.model] && models[message.model][message.verb]){
              if(!message.data) message.data={} 
              message.data.id = message.id
              models[message.model][message.verb]( message.data || message );

              console.log("Parsed: ", message);
              $(".nodes_count").html( $("#system_container .signal").length -1 )
            } else { console.log("parseMessage(): don't know what to do with the recieved message.") }
          }


          /**
           * Listens to socket
           * @param  {Object} message
           * @return {}
           */

          socket.on('message', function(message){ parseMessage(message); });

          window.socket = socket


        })(window.io);


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

