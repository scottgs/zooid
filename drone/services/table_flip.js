var config = {};

module.exports = {

   run: function(req, fn){
      var flip = '(╯°□°）╯︵ ┻━┻'
      console.log(flip)
      fn(null, flip)
   }
}
