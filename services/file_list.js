var fs = require('fs');
var os = require('os');

var splitEvenly = function(a, n, done) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        var halfStep = Math.floor(size*0.5);
        out.push( a.slice(i, i += size));
    }
    done(out);
}

var fillArray = function(service, count){
   var out = []; 
   while(count--)
      out.push(service)
   return out
}


//As it stands, I stole this from stack-overflow.  
//I'll rename everything soon so I don't violate a thing or anything.

   // GIVE THEM CREDIT! Just say "Thanks to SkaterCoder42069 on Stkack overflow." BB


function file_list(dir, next){
   var results = [];
   var new_services = [];
  fs.readdir(dir, function(err, list) {
    if (err) return next(err);
    var pending = list.length;
    if (!pending) return next(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          file_list(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) next(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) next(null, results);
        }
      });
    });
  });
}

var run = function run(req, next){

   file_path = req.out;
   file_list(file_path, function(err, results){
      if(err) return next(err);

      var step = 1;
      splitEvenly(results, step, function(groupedResults){
         console.log('groupedResults: ', groupedResults.length);
         var new_services = fillArray('reverse_index', Math.ceil(groupedResults.length));
         
         req.out = groupedResults;
         req.save( function(err, res){
            if(err) req.broadcast("err", req._id);
            req.broadcast( );
         });
         next(err, groupedResults, new_services);
      });
   });
};

var test = function test(){
   run({data: process.cwd()}, function(err, result){
      for(var r in result){
         console.log(result[r]);
      }
   });
};

module.exports.run = run;
module.exports.test = test;

// if(process.argv[2] === 'test')
//    test();
