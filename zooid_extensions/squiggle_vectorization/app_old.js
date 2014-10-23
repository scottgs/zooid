module.exports = function(collective){


   collective.on("terrain_silhouette", function(signal){

      getSignatureFromPoints(signal.points, function(err, signature){
         var new_signal = {}
         new_signal.parent_id = signal.id
         new_signal.signature = signature
         collective.emit("terrain_silhouette_signature", new_signal)
      })
   })


   collective.on("test", function(){
      var signal = {}
      signal.points = [
              {x:0,y:11}, {x:1, y:13}, {x:2, y:15}, {x:3, y:111}, {x:4, y:19}, {x:5, y:17}, {x:6, y:17}
            , {x:7, y:17}, {x:8, y:17}, {x:9, y:11}, {x:10, y:13}, {x:11, y:15}, {x:12, y:111}, {x:13, y:19}
            , {x:14, y:17}, {x:15, y:17}, {x:16, y:17}, {x:17, y:17}, {x:18, y:111}, {x:19, y:115}, {x:20, y:111}
            , {x:21, y:119}, {x:22, y:17}, {x:23, y:117}, {x:24, y:117}, {x:25, y:113}, {x:26, y:115}, {x:27, y:111}
            , {x:28, y:19}, {x:29, y:117}, {x:30, y:117}, {x:31, y:117}, {x:32, y:17}, {x:33, y:11}, {x:34, y:13}, {x:35, y:17}
            , {x:36, y:19}, {x:37, y:117}, {x:30, y:117}, {x:38, y:117}, {x:39, y:7}, {x:40, y:1}, {x:41, y:3}, {x:42, y:7}
      ];
      getSignatureFromPoints( signal.points, function(err, silhouette_signature){
         console.log("TEST PASSED:", "terrain_silhouette");
         // console.log(silhouette_signature)
      })
   })

}



var _ = require("underscore");
var async= require("async");

var demo = function(ar){
   var ii=3; while(ii-- > 1) console.log(ar[ii]);
   return 1
}

var err = null
var config = {};

// Sorts on x values
xort = function(a,b) {
   if (a.x < b.x) return -1;
   if (a.x > b.x)return 1
   return 0
}

var normalize = function( signature, next ){
   
   // console.log("normalize")
   // demo(signature)

   var merged = [];
   if (signature instanceof Array) {
      if (signature[0] instanceof Array) {
         squiggleCount = signature.length;
         merged = merged.concat.apply(merged, signature);
      } else {
         merged = [signature]
         squiggleCount = 1;
      }
   } else {
      next( "Error: Must send signature or arrays of signature." );
   }  
   next( null, merged )
}


var downSample = function( points, next ){
   // console.log("downSample")
   // demo(points)
   if(points.length < 4 * 5 ) next( err, points)
   points.sort( xort );
   var i
   var len = points.length
   var ds_coef = Math.ceil( len/1500 )
   var points_ds = [];
   var num_points = points.length;
   // var ds = ds_coef * (config['sampleRate'] || 4);
   var ds = 4;
   // get representation of entire squiggle
   for (i=0; i<points.length; i += ds) {
      points_ds.push(points[i]);
   }
   next( err, points_ds );
}



// todo: hard tanh ( piecewise linear )



// Compute the vector angles from the point array (AND FLIP)
// NOTE: The points are using y positive in the down direction
// which is incorrect, so logically, I "flip" the points
var computeVectorAnglesFromPoints = function ( points, next ) {
   // console.log("computeVectorAnglesFromPoints")
   // demo(points)

   vector_angles = [];
   for (var i=0; i<points.length -1; i+=1) {       
      var ang = Math.atan2(points[i]['y']-points[i+1]['y'], points[i+1]['x']-points[i]['x']);
      vector_angles.push(ang);
   }
   next( null, vector_angles);
}

// Compute the signature from vector angles
var computeSignatureFromVectorAngles = function (vector_angles, next ) {
   // console.log("computeSignatureFromVectorAngles")
   // demo(vector_angles)

   var signature = [];
   for (i=0; i < vector_angles.length -1; i++) {
      signature[i] = Math.sin((vector_angles[i+1] - vector_angles[i]) / 2);
   }
   next( null, signature);
}




var splitEvenly = function(a, n, next) {
   // console.log("splitEvenly")
   // demo(a)
   var len = a.length; var out = []; var i = 0;
   while (i < len) {
      var size = Math.ceil((len - i) / n--);
      var halfStep = Math.floor(size*0.5);
      out.push( a.slice(i, i += size));
      out.push( a.slice( (i-halfStep), (i+halfStep) ));
   }
   next( null, out );
}


