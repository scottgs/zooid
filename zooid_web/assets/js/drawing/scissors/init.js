if (typeof $ == 'undefined') {
   $ = function(id) {return document.getElementById(id);};
}

masker = new Masker();
image_id = "scissors_img";
scs = null;
image = null;
container = null;

function loaded() {
   if ( scs ) {
      scs.destroy();
      scs = null;
   }

   $('#container canvas').remove();
   
   setTimeout(function() {
      console.log("loading");
      image = null;
      container = null;

      image_id = "scissors_img";
      scs = null;
      image = null;
      container = null;

      image = document.getElementById(image_id);
      container = document.getElementById('container');
      startMasking();

   }, 200);
}

function setMaskingButtonsDisabled(value) {
   $('finish-mask').disabled = value;
   $('reset-mask').disabled = value;
}

function hideControls(id) {
   $(".maskTools").show();
   $(".scissorTools").hide();
}

function showControls(id) {
   $(".maskTools").hide();
   $(".scissorTools").show();
}

function startMasking() {

   $('#container canvas').remove();

   image = document.getElementById(image_id);
   container = document.getElementById('container');

   masker.setUp(container, image);
   setMaskingButtonsDisabled(false);
   showControls('masker-controls');
   hideControls('scissors-controls');
   $('output').innerHTML = 'Please draw a mask covering the desired edges.'
}

function endMasking() {
   $('output').innerHTML = 'Calculating the mask. Please wait...'
   setMaskingButtonsDisabled(true);
   $('#scissors_img').hide();
   $('#masker').hide();
   setTimeout(function() {
      mask = masker.getMask();
      
      if ( !mask ) {
         $('output').innerHTML = 'The mask is empty. Please add something to the mask.';
         setMaskingButtonsDisabled(false);
      } else {
         masker.tearDown();
         hideControls('masker-controls');
         showControls('scissors-controls');
         scs = new Scissors();
         scs.init(image, mask, false);
         // focus(mask);
      }
   }, 10);
}

function focus(mask) {
   // Put the AOI on the screen, with some margin
   
   // Try to center the AOI, but give the upper-left corner at least a 100px margin
   var marginLeft = Math.max(100, (window.innerWidth - mask.aoi[2])/2);
   var marginTop = Math.max(100, (window.innerHeight - mask.aoi[3])/2);
   
   var offset = computeOffset(container);
   var left = Math.max(mask.aoi[0] - marginLeft + offset.x, 0);
   var top = Math.max(mask.aoi[1] - marginTop + offset.y, 0);
   window.scrollTo(left, top);
}