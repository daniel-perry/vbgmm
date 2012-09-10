// modified from originl code here: https://code.google.com/p/hdict/source/browse/gae/files/kthis.means.js

function Kmeans () {

this.width = 400.0;
this.height = 500.0;

this.POINT_COUNT = 500;
//this.COLORS = new Array("rgb(255,0,0)", "rgb(255,69,0)", "rgb(255,255,0)", "rgb(0,255,0)", "rgb(0,0,255)", "rgb(255,0,255)");
this.COLORS = new Array("rgba(255,0,0,0.5)", "rgba(0,0,255,0.5)");
this.MAX_LOOP_COUNT = 10;

this.points = new Array();
this.means = new Array();
this.distancess = {}; 

this.canvasId = 'body';
this.canvasId2 = 'body';
this.scale = new Array();

this.converged = false; // only for step()
this.loopCount = 0; // only for step()
this.cost = [];

}

Kmeans.prototype.computeDistance = function(a, b) {
    //return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
}

Kmeans.prototype.cluster = function() {
    var converged = false;
    var dirty = false;
    var distances = 0.0;
    var curMinDistance = 0;
    var sumX = new Array();
    var sumY = new Array();
    var clusterSizes = new Array();
    var cluster = new Array();
    var loopCount = 0;

    while (!converged) {
        dirty = false;
        for (var i = 0; i < this.points.length; i = i + 1) {
            point = this.points[i];
            curMinDistance = this.distancess[this.hash(point)];
            for (var j = 0; j < this.means.length; j = j + 1) {
                mean = this.means[j];
                distances = this.computeDistance(point, mean);
                if (distances < curMinDistance) {
                    dirty = true;
                    curMinDistance = distances;
                    point.cluster = j;
                }
            }
        }
        if (!dirty) {
            converged = true;
            break;
        }
        for (var i = 0; i < this.means.length; i = i + 1) {
            sumX[i] = 0;
            sumY[i] = 0;
            clusterSizes[i] = 0;
        }
        for (var i = 0; i < this.points.length; i = i + 1) {
            sumX[this.points[i].cluster] = sumX[this.points[i].cluster] + this.points[i].x;
            sumY[this.points[i].cluster] = sumY[this.points[i].cluster] + this.points[i].y;
            clusterSizes[this.points[i].cluster] = clusterSizes[this.points[i].cluster] + 1;
        }
        for (var i = 0; i < this.means.length; i = i + 1) {
            if (clusterSizes[i] != 0) {
                this.means[i].x = sumX[i] / clusterSizes[i];
                this.means[i].y = sumY[i] / clusterSizes[i];
            } else {
                this.means[i].x = Math.floor(Math.random() * this.width);
                this.means[i].y = Math.floor(Math.random() * this.height);
            }
        }
        loopCount = loopCount + 1;
        if (loopCount > this.MAX_LOOP_COUNT) {
            converged = true;
        }
    }
		console.log('loopCount: ' + loopCount);
}

Kmeans.prototype.hash = function(booga) {
    if (booga == undefined) return undefined;
    return "point" + booga.x + "_" + booga.y;
}

Kmeans.prototype.reset = function() {
		this.cost = [];
		this.converged = false;
		this.loopCount = 0;
    this.means = new Array();
    this.points = new Array();
    this.distancess = {};
    clusterContents = new Array();
    for (var i = 0; i < this.COLORS.length; i = i + 1) {
        mean = {};
        mean.x = Math.floor(Math.random() * this.width);
        mean.y = Math.floor(Math.random() * this.height);
        this.means[i] = mean;
        clusterContents[i] = new Array();
    }
		// "standardize" old faithful data set
		/*
		var avgs = _.reduce(faithful, function(sum,pt){ sum[0] += pt[0]; sum[1] += pt[1]; return sum; }, [0,0] );
		avgs[0] /= faithful.length;
		avgs[1] /= faithful.length;
		var stdevs = _.reduce(faithful, function(sum,pt){ sum[0] += (pt[0]-avgs[0])*(pt[0]-avgs[0]); sum[1] += (pt[1]-avgs[1])*(pt[1]-avgs[1]); return sum; }, [0,0] );
		stdevs[0] = Math.sqrt( stdevs[0]/(faithful.length-1) );
		stdevs[1] = Math.sqrt( stdevs[1]/(faithful.length-1) );
		_.each( faithful, function(n){  n[0] = (n[0]-avgs[0])/stdevs[0]; n[1] = (n[1]-avgs[1])/stdevs[1]; } );
    */


		this.POINT_COUNT = faithful.length;
		max = [0,0];
		min = [10000,10000];
    for (var i = 0; i < this.POINT_COUNT; i = i + 1) {
        point = {};
        point.x = faithful[i][0]; 
        point.y = faithful[i][1]; 
        //point.x = Math.floor(Math.random() * this.width);
        //point.y = Math.floor(Math.random() * this.height);
				max = [ _.max([point.x,max[0]]), _.max([point.y,max[1]]) ];
				min = [ _.min([point.x,min[0]]), _.min([point.y,min[1]]) ];
        this.points[i] = point;
        this.distancess[this.hash(point)] = 999999999999999999;
    }
		var width = this.width;
		var height = this.height;
		this.scale = [function(x){ return (x-min[0])/max[0]*width; }, function(y){ return (y-min[1])/max[1]*height; }];

		// specific settings for 2 clusters:
		var mean = {};
    mean.x = min[0]+0.15*max[0]; mean.y = min[1]+0.75*max[1];
		this.means[0] = mean;
		mean = {};
    mean.x = min[0]+0.75*max[0]; mean.y = min[1]+0.15*max[1];
		this.means[1] = mean;
}

