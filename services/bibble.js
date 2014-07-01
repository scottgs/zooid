function file_list(dir, next){
  var results = [];
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
  file_path = './bibble/';
  file_list(file_path, function(err, results){
      if(err) return next(err);
      console.log(results);
      //next(results);
  });
};