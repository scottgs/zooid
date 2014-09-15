module.exports = {
    
  index: function(req, res) {
    return res.view({
      control: []
    });
  },

  charts: function(req, res) {
    return res.view({
      control: []
    })
  },

  apophenia: function(req, res) {
    return res.view({
      control: []
    })
  },
  
  system: function(req, res) {
    return res.view({
      control: []
    })
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ControlController)
   */
  _config: {}

  
};
