module.exports = {
   run: function(req, fn){
      console.log("Map Reduce the bibble!", req);
      fn( null, 'bibble', 'file_list' );
   }
}