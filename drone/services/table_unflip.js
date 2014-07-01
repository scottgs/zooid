var config = {};

module.exports = {

   do: function(req, fn){
      var flip = '┬─┬ノ(º_ºノ)'
      console.log(flip)
      fn(null, flip)
   }
}
