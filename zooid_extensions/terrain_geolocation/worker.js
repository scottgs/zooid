Geolocator_module = require('./build/Release/Geolocator_module');
geolocator 			= new Geolocator_module.Geolocator_module();
signal_processor  = require("../Signal_processor_module");
geolocator.initialize( "/etc/vmr/geolocate.conf" );

process.on('message', function(data) {

	signal_processor.getSignaturesFromPoints( data, function(signal){
		geolocator.search( signal, function(err, res){
			console.log(res);
	   	process.send(res);
		})
	}) 
});