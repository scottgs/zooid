(function() {

	/**
	* Processes signature from the input path and responds with an llos
	* which contains an array4of llos'
	* @param  {[type]} searchSquiggle
	* @return {[Array<clusterResults>]} signal
	*/

	var Geolocator_module 	= require('./build/Release/Geolocator_module')
	var geolocator 					= new Geolocator_module.Geolocator_module()
	geolocator.initialize("/etc/vmr/geolocate.conf")

	var merge = require("merge")

	var zooid = require("../../zooid_core")
	var zode = merge( require("./package.json"), { 
	    name:"Face Blurring"
	  , filename:"face_blurring.js"
	  , takes:"image"
	  , gives:"blurred_faces"
	  , status:"active"
	  , work:0
	  , actions:0 
	})
	
	console.log(zode.name, " intiated.")

	/******************************************************************************
	 * TEST WITH BASE CASE
	 * Run a test on the cluster with the default applicaiton of processing a small
	 * image for feature 
	 * 
	 * detection and reporting back to the overmind the events of
	 * both the event-positive and event-negative systems of signal processing.
	******************************************************************************/

	zooid.on( "test", function (signal){
	 zooid.send({ parent_id:signal.id, name:zode.name, text:"okay"})
	})


	zooid.on("terrain_silhouette", function(signal){

		clusterSize 			= config['clusterSize'] 		|| 500
		clusterDistance 	= config['clusterDistance'] || 8
		dataset 					= config['dataset'] 				|| "feature_small_gpu_afghan_360" 
		
		console.log("dataset, clusterSize, clusterDistance", dataset, clusterSize, clusterDistance )
		
		geolocator.search( signal, dataset, clusterSize, clusterDistance, function(err, clusterResults){
   		// zooid.emit(err, clusterResults, signal);
  	zooid.send({ parent_id:signal.id
	  		, name:"geolocation"
	  		, geojson:geojson
	  		, noun:"geojson"
	  		, text:err 
	  	})
		})
	})


}).call(this)
