
//Utility functions:

drawCube = function(center, size) {
	if(center == null) {
		center = [0, 0, 10]
	}
	var radius = null;
	if(size == null) {
		radius = 10;
	}
	else {
		radius = [size[0]/2, size[1]/2 ,size[2]/2];
	}
	
    return CSG.cube({
        center: center,
        radius: radius,
    });
};
drawSphere = function() {
    return CSG.sphere({
        center: [0, 0, 0],
        radius: 10,
		resolution: _resolution
    });
};
drawCylinder = function() {
    return CSG.cylinder({
        start: [0, 0, 0],
        end: [0, 0, 20],
        radius: 10,
		resolution: _resolution
    });
};
drawHexagonalPrism = function() {
    return CSG.cylinder({
        start: [0, 0, 0],
        end: [0, 0, 20],
        radius: 10,
        resolution: 6
    }).rotateZ(90);
};
drawRoof = function() {
    var cube = CSG.cube({
        corner1: [0, -7.0710678118, -7.0710678118],
        corner2: [20, 7.0710678118, 7.0710678118]
    });
    var plane1 = CSG.Plane.fromPoints([0, 0, 0], [10, 0, 0], [0, 10, 10]);
    return cube.cutByPlane(plane1).rotateX(135).rotateZ(90).translate([0, -10, 0]);
};
drawRoundRoof = function() {
    var cylinder = CSG.cylinder({
        start: [0, 0, 0],
        end: [0, 0, 20],
        radius: 10
    });
    var plane1 = CSG.Plane.fromPoints([0, 0, 0], [0, 5, 0], [0, 5, 5]);
    return cylinder.cutByPlane(plane1).rotateX(90).rotateY(90).translate([0, 10, 0]);
};
drawHalfSphere = function() {
    var sphere = CSG.sphere({
        radius: 10,
        resolution: 32
    });
    var plane1 = CSG.Plane.fromPoints([0, 0, 0], [5, 0, 0], [5, 5, 5]);
    return sphere.cutByPlane(plane1).rotateX(135).rotateZ(90);
};

getMove = function(coordsA, coordsB) {
    var translateX = distanceSigned(coordsA[0], coordsB[0]);
    var translateY = distanceSigned(coordsA[1], coordsB[1]);
    var translateZ = distanceSigned(coordsA[2], coordsB[2]);
    return [ translateX, translateY, translateZ ];
};

distanceSigned = function(start, end) {
    var dist = abs(start-end);
    if(start > end) {
        return -dist;
    }
    else {
        return dist;
    }
};

polarToCartesian = function(angle, radius, center) {
    var x = radius * cos(angle);
    var z = radius * sin(angle);
    
    return [x + center[0], center[1], z + center[2]];
}

distanceXZ = function (coordsA, coordsB) {
    return sqrt( pow(coordsA[0] - coordsB[0],2) + pow(coordsA[2] - coordsB[2],2) );
}

