#An Event-Driven Compute Cluster 

**Zooid** /ˈzoʊ.ɔɪd/ is an asynchronous research environment built in node.js to grow quickly and scale nicely. It uses a super-fast UDP messager for inter-process-communications, and a set of self-optimizing, adaptive broadcast domains to distribute signals through the cluster. 

It's name sake is given for it's architectural likeness to the
 <a href="http://en.wikipedia.org/wiki/Zooid" title="http://en.wikipedia.org/wiki/Zooid">
 organism</a>.


###
###Zodes can

- Self-orient on the network.
- Saturate the machines thread pool with listeners.
- Assimilate hardware-specific skills from other zodes.
- Accumulate temporary action potentials.
- Prime anticipated events.


###Zodes can't yet

- Accumulate temporary action potentials.
- Prime anticipated events.

===

##Installation

	$ git clone this
###

	$ npm build .
	
#API
	

####Signals

    Signal.create({  , function(err, res){
      
      
    });
    
<!--
####Services

    
    Service.create({ 
        listener:"image", type:"CUDA", lib:"/nouns/detectFaces" 
    });-->
    
    
    
##Resources

#####Full Dependencies

- Sails.js http://sailsjs.org/#!
- zlib http://nodejs.org/api/zlib.html
- node-openCV https://github.com/peterbraden/node-opencv
- cluster
- axon
- underscore
- tesseract
- leptonica

#####References
- http://docs.opencv.org/modules/refman.html
- http://en.wikipedia.org/wiki/Technological_singularity

#####Utilities

- Filetype checking: https://github.com/mscdex/mmmagic
- http://underscorejs.org/#object
- http://lodash.com/docs
- https://github.com/mikejihbe/metrics
- http://jscheiny.github.io/Streams/

#####OpenCV

- http://docs.opencv.org/doc/tutorials/imgproc/table_of_content_imgproc/table_of_content_imgproc.html#table-of-content-imgproc
- http://docs.opencv.org/doc/tutorials/imgproc/histograms/histogram_equalization/histogram_equalization.html#histogram-equalization
- http://docs.opencv.org/modules/objdetect/doc/cascade_classification.html#featureevaluator
- http://docs.opencv.org/modules/objdetect/doc/cascade_classification.html#cascadeclassifier
- http://docs.opencv.org/modules/objdetect/doc/latent_svm.html#latentsvmdetector-detect

#####Torch7
- https://github.com/torch/torch7/wiki/Cheatsheet

#####Design
- http://jsfiddle.net/rniemeyer/UHcs6/
- http://github.hubspot.com/messenger/docs/welcome/
