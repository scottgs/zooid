/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */


module.exports.local = {

  /***************************************************************************
  * Local is not included in the repo and putting this here is just a hack to 
  * set the port isolated form the other settings which shouldn't be commited.
  ***************************************************************************/

  port: require("../../zooid_config.js").port

};



module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'control/index'
  },

  '/cbir': {
    view: 'cbir/index'
  },

  '/z': {
    view: 'control/zodes'
  },

  '/s': {
    view: 'control/signals'
  },

  '/docs': {
    view: 'docs/index', layout: 'control/nav'
  },

  '/regenerate': function(req,res,next){
    
    /**
     * Generates documentation for specified directories.
     * @return {Docs} 
     */

    /**
     * Set directories for documentation consutruction.
     * @type {Array}
     */
    var dirs = [ 
        { 
        source:"../zooid_web/"
        ,title:"web"
        ,target:"../zooid_web/assets/docs/web" 
        }
      , { 
        source:"../zooid_core/"
      , title:"core"
      , target:"../zooid_web/assets/docs/core" 
        }
      // , { 
      //   source:"../zooid_docs/"
      // , title:"docs"
      // , target:"../zooid_web/assets/dox/docs" 
      //   }
      , { 
        source:"../zooid_extensions/"
      , title:"extensions"
      , target:"../zooid_web/assets/docs/extensions" 
        }
    ]

    /**
     * Bring in dependencies for child process spawn and path parsing
     * @type {Object}
     */
    var spawn = require('child_process').spawn;
    var path  = require("path")

    /**
     * Walks the directories and creates their documentation.
     * @type {Array}
     */

    var ignores = " --ignore node_modules,assets,policies,responses,config,tasks,.tmp,zooid_templates,Gruntfile.js"
    var template = " --template ../zooid_docs/template.jade"

    dirs.map(function(o) {
      var args = ""
      Object.keys(o).forEach(function(key) {
        args+=" --"+key+" "+o[key] 
      });
      var exec = require('child_process').exec, child;
      child = exec('doxx '+args+template+ignores, function(err,out,er){
        console.log(err||out||er);
      });
    });
    return res.view("docs/index")
 
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
