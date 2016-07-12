module.exports = {

/******************************************************************************
*******************************************************************************
 * ENVIRONMENT CONFIG.
 * 
 * Yeah, this is a strange way to do this, huh? But it's really straight
 * forward and doesn't require much instruction. And that's the idea here.
 * Spenind less time fighing computers, and more time playing with them.
 *
 * The convention would be to just modify process.ENV to persist this, but 
 * if we do it this way, then we keep everything more portable and I like that.
 *
 * BB
 * 
******************************************************************************/


/******************************************************************************
* I am not doing anything with this information, but might in the future and 
* if you have no objections to possibly having your name involved in some stats
* stuff, then replace this with your name.
******************************************************************************/

  developer: "Ben",


/******************************************************************************
 * LAYER 1 PORT
 * 
 * Select the port you would like to use for the web view. Your web stuff will 
 * be available at srs9.cgi.missouri.edu:PORT where PORT is the port th... 
 * well, if you can't figure out what PORT means here, you should probably pick 
 * a different major / hobby. When you snag your ports, please update the
 * range you've selected in the README.
 *
 * https://github.com/benbaker/zooid/blob/master/README.md
 *
 * For further screwing with this, see: /web/config/local.js
******************************************************************************/

  // Ben is using this one.

  web_port: 4445, 

  // You can probably use this next one. Unless someone else is.
  // web_port: 4446,


/******************************************************************************
* LAYER 2 PORT BLOCK
* Everyone needs there own port range. And you'll want to add this file to your
* .gitignore after you've changed it to your settings. And -- again, let's put 
* in the readme who is using what port ranges. If you don't mind... 
* 
* https://github.com/benbaker/zooid/blob/master/README.md
*
* Everyone gets one thousand ports -- for now. 
* And IPC stuff takes over ***02, ***03, and ***04 so be careful for that...
* In fact. let's just reserve the first ten nin your block for internal 
* messaging stuff.
******************************************************************************/

  // Ben is using this one.
  
  base_port: 42000,
  
  // You can probably use this one.
  // port_block: 43000,


}