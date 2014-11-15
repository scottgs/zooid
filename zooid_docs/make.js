/**
 * Generates documentation for specified directories.
 * @return {Docs} 
 */
module.exports = function() {

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
  var path = require("path")

  /**
   * Walks the directories and creates their documentation.
   * @type {Array}
   */

  var ignores = " --ignore node_modules,assets,policies,responses,config,tasks,.tmp,zooid_templates,Gruntfile.js"
  var template = " --template template.jade"

    dirs.map(function(o) {
      var args = ""
      Object.keys(o).forEach(function(key) {
        args+=" --"+key+" "+o[key] 
      });
      var exec = require('child_process').exec, child;
      child = exec('doxx '+args+template+ignores, console.log);
    });

}()

// huge bash line for ignores and what not
// doxx  --target zooid_web/assets/docs/extensions --source ../zooid/zooid_extensions --title extensions && doxx --ignore node_modules,assets,policies,responses,config,zooid_docs,zooid_extensions,tasks,.tmp,zooid_templates,Gruntfile.js --target zooid_web/assets/docs/core --source ../zooid/zooid_core --title core && doxx --ignore node_modules,assets,policies,responses,config,zooid_docs,zooid_extensions,tasks,.tmp,zooid_templates,Gruntfile.js --target zooid_web/assets/docs/web --source ../zooid/zooid_web --title web

