var os = require('os');
var fs = require('fs');
var cluster = require('cluster');
var ri = require('./reverse_index.js');
var reduce = require('./reduce.js');

function broadcast(callback) {
	for (var id in cluster.workers) {
		callback(cluster.workers[id]);
	}
}

function process_exit(results){
	// process.send('string');
	process.send(results);
	process.exit(0);
}

(function main(argv){
	var folder = argv[2];
	var search = argv[3];
	var nCPUs = os.cpus().length;
	var namespace = {};
	var workers = [];
	var reduced_index = new reduce.Index();
	if (cluster.isMaster) {
		// Fork workers.
		//////////////////////////////////////////////////////
		//					Before Fork						//
		//////////////////////////////////////////////////////
		cluster.on('exit', function(worker, code, signal) {
			console.log('worker ' + worker.process.pid + " exited with\ncode: "+ code);
		});
		var files = fs.readdirSync(folder);
		//////////////////////////////////////////////////////
		//						Fork						//
		//////////////////////////////////////////////////////
		for (var i = 0; i < nCPUs; i++) {
			workers[i] = cluster.fork();
			workers[i].on('message', function(msg){
				for(var i = 0; i < 3; i++) console.log()
			});
		}
		//////////////////////////////////////////////////////
		//					After Fork						//
		//////////////////////////////////////////////////////
		// broadcast(function(worker){
		// 	namespace[worker.process.pid] = {id: worker.process.pid};
		// 	namespace[worker.process.pid].reverse_index = [];
		// });
		for(var i = 0; i < files.length; i++){
			workers[i%workers.length].send(files[i]);
		}
		for(var i in workers){
			workers[i].send('die');
		}
	} else {
		//////////////////////////////////////////////////////
		//					Child Process					//
		//////////////////////////////////////////////////////
		process.on('message', function onMessage(file) {
			if(file == 'die'){
				process_exit(reduced_index);
			}
			reduced_index = ri.reverse_index(file);
		});
	}
})(process.argv);