Kmeans.prototype.step = function() {
		if(this.converged) return;

    var dirty = false;
    var distances = 0.0;
    var curMinDistance = 0;
    var sumX = new Array();
    var sumY = new Array();
    var clusterSizes = new Array();
    var cluster = new Array();
    

		var cost = 0;
        for (var i = 0; i < this.points.length; i = i + 1) {
            point = this.points[i];
            curMinDistance = this.distancess[this.hash(point)];
            for (var j = 0; j < this.means.length; j = j + 1) {
                mean = this.means[j];
                distances = this.computeDistance(point, mean);
                if (distances < curMinDistance) {
                    dirty = true;
                    curMinDistance = distances;
                    point.cluster = j;
                }
            }
						var ptCost = this.computeDistance(point,this.means[point.cluster]);
						cost += ptCost*ptCost;
        }
				this.cost.push(cost);
        if (!dirty) {
            this.converged = true;
 						return;
        }
        for (var i = 0; i < this.means.length; i = i + 1) {
            sumX[i] = 0;
            sumY[i] = 0;
            clusterSizes[i] = 0;
        }
        for (var i = 0; i < this.points.length; i = i + 1) {
            sumX[this.points[i].cluster] = sumX[this.points[i].cluster] + this.points[i].x;
            sumY[this.points[i].cluster] = sumY[this.points[i].cluster] + this.points[i].y;
            clusterSizes[this.points[i].cluster] = clusterSizes[this.points[i].cluster] + 1;
        }
        for (var i = 0; i < this.means.length; i = i + 1) {
            if (clusterSizes[i] != 0) {
                this.means[i].x = sumX[i] / clusterSizes[i];
                this.means[i].y = sumY[i] / clusterSizes[i];
            } else {
                this.means[i].x = Math.floor(Math.random() * this.width);
                this.means[i].y = Math.floor(Math.random() * this.height);
            }
        }
        this.loopCount += 1;
        if (this.loopCount > this.MAX_LOOP_COUNT) {
            this.converged = true;
        }

}

Kmeans.prototype.draw = function() {
    //this.reset();
    //var clusterStart = (new Date()).getTime();
    //this.cluster();
    //var clusterDuration = (new Date()).getTime() - clusterStart;

    var canvas = document.getElementById(this.canvasId);
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    
    var mean;
    var curPoints;
    var point;
    var numCurPoints = 0;
    var i = 0;
    var j = 0;
    var start = (new Date()).getTime();
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, this.width, this.height);
		var radius=5;
    for (j = 0; j < this.points.length; j = j + 1) {
        point = this.points[j];
        ctx.fillStyle = this.COLORS[point.cluster];
        ctx.fillRect(this.scale[0](point.x)-radius, this.scale[1](point.y)-radius, 1+2*radius, 1+2*radius);
        //ctx.fillRect(point.x, point.y, 1, 1);
    }

		this.plot();
}

Kmeans.prototype.plot = function() {
		
		var numBars = 13.0;
		var pad = [45.0,30.0];

    var canvas = document.getElementById(this.canvasId2);
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillRect(0,0,this.width+15,this.height+15);

    if( this.cost.length < 1 ) return;

    ctx.fillStyle = 'rgb(0,0,0)';

		var max = _.max(this.cost);
 		var pixpercost = this.height/max;
		var pixperitem = this.width/this.MAX_LOOP_COUNT;
		var pixperbars = [ this.width/numBars, this.height/numBars ];
		
		var notchWidth = 10;
		// y-axis notches
		ctx.beginPath();
		for(var i=0; i<numBars; i+=1) {
			y = this.height - pad[1] - i*pixperbars[1];
			x = 0 + pad[0];
			ctx.moveTo(x,y-3);
			ctx.lineTo(x+notchWidth,y-3);
			var value = i*pixperbars[1]/pixpercost;
			if( i%2 == 0 ){
			  ctx.fillText(""+value.toFixed(1), 0,y );
      }
		}
		ctx.stroke();

		// x-axis notches
		ctx.beginPath();
		for(var i=0; i<numBars; i+=1) {
			x = 0 + pad[0] + i*pixperbars[0];
			ctx.moveTo(x,this.height-pad[1]);
			ctx.lineTo(x,this.height-notchWidth-pad[1]);
			if( i%2 == 0 ){
			  ctx.fillText(""+i, x,this.height-pad[1]/2 );
			}
		}
		ctx.stroke();
		
		var drawWidth = this.width-pad[0]-notchWidth;
		var drawHeight = this.height-pad[1]-notchWidth;

		// line plot
		var radius = 2;
		ctx.lineWidth = 2;
		ctx.beginPath();
		for(var i=0; i<this.cost.length; i+=1){
			//var x = (0+pad[0]+notchWidth+(i+1)*pixperitem);
			var x = (this.width-drawWidth+5) + (i/this.MAX_LOOP_COUNT)*drawWidth;
			//var y = (drawHeight-(this.cost[i]*pixpercost));
			var y = drawHeight - drawHeight*(this.cost[i]/max);
      ctx.fillRect(x-radius, y-radius, 1+2*radius, 1+2*radius);
			if( i==0) ctx.moveTo(x,y);
			ctx.lineTo(x,y);
    }
    ctx.stroke();

}

