module.exports = {
    
   index: function(req, res) {
               return res.view({
                   control: []
               });
           },

   a: function(req, res) {
            // console.log(req);
            return res.json({response:"success"});
      },


      

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ControlController)
   */
  _config: {}

  
};