var splitByVariance = function(a, next){
   // console.log("splitByVariance")
   // demo(a)

   var varianceThreshold = 4;

   var totsVariance = _.reduce( a, function(memo, num){ return Math.abs(memo) + Math.abs(num); }, 0);
   console.log("total variance");
   console.log(totsVariance);
   var len = a.length, out = [], i = 0, last = 0, variance = 0;
   for(i=0; i<len; i++) {
      if( Math.abs( variance += a[i] ) > ( totsVariance / varianceThreshold) || i-last > len / varianceThreshold){
         out.push( a.slice( last, i ) );
         last = i;
         console.log("variance", variance);
         variance=0;
      }
   }
   out.push( a.slice( last-20, a.length ) )
   out.push( a.slice( last, a.length ) )
   next( err,  out )
}




var isolatePartsByVariance = function( signature, next ){
   // console.log("isolatePartsByVariance")
   // demo(signature)

   var minChop             = config['minSplitFactor'] || 1
   var maxChop             = config['maxSplitFactor'] || 2
   var varianceThreshold   = 5

   if( (signature.length / varianceThreshold) < 10 )
      next( err, signature)
   // var varianceThreshold   = config['varianceThreshold'] || 2
   var isolatedParts = [];
   downSample( signature, function(ds){ isolatedParts.push( ds.join() ); }, Math.ceil(signature.length/24) );
   splitByVariance( signature, varianceThreshold, function(parts){
      for (var j = parts.length - 1; j >= 0; j--) {
         isolatedParts.push( parts[j] );
      };
   })
   next( err, isolatedParts);

}




var isArray = function (obj) {
   return Object.prototype.toString.call(obj) === "[object Array]";
}
var getNumWithSetDec = function( num, numOfDec ){
   var pow10s = Math.pow( 10, numOfDec || 0 );
   return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
}
var getAverageFromNumArr = function( numArr, numOfDec ){
   if( !isArray( numArr ) ){ return false;   }
   var i = numArr.length, 
      sum = 0;
   while( i-- ){
      sum += numArr[ i ];
   }
   return getNumWithSetDec( (sum / numArr.length ), numOfDec );
}
var getVariance = function( numArr, numOfDec ){
   if( !isArray(numArr) ){ return false; }
   var avg = getAverageFromNumArr( numArr, numOfDec ), 
      i = numArr.length,
      v = 0;
 
   while( i-- ){
      v += Math.pow( (numArr[ i ] - avg), 2 );
   }
   v /= numArr.length;
   return getNumWithSetDec( v, numOfDec );
}
var getStandardDeviation = function( numArr, numOfDec ){
   if( !isArray(numArr) ){ return false; }
   var stdDev = Math.sqrt( getVariance( numArr, numOfDec ) );
   // console.log(stdDev);
   return stdDev
};


var getBest = function(signature, next){
   
   // console.log("getBest")
   // demo(signature)
   var n = 10

   // console.log("GETTING BEST: ", n);
   if(signature.length <= 5)  next( err, signature);
   var deviations = []
   var results = []
   for (var p = n; p >= 0; p--){
      deviations[p]=0;
   }

   for (var i = signature.length - 1; i >= 0; i--) {
      var s = getStandardDeviation(signature[i], 5);
      console.log(s)
      for (var j = deviations.length - 1; j >= 0; j--) {
         if(deviations[j] < s){
            console.log(deviations[j], " < ", s)
            deviations[j] = s;
            results[j] = signature[i];
            break;
         }
      };
   };

   for (var r = results.length - 1; r >= 0; r--) {
      // console.log("TESTING: ", results[r])
      if( !!results[r] && results[r].length < 5 ){
         results.splice(r,1);
      }
   };
   next( null, results);

}



var stringifyParts = function( parts, next ){
   // console.log("stringifyParts")
   // demo(parts)
   
   var stringifiedParts = [];
   for (var i = parts.length - 1; i >= 0; i--) {
      stringifiedParts.push( parts[i].join() );
   };
   next( null, stringifiedParts)
}

var fibSplit = function(arr, next){
   // console.log("fibSplit")
   // demo(arr)
   
   var split_counts = [1, 2, 3, 5, 8, 13, 21]

   var split_parts = [];

   for(var i = split_counts.length - 1; i >= 0; i--) {

      splitEvenly( arr, split_counts[i], function(err, parts) {
         _.each(parts, function(part){split_parts.push(part); } );

         // console.log("Parts: ", i, split_counts[i], parts.length )
      });
   };

   // console.log("Finished Fib Split:", split_parts);
   next( null, split_parts);
}


