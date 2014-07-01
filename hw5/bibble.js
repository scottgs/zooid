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

function process_exit(){
	process.send(process.reduced_index);
	process.exit(0);
}

(function main(argv){
	var folder = argv[2];
	var search = argv[3];
	var nCPUs = os.cpus().length;
	var namespace = {};
	var CPU = [];
	if (cluster.isMaster) {
		// Fork workers.
		//////////////////////////////////////////////////////
		//					Before Fork						//
		//////////////////////////////////////////////////////
		process.on('message', function(msg){
			console.log(msg);
		})
		cluster.on('exit', function(worker, code, signal) {
			console.log('worker ' + worker.process.pid + " exited with\ncode: "+ code);
		});
		var files = fs.readdirSync(folder);
		//////////////////////////////////////////////////////
		//						Fork						//
		//////////////////////////////////////////////////////
		for (var i = 0; i < nCPUs; i++) {
			CPU[i] = cluster.fork();
		}
		//////////////////////////////////////////////////////
		//					After Fork						//
		//////////////////////////////////////////////////////
		// broadcast(function(worker){
		// 	namespace[worker.process.pid] = {id: worker.process.pid};
		// 	namespace[worker.process.pid].reverse_index = [];
		// });
		for(var i = 0; i < files.length; i++){
			CPU[i%CPU.length].send(files[i]);
		}
		for(var i in CPU){
			CPU[i].send('die');
		}
	} else {
		process.reduced_index = [];
		process.on('message', function(file) {
			if(file == 'die'){
				process_exit();
			}
			console.log(process.reduced_index.push(reduce.index(ri.reverse_index(file))));
		});
	}
})(process.argv);