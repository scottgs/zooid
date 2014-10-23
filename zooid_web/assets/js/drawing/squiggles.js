var typeIsArray = Array.isArray || function( value ){
    return ({}.toString.call( value ) === '[object Array]')
}

function Squiggles(path){
   
// Heuristics
// -----------------------------------------------------------------------------

   this.interpolationRate  = 4
   this.maxStep            = 30
   this.step               = 2


// Instance 
// -----------------------------------------------------------------------------
   this.chartNum   = 0
   this.chartColor = "aaaaaa"
   this.chartIndex = 0
   this.squiggles  = []
   this.metrics    = []
   this.interpolated  = []

   // this.interPath = path.reduce(function(a, b) {
   //    console.log()
   //    return a.concat(b);
   // });

 
    this.path = path;
  


   // console.log(this.path)

   // $.each(this.path, function( index, value ) {
   //    // console.log(value)
   // })
   return this

}


Squiggles.prototype.geolocate = function(){

    var self = this;
    // var flat = this.flattenPath()

    console.log( this.path )


}

Squiggles.prototype.flattenPath = function(){

   var flat = new Array()
   for( var i = 0; i < this.path.length ; i++) {
         flat.push(this.path[i].y + 0)
    }
    return flat
}


// Sorts on x values
// -----------------------------------------------------------------------------
Squiggles.prototype.xort = function(a,b) {
   if (a.x < b.x)
      return -1;
   if (a.x > b.x)
      return 1
   return 0
}

// Creates a chart, initiates the metrics, adds them to chart
// -----------------------------------------------------------------------------
Squiggles.prototype.makeVectorChart = function(){
  // path.sort(this.xort)
  var i = 0
  // console.log(this.path)
  for(var i =0 ; i < this.path.length ; i++ ) {
    if (this.path[i].y > 0) this.path[i].y *= -1;
  }
  // this.interpolate()
  this.path.sort(this.xort)
  // this.squigglometrics()
  // this.appendToResultChart([this.path])
  // this.appendToAnalyticsChart(this.metrics)
  // this.appendToVectorChart(this.path)
  // this.appendToAnalyticsChart(this.path)

  // this.geolocate()
}

Squiggles.prototype.addPath = function(path) {
  this.path = path;
}

// Interpolates
// -----------------------------------------------------------------------------
Squiggles.prototype.interpolate = function() {

   var interpolated = []
   for( var i = 0; i < this.path.length ; i++) {
      var j = this.interpolationRate
       var tmp = {}
       tmp.x = this.path[i].x + 0 
       tmp.y = this.path[i].y + 0
    }
}

// Adds Hex for color changes
// -----------------------------------------------------------------------------
Squiggles.prototype.addHexColor = function(c1) {

  var c2 = '#0f0f0f';
  var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) { hexStr = '0' + hexStr; } 
  this.chartColor = hexStr
  return hexStr;
}

// Does analytics on the squiggle
// -----------------------------------------------------------------------------
Squiggles.prototype.squigglometrics = function() {

    var z = this.path[0].y
    for( var i = 0 ; i < this.path.length ; i++ ){
       var tmp = {}
       tmp.x   = this.path[i].x
       tmp.y   = Math.sin( ( z - this.path[i].y ) )
       z = this.path[i].y
       this.metrics.push(tmp);
    }
}




// Appends metrics to the analytics chart
// -----------------------------------------------------------------------------
// Squiggles.prototype.appendToAnalyticsChart = function(metrics){

//   if ( !$('#vectorChart').highcharts() ) {  
//     this.initVectorChart() 
//   }


//     var self = this;
//     $.each( metrics, function( key, metric ) {
//       $('#vectorChart').highcharts().addSeries({ 
//           name:  'sguiggle angle'
//         , type:  'column'
//         , color: '#aaaadd'
//         , yAxis:  0
//         , index: self.chartIndex++
//         , data: metric
//       })
//    })
// }

// Appends metrics to the analytics chart
// -----------------------------------------------------------------------------
Squiggles.prototype.appendToResultChart = function( resultSet ){
    var self = this;



    if ( typeIsArray( resultSet[0][0] ) ){
      resultSet = resultSet[0];
    } else {
      resultSet = [resultSet];
    }
    $('#resultChart').html('')
    $.each( resultSet, function( key, result ) {
      $('#resultChart').append("<div class='metric btn-xs btn-block nopadv' />")

      $(".metric:last").highcharts({
          chart: {
             height: 70,
             backgroundColor:'rgba(0, 0, 0, 0)',
             type: 'line'
          },
          credits: {
             enabled: false
          },
          title: { text: '' },
               xAxis: { 
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
              series: {
                lineWidth: 2
              },
              line: {
                  pointStart: 0,
                  marker: {
                      enabled: false,
                      symbol: 'circle',
                      radius: 0,
                      states: { hover: { enabled: true } }
                  }
              }
            },
            series: [{
                name: ' ',
                shadow : { color:'#FFFFFF', offsetX:0, offsetY:2, opacity:0.5, width:3 },
                color:'#fff',
                data: result
            }]
        });
   })

}

// Plots path on the dom in highcharts chart
// -----------------------------------------------------------------------------
Squiggles.prototype.initVectorChart = function() {

   $('#vectorChartContainer').show('fade')
   $('#vectorChart').highcharts({
      chart: {
         height: 120,
         backgroundColor:'rgba(0, 0, 0, 0)',
         type: 'line'
      },
      credits: {
         enabled: false
      },
      title: {
         text: '',
             style: {
               color: '#666'
            }
      },
      legend: false,
      xAxis: { 
        lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',
   minorTickLength: 0,
   tickLength: 0,
   title: null, 
   labels : { enabled: false }, gridLineWidth: 0},

      yAxis: [{ // Primary yAxis
        gridLineWidth: 011,
         labels: {
            enabled: false,
            formatter: function() {
               return this.value + ' '
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

      plotOptions: {

              series: {
                lineWidth: 2
              },

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
          color:'#992233',
          yAxis: 2,
          shadow : { color:'#000000', offsetX:0, offsetY:0, opacity:1, width:7 },
          index: 3,
          data:  this.path
      }]
  });
}


// Plots path on the dom in highcharts chart
// -----------------------------------------------------------------------------
Squiggles.prototype.initAnalyticsChart = function() {

   $('#resultChart').highcharts({
      chart: {
         height: 80,
         type: 'line'
      },

      credits: {
         enabled: false
      },
      title: {
         text: ''
      },
      legend: false,
      xAxis: { labels : { enabled: false }},
      yAxis: [{ // Primary yAxis
         labels: {
            formatter: function() {
               return this.value + ' '
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
               color: '#000'
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

      plotOptions: {
          line: {
              pointStart: 0,
              marker: {
                  enabled: false,
                  symbol: 'circle',
                  radius: 0,
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
      series: null
  });
}




 