function getElite( split_parts, next ){
   // console.log("getElite")
   // demo(split_parts)
   
   var filtered_parts = _.filter(split_parts, function(part){ return part.length > 4 })

   // console.log("Sorting by Standard devation over length ", filtered_parts.length)

   // _.each( filtered_parts, function(part) { console.log("Not sorted:", part.length); })

   var sorted_by_deviation = _.sortBy(filtered_parts, function(part){ return -(getStandardDeviation(part)); })

   // _.each(sorted_by_deviation, function(part) { console.log("Sorted by standard devation", part.length); })
   var best_by_deviation = _.first(sorted_by_deviation, 15);
   var sorted_by_length = _.sortBy(best_by_deviation, function(part){ return -part.length })
   
   // _.each(sorted_by_length, function(part) { console.log("Sorted by lebgth", part.length); })
   var best_by_length_and_deviation = _.first(sorted_by_length, 4)
   // console.log("elite:", best_by_length_and_deviation.length);

   next( null, best_by_length_and_deviation);

}



function getSignatureFromPoints( points, next ){
   // console.log("getSignatureFromPoints")
   // demo(points)

   var dispatch = async.compose( getElite, fibSplit, computeSignatureFromVectorAngles, computeVectorAnglesFromPoints, downSample );

   dispatch( points, function(err, signature){
      // console.log( err || signature );
      next( err, signature );
   })

}


         // normalize([points], function(err, normalized_path) {
         //    console.log("normalized", normalized_path.length);
            
         //    demo(normalized_path)

         //    if(normalized_path.length < 12) next();

         //    downSample(normalized_path, function(err, ds_path, ws_path){

         //       console.log("ds_path", ds_path.length);
         //       demo(ds_path)

         //       computeVectorAnglesFromPoints( ds_path, function(err, vector_angles){

         //          console.log("vector_angles", vector_angles.length);
         //          demo(vector_angles);
                  
         //          computeSignatureFromVectorAngles( vector_angles, function(err, points){

         //             console.log("points", points.length);
         //             demo(points);


         //             fibSplit(points, function(err, split_parts){

         //                getElite(split_parts, function(err, best_by_length_and_deviation){
         //                   next( err, best_by_length_and_deviation);
         //                })
         //             })
         //          }) 
         //       })
         //    })
         // })




// PHP IMPORT


// //Compare utility
// __cmp_utility = function (a, b) { return(a["utility"] < b["utility"]); }

//    //CALL THIS FUNCTION TO COMPUTE THE SIGNATURE WITH AN ARRAY
//    //OF POINTS SEPERATED IN FORMAT array(x0, y0, x1, y1, x2, y2, ... , xn, yn)
//    signature = function (split_points, window_size, window_step_size) {
//       error = "";
      
//       total = count(split_points);
//       if (total % 2 == 1 || total == 0) error = buildError("There must be an even number of argumets in the format: window_size/window_step_size/x0/y0/x1/y1/...");
//       if (window_size == 0) error = buildError("First argument \"window_size\" must not equal 0");
//       if (window_step_size == 0) error = buildError("Second argument \"window_step_size\" must not equal 0");
//       if (!empty(error)) { echo(error); return; }
      
//       //Get the array by merging the seperated array format to an array of points
//       points = this->convertSeqToPointArray(split_points);
      
//       //Get the various signatures using different sample rates
//       raw_signature = this->__signature(points, window_size, window_step_size);
      
//       //Grab interpolated & nearest neighbor
//       interpolated = this->buildDownsampledArray(points, array(3), 1, window_size, window_step_size);
//       nearest = this->buildDownsampledArray(points, array(3), 0, window_size, window_step_size);
      
//       //Extract the most useful signatures
//       useful = array();
//       useful = array_merge(useful, array_slice(this->mostUsefulSignatures(interpolated), 0, 5));
//       useful = array_merge(useful, array_slice(this->mostUsefulSignatures(nearest), 0, 5));
      
//       //Sort the result and slice
//       //usort(useful, "__cmp_utility");
//       //useful = array_slice(useful, 0, 5);
      
//       //Get the result
//       result = array("args" => json_encode(points), "success" => true, "data" => array('raw' => raw_signature, 'interpolated' => interpolated, 'nearest' => nearest, 'useful' => useful));
//       echo (json_encode(result));
//    }
   
//    //This returns signature with the utility and signature
//    __signature = function (points, window_size, window_step_size, extra=array()) {
//       //Compute the signatures
//       sigs = this->computeSigFromPoints(points, window_size, window_step_size);
      
//       //Go through each signature and add the utility and extra data
//       for (i=0; i<count(sigs); i++) { 
//          sigs[i]["utility"] = this->L1norm(sigs[i]["signature"]);
//          if (!empty(extra)) sigs[i]["extra"] = extra;
//       }
      
//       //Sort based on utility
//       usort(sigs, "__cmp_utility");
      
//       //Return the modified signatures
//       return(sigs);
//    }
   
//    buildError = function (err_message) {
//       return(json_encode(array("success" => false, "message" => err_message, "data" => array())));
//    }
   
