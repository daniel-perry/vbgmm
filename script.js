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
// Graphs:
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


