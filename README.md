#An Event-Driven Compute Cluster 

**Zooid** /ˈzoʊ.ɔɪd/ is an asynchronous research environment built in node.js to grow quickly and scale nicely. It uses a super-fast UDP messager for inter-process-communications, and a set of self-optimizing, adaptive broadcast domains to distribute signals through the cluster. 

It's name sake is given for it's architectural likeness to the
 <a href="http://en.wikipedia.org/wiki/Zooid" title="http://en.wikipedia.org/wiki/Zooid">
 organism</a>.

Zooid is not a web app. It's a research tool. And it consists architecturally of distinct components. To run all of the extensions supported by the hardware it's on: you can spin up extensions/app.js. And to run the web service: web/app.js.  Likewise, you can run any of the extensions independently. Zooid has two cooperating lobes, one for communicating with humans, the other for communicating with other zodes in the cluster to distribute the workload from their human.

Lobe 1 uses a common restful JSON API Pattern which makes it easy to customize research perspectives and analytical tools, charts, graphs, etc. Whereas lobe 2 uses a swift UDP messaging protocol for inter-process communcation and collaborative parrallelization. Lobe 1 scales vertically. And its functionality is predominantly serial. Lobe 2 scales horizontally, and the workflows are oriented towards massively parrallel operations. 

###Zodes 

- Self-orient on the network.
- Assimilate hardware-specific skills from other zodes.
- Effeciently distribute workloads.
- Intelligently optimize themselves.


###Zodes can't yet

- Accumulate action potentials.
- Prime anticipated symbols.

===

##Installation

	$ git clone git@github.com:benbaker/zooid.git
	$ npm build .
	
#Lobe 1 API



####Signals

    zooidserver/signal/create?noun=image&url=imgur.com/abc123.png
    
    {
    	id:       "aAbBcC123",
    	noun:     "image",
    	url:      "imgur.com/abc123.png",
    	createdAt:"Some date"
    }
    





<!--
####Services

    
    Service.create({ 
        listener:"image", type:"CUDA", lib:"/nouns/detectFaces" 
    });-->
    
    
    
###Vernacular

***zooid*** -- The entire network of zodes and their collective infrastructure.
***zode*** -- A single instance of the zooid platform running at a specific location.

    
    
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
