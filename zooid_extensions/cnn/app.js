var convnetjs = require("convnetjs")
var timers = require("timers")


// create a magic net
var train_data = [ new convnetjs.Vol([0.1,0.2,0.3,0.4]), new convnetjs.Vol([0.4,0.3,0.2,0.1])]
var train_labels = [1,0]


var magicNet = new convnetjs.MagicNet(train_data, train_labels);
magicNet.onFinishBatch(finishedBatch); // set a callback a finished evaluation of a batch of networks
 
// start training MagicNet. Every call trains all candidates in current batch on one example
timers.setInterval( function(){ magicNet.step() }, 0 );

// once at least one batch of candidates is evaluated on all folds we can do prediction!
function finishedBatch() {
  // prediction example. xout is Vol of scores
  // there is also predict_soft(), which returns the full score volume for all labels
  var some_test_vol = new convnetjs.Vol([0.4,0.3,0.2,0.1]);

  var predicted_label = magicNet.predict(some_test_vol);
  console.log(predicted_label)
}



