   Highcharts.setOptions({
       global: {
           useUTC: false
       }
   });

   /**
    * Dark theme for Highcharts JS
    * @author Torstein Honsi
    */

   // Load the fonts
   Highcharts.createElement('link', {
      href: 'http://fonts.googleapis.com/css?family=Unica+One',
      rel: 'stylesheet',
      type: 'text/css'
   }, null, document.getElementsByTagName('head')[0]);

   Highcharts.theme = {
      colors: ["rgba(220,250,255,0.5)", "rgba(220,250,255,0.55", "rgba(220,250,255,0.5"
       , "rgba(220,250,220,0.45)", "rgba(250,250,220,0.4)",  "rgba(255,250,220,0.4)", "rgba(250,220,255,0.45)", "rgba(255,220,255,0.4)",
         "rgba(255,220,250,0.45)", "rgba(220,255,255,0.45)", "rgba(250,220,255,0.5)", "rgba(220,220,255,0.55)"],
      chart: {
         backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
               [0, '#112640'],
               [1, '#112640']
            ]
         },
         style: {
            fontFamily: "'Helvetica Neue', sans-serif"
         },
         plotBorderColor: '#606063'
      },
      title: {
         style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '18px'
         }
      },
      subtitle: {
         style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
         }
      },
      xAxis: {
         gridLineColor: '#707073',
         labels: {
            style: {
               color: '#E0E0E3'
            }
         },
         lineColor: '#707073',
         minorGridLineColor: 'rgba(0,0,0,0)',
         tickColor: 'rgba(0,0,0,0)',
         title: {
            style: {
               color: '#A0A0A3'

            }
         }
      },
      yAxis: {
         gridLineColor: '#707073',
         labels: {
            style: {
               color: '#E0E0E3'
            }
         },
         lineColor: '#ffffff',
         minorGridLineColor: '#505053',
         minorGridLineWidth: 0,
         tickColor: '#707073',
         tickWidth: 0,
         title: {
            style: {
               color: '#A0A0A3'
            }
         }
      },
      tooltip: {
         backgroundColor: 'rgba(0, 0, 0, 0.85)',
         style: {
            color: '#F0F0F0'
         }
      },
      plotOptions: {
         series: {
            dataLabels: {
               color: '#c5c5c8'
            },
            marker: {
               lineColor: '#333'
            }
         },
         boxplot: {
            fillColor: '#ffffff'
         },
         candlestick: {
            lineColor: 'white'
         },
         errorbar: {
            color: 'white'
         }
      },
      legend: {
         itemStyle: {
            color: '#E0E0E3'
         },
         itemHoverStyle: {
            color: '#FFF'
         },
         itemHiddenStyle: {
            color: '#606063'
         }
      },
      credits: {
         style: {
            color: '#666'
         }
      },
      labels: {
         style: {
            color: '#707073'
         }
      },

      drilldown: {
         activeAxisLabelStyle: {
            color: '#F0F0F3'
         },
         activeDataLabelStyle: {
            color: '#F0F0F3'
         }
      },

      navigation: {
         buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
               fill: '#505053'
            }
         }
      },

      // scroll charts
      rangeSelector: {
         buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
               color: '#CCC'
            },
            states: {
               hover: {
                  fill: '#707073',
                  stroke: '#000000',
                  style: {
                     color: 'white'
                  }
               },
               select: {
                  fill: '#000003',
                  stroke: '#000000',
                  style: {
                     color: 'white'
                  }
               }
            }
         },
         inputBoxBorderColor: '#505053',
         inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
         },
         labelStyle: {
            color: 'silver'
         }
      },

      navigator: {
         handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
         },
         outlineColor: '#CCC',
         maskFill: 'rgba(255,255,255,0.1)',
         series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
         },
         xAxis: {
            gridLineColor: '#505053'
         }
      },

      scrollbar: {
         barBackgroundColor: '#808083',
         barBorderColor: '#808083',
         buttonArrowColor: '#CCC',
         buttonBackgroundColor: '#606063',
         buttonBorderColor: '#606063',
         rifleColor: '#FFF',
         trackBackgroundColor: '#404043',
         trackBorderColor: '#404043'
      },

      // special colors for some of the
      legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      background2: '#505053',
      dataLabelsColor: '#B0B0B3',
      textColor: '#C0C0C0',
      contrastTextColor: '#F0F0F3',
      maskColor: 'rgba(255,255,255,0.3)'
   };


  Highcharts.setOptions(Highcharts.theme);