extendsCSG = function() {
    CSG.prototype.setColorName = function(name) {
        return this.setColorRgb(colors[name][0], colors[name][1], colors[name][2]);
    };
    CSG.prototype.setColorRgb = function(r, g, b) {
        return this.setColor(r / 255, g / 255, b / 255);
    };

    CSG.prototype.getPlaceAtMiddle = function(obj) {
        var translateX = distanceSigned(this.getMiddleCoord("x"), obj.getMiddleCoord("x"));
        var translateY = distanceSigned(this.getMiddleCoord("y"), obj.getMiddleCoord("y"));
        var translateZ = distanceSigned(this.getMiddleCoord("z"), obj.getMiddleCoord("z"));
        return [ translateX, translateY, translateZ ];
    };

	//positive versus: right, far, up
    CSG.prototype.getBoundsAt = function(x, y, z) {
        var boundStart = this.getBounds()[0];
        var boundEnd = this.getBounds()[1];

        return [this.getCoordAt("x", x), this.getCoordAt("y", y), this.getCoordAt("z", z)];
    };

    CSG.prototype.getCoordAt = function(coord, angle) {
        if(angle === 0) {
            return this.getMiddleCoord(coord);
        }
        else if(angle > 0) {
            return this.getBounds()[1][coord];
        }
        else {
            return this.getBounds()[0][coord];
        }
    };

    CSG.prototype.getMiddleCoord = function(coord) {
        var start = this.getBounds()[0][coord];
        var end = this.getBounds()[1][coord];

        return start + distanceSigned(start, end) / 2;
    };
	
	CSG.prototype.getSize = function(coord) {
		return abs(this.getBounds()[0][coord] - this.getBounds()[1][coord]);
	};
	
	//Compensate for a strange bug where also the center is scaled
	CSG.prototype.scaleFixed = function(values) {
        var x = this.getBounds()[0]["x"] + (this.getSize("x") / 2);
        var y = this.getBounds()[0]["y"] + (this.getSize("y") / 2);
        var z = this.getBounds()[0]["z"] + (this.getSize("z") / 2);
        var obj = this.translate([-x, -y, -z]);
        obj = obj.scale(values).translate([x,y,z]);
        return obj;
	}
	
	CSG.prototype.scaleSize = function(value) {
		var scaleX = 1;
		var scaleY = 1;
		var scaleZ = 1;
		if(value[0] > 0) {
			scaleX = value[0] / this.getSize("x");
		}
		if(value[1] > 0) {
			scaleY = value[1] / this.getSize("y");
		}
		if(value[2] > 0) {
			scaleZ = value[2] / this.getSize("z");
		}
	
		return this.scaleFixed([scaleX, scaleY, scaleZ]);
	};
	
	CSG.prototype.scaleSizeAnchored = function(values, x, y, z) {
		var anchorX = 0;
		var anchorY = 0;
		var anchorZ = 0;
		if(values[0] !== 0) { 
			anchorX = -x * abs(this.getSize("x") - values[0]) /2;
		}
		if(values[1] !== 0) { 
			anchorY = -y * abs(this.getSize("y") - values[1]) /2;
		}
		if(values[2] !== 0) { 
			anchorZ = -z * abs(this.getSize("z") - values[2]) /2;
		}
		return this.translate([anchorX,anchorY,anchorZ]).scaleSize(values);
	};
	
	CSG.prototype.getAlignTo = function(obj, x, y, z) {
		return getMove(this.getBoundsAt(x, y, z), obj.getBoundsAt(x, y, z));
	}
	CSG.prototype.alignTo = function(obj, x, y, z) {
		return this.translate(this.getAlignTo(obj, x, y, z));
	}
	
	CSG.prototype.getAlignToAdjacent = function(obj, x, y, z) {
		return getMove(this.getBoundsAt(x, y, z), obj.getBoundsAt(-x, -y, -z));
	}
	CSG.prototype.alignToAdjacent = function(obj, x, y, z) {
		return this.translate(this.getAlignToAdjacent(obj, x, y, z));
	}
	
	CSG.prototype.scaleLength3 = function(length, cutStart, cutEnd) {
		var dLength = length - this.getSize("x");
		var center = this.intersect(drawCube([ cutStart + abs(cutStart-cutEnd)/2, 0, 0], [abs(cutStart-cutEnd), 50, 50]));
		var front = this.intersect(drawCube([-40, 0, 0], [abs(-40-cutStart)*2, 50, 50]));
		var rear = this.intersect(drawCube([40, 0, 0], [abs(40-cutEnd)*2, 50, 50]));
		
		center = center.scaleSize([center.getSize("x")+dLength, 0, 0])
				//.union(drawCube([ cutStart + abs(cutStart-cutEnd)/2, 0, 0], [abs(cutStart-cutEnd), 50, 50])) //<- Debug cuts
				;
		front = front.translate([getMove(front.getBoundsAt(1, 0, 0), center.getBoundsAt(-1, 0, 0))[0], 0 ,0]);
		rear = rear.translate([getMove(rear.getBoundsAt(-1, 0, 0), center.getBoundsAt(1, 0, 0))[0], 0 ,0]);
		return center.union(front).union(rear);
	}
	
	CSG.prototype.deform3 = function(addFront, addCenter, addRear, cutStart, cutEnd) {
		var length = this.getSize("x");
		var center = this.intersect(drawCube([ cutStart + abs(cutStart-cutEnd)/2, 0, 0], [abs(cutStart-cutEnd), 50, 50]));
		var front = this.intersect(drawCube([-40, 0, 0], [abs(-40-cutStart)*2, 50, 50]));
		var rear = this.intersect(drawCube([40, 0, 0], [abs(40-cutEnd)*2, 50, 50]));

		center = center.scaleSize([center.getSize("x")+addCenter, 0, 0])
				//.union(drawCube([ cutStart + abs(cutStart-cutEnd)/2, 0, 0], [abs(cutStart-cutEnd), 50, 50])) //<- Debug cuts
				;
		front = front.scaleSize([front.getSize("x")+addFront, 0, 0]);
		rear = rear.scaleSize([rear.getSize("x")+addRear, 0, 0]);
		
		front = front.translate([getMove(front.getBoundsAt(1, 0, 0), center.getBoundsAt(-1, 0, 0))[0], 0 ,0]);
		rear = rear.translate([getMove(rear.getBoundsAt(-1, 0, 0), center.getBoundsAt(1, 0, 0))[0], 0 ,0]);
		return center.union(front).union(rear);
	}
};

var colors = {
    "red": ["233", "29", "45"],
    "lightOrange": ["251", "197", "154"],
    "orange": ["245", "131", "31"],
    "darkOrange": ["227", "91", "34"],
    "lightGreen": ["200", "228", "189"],
    "green": ["70", "183", "73"],
    "darkGreen": ["18", "105", "54"],
    "blu": ["59", "85", "163"],
    "white": ["255", "255", "255"],
    "gray": ["97", "103", "106"],
	
	"black": ["0", "0", "0"]
};