$(function () {


function xort(a,b) {
  if (a.x < b.x)
     return -1;
  if (a.x > b.x)
    return 1;
  return 0;
}




   makeVectorChart = function(path){

   path.sort(xort);

   var i = path.length;
   var tots=0;

   while(i-- > 0) {
      tots += path[i].y;
      path[i].y *= -1;
   }


/*
--------------------------------------------------------------------------------
   ω =  sin ( (a[i] - a[i-1]) / 2 ) ∀i in θ  
--------------------------------------------------------------------------------
*/
   

   var mean = tots / path.length;


   var a = [];
   var b = [];
   var c = [];
   var i = path.length-1;
   var z = path[path.length-1].y;
   
   // d of i little m
   var m = 2;

   while(i-- > 0) {
      var tmp = {};
      tmp.x = path[i].x;
      tmp.y =  Math.sin( ( z - path[i].y ) / 2 );
      z = path[i].y;
      a.push(tmp);
      i-=m;
   }

   var i = path.length-1;

   var step = 7;


   // ω = sin(αi − αi−1)/2, ∀i ∈ Θ
   var z = path[path.length-1].y;

   while( i-=step > 0 ){
      var tmp  =  {};
      tmp.x    =  path[i].x;
      tmp.y    =  Math.sin( ( z - path[i].y ) / 2 );
      z = path[i].y;
      b.push(tmp);
   }

   var maxStep   = 24
   var step      = 2
   var i         = 0
   var squiggles = []
   var stepSize  = 0

   while( ++step < maxStep ){
      i = 0
      squiggles[stepSize] = [];

      while( (i+=step) < path.length ){
         var tmp = {}
         tmp.x   = path[i].x
         tmp.y   = ( path[i-1].y - path[i].y ) / 2

         squiggles[stepSize].push(tmp)
      }
      stepSize++
   }






   // // a of i
   // var a = [];

   // var i = angryPath.length-1;

   // while(i--) {
   //    var tmp = {};
   //    tmp.x = angryPath[i].x;
   //    tmp.y = Math.atan(angryPath[i].y * angryPath[i].y);
   //    a.push(tmp);
   // }

   typeof chartNum === "undefined" ? chartNum=0 : chartNum++ ;

   console.log(chartNum);

   $('#vectorChartContainer').show();

   $('#vectorChart').highcharts({
         chart: {
             type: 'column'
         },
         credits: {
      enabled: false
         },
         title: {
             text: ''
         },
         legend: false,
      yAxis: [{ // Primary yAxis
                labels: {
                    formatter: function() {
                        return this.value +'  ';
                    },
                    style: {
                        color: '#cdc'
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: '#cdc'
                    }
                },
                opposite: true
    
            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: '',
                    style: {
                        color: '#ccccdd'
                    }
                },
                labels: {
                    formatter: function() {
                        return this.value +'';
                    },
                    style: {
                        color: '#ccccdd'
                    }
                },
                opposite: true
    
            }, { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: '',
                    style: {
                        color: '#994433'
                    }
                },
                labels: false
    
            }],

            xAxis: [{ // Primary xAxis

            }],

         plotOptions: {
             line: {
                 pointStart: 0,
                 marker: {
                     enabled: false,
                     symbol: 'circle',
                     radius: 2,
                     states: {
                         hover: {
                             enabled: true
                         }
                     }
                 }
             },
            areaspline: {
                 pointStart: 0,
                 marker: {
                     enabled: false,
                     states: {
                         hover: {
                             enabled: false
                         }
                     }
                 }
             }
         },

         series: [{
             name: 'sguiggle',
             type: 'line',
             yAxis: 0,
             index: 999,
             data: path
         }]
     });


      var chart = $('#vectorChart').highcharts();
      var sq = 0

      while (sq++ < squiggles.length){

         chart.addSeries({
            name:  'sguiggle angle',
            type:  'line',
            color: '#ddd',
            yAxis: 2,
            data: squiggles[sq]
         });

      }


   }
 });
    
