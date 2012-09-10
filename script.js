////////////////////////////////////
// The MIT License
//
// Copyright (c) 2012 Daniel Perry.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
////////////////////////////////////////


////////////////////////////////
// Navigation:
var current_slide = 0;
var slides = ['title','kmeans','gmm','em','vb','references'];

function nextslide() {
	if( (current_slide+1) != slides.length ) {
		current_slide += 1;
	  var div = document.getElementById(slides[current_slide]);
  	div.scrollIntoView(true);
	}
}
function prevslide() {
	if( (current_slide-1) >= 0 ) {
		current_slide -= 1;
	  var anchor = document.getElementById(slides[current_slide]);
  	anchor.scrollIntoView(true);
	}
}

document.onkeydown=function(e) {
	var e=window.event || e;
	//console.log( e.keyCode );
	switch(e.keyCode) {
		case 106: // j
		case 39:  // right arrow
		//case 40:  // down arrow
		  nextslide();
		  break;
		case 107: // k
		case 37:  // left arrow
		//case 38:  // up arrow
		  prevslide();
  		break;
	}
}

///////////////////////////////////
// Examples:

// kmeans example:
function runKmeans(finish) {
	if(kmeans.converged) return;
	if(kmeans.loopCount == 0) {
    kmeans.reset(); // loads data, etc. 
  }
	if(finish){
		while(!kmeans.converged){
  	  kmeans.step();
    	kmeans.draw(); 
    }
  } else {
	  kmeans.step();
  	kmeans.draw(); 
	}
}

function restartKmeans() {
	kmeans.reset();
	kmeans.step();
	kmeans.draw();
}

function draw() {
	var canvas = document.getElementById('graph');
	if(canvas.getContext){
		var ctx = canvas.getContext('2d');

		ctx.fillStyle = "rgb(200,0,0)";
		ctx.fillRect(10,10,55,50);
		
		ctx.fillStyle = "rgba(0,0,200,0.5)";
		ctx.fillRect(30,30,55,50);
	} else {
		canvas.innerHTML( 'browser not supported' );
	}
}