//    //Get most useful signatures
//    mostUsefulSignatures = function (signature) {
//       merged_array = array();
//       foreach(signature as sig_set) { merged_array = array_merge(merged_array, sig_set); }
//       usort(merged_array, "__cmp_utility");
//       return(merged_array);
//    }
   
//    //L1-norm
//    L1norm = function (signature) {
//       sum = 0;
//       foreach(signature as val) { sum += abs(val); }
//       return(sum);
//    }
   
//    //Build a downsampled array
//     buildDownsampledArray = function (points, factors, method, window_size, window_step_size) {
//       downsample = array();
//       method_type = array(0 => 'nearest neighbor', 1 => 'interpolated', 2 => 'interpolated');
//       extra = array('type' => method_type[method]);
      
//       //Loop through and build the array based on factors
//       foreach(factors as factor) { 
//          extra['factor'] = factor;
//          downsample[factor] = this->__signature(this->downsamplePoints(points, factor, method), window_size, window_step_size, extra);
//       }
      
//       return(downsample);
//    }
   
//    //Windowing code for monolithic point array
//     windowPoints = function (points, window_size, window_step_size) {
//       adj_window_size = window_size + 1;
//       windows = array();
      
//       //Get the total number of points and windows
//       num_points = count(points);
//       num_windows = ceil((num_points-window_size) / window_step_size);
      
//       for (w=0; w<num_windows; w++) {
//          //Get the overflow from the end
//          diff = w*window_step_size+adj_window_size - num_points;
         
//          //Initialize the slice array
//          slice = array();
         
//          //If the difference is positive or zero, then there is no overlap
//          if (diff <= 0) {
//             slice = array_slice(points, w*window_step_size, adj_window_size);
//          }
         
//          //Add the slice to the end of the windows
//          windows[] = slice;
//       }
      
//       return(windows);
//    }
   
//    //Compute the signature from the monolithic array
//     computeSigFromPoints = function (points, window_size, window_step_size) {
//       window_points = this->windowPoints(points, window_size, window_step_size);
//       signatures = array();
      
//       //Go through each window and compute their signature
//       foreach(window_points as ptwin) {
//          vector_angles = this->computeVectorAnglesFromPoints(ptwin);
//          signatures[] = array("points" => ptwin, "signature" => this->computeSignatureFromVectorAngles(vector_angles));
//       }
      
//       //Return the signatures organized by points and their respective signatures
//       return(signatures);
//    }

//    //Convert the sequence to points and flip
//     convertSeqToPointArray = function (split_points) {
//       points = array();
//       for (i=0; i<count(split_points); i+=2) {
//          points[] = array('x' => floatval(split_points[i]), 'y' => floatval(split_points[i+1]));
//       }
//       return(points);
//    }
   

   
//    //Returns a trimmed array removing values from an array
//    // front - the number of values to remove from the front of the array
//    // back - the nubmer of values to remove from the back of the array
//    trimArray = function (array, front, back) {
//       return(array_slice(array, front, -back));
//    }
   
//    //Downsample using interpolation
//    // type:
//    // 0 - Nearest Neighbor
//    // 1 - Interpolated
//    // 2 - Interpolated By Domain
//    
//    downsamplePoints = function (points, ds, type = 1) {
//       //Protect against invalid downsampling
//       if (ds <= 2) return(points);
//       if (ds == 2) return(this->downsampleByDomain(points, ds));

//       //Create the return and number of points
//       points_ds = array();
//       num_points = count(points);
      
//       //Loop through and perform downsampling
//       for (i=0; i<count(points); i += ds) {
//          remaining_points = num_points - i;
         
//          ds_val = 1;
//          if (type == 1) ds_val = min(remaining_points, ds);
//          points_ds[] = array('x' => points[i]['x']/ds_val, 'y' => points[i]['y']/ds_val);
         
//          cp = count(points_ds)-1;
//          for (j=1; j<ds_val; j++) {
//             points_ds[cp]['x'] += points[i+j]['x']/ds_val;
//             points_ds[cp]['y'] += points[i+j]['y']/ds_val;
//          }
//       }
      
//       //Return the downsampled
//       return(points_ds);
//    }

//    //Downsample using modified interpolation
//    downsampleByDomain = function (points, ds)
//    {
//       points_ds = array();
//       num_points = count(points);

//       for (i=0; i<count(points); i += ds) {
//          points_ds[] = array('x' => points[i]['x'], 'y' => points[i]['y']);
//          cp = count(points_ds)-1;
         
//          j=1;
//          for (;;j++) {
//             if (i+j >= num_points && abs(points[i+j]['x']-points[i]['x']) < ds) {
//                points_ds[cp]['y'] += points[i+j]['y'];
//             } else {
//                j--;
//                break;
//             }
//          }

//          points_ds[cp]['y'] /= j;
//       }

//       return(points_ds);
//    }
// }

