drawWheel = function(diameter, holeDiameter, wheelHeight) {
	//X ->
	var wheel = drawCylinder().rotateY(90).scaleSize([wheelHeight, diameter, diameter]);
	var hole = drawCylinder().rotateY(90).scaleSize([wheelHeight+4, holeDiameter, holeDiameter]);
	wheel = wheel.alignToAdjacent(hole, 1, 0, 0);
	hole = hole.translate([-wheelHeight -1, 0 ,0]);
	
	wheel = wheel.subtract(hole);
	
	return wheel.rotateZ(90); //Y V
	
};