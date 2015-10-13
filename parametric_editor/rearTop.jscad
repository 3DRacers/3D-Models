rearTopMesh = function() {
    return (
            drawCarTop().translate([0, 0, 7]).setColorName('white').transform(new CSG.Matrix4x4([0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, -9.5367431640625e-7, 0.01950359344482422, -3.6099987030029297, 1]))		
			.subtract(drawCube().transform(new CSG.Matrix4x4([0, 1.600079894065857, 0, 0, -1, 0, 0, 0, 0, 0, 0.8500422835350037, 0, 22.500499725341797, 0.019500017166137695, -17.001996994018555, 1])).translate([0, 0, 0.5])  ) //Remove a curve on the bottom (since we read the pivot)
		)
};

rearTopPivot = function(topZ) {
    var round = drawCylinder().setColorName('orange').transform(new CSG.Matrix4x4([0, 0, -0.3499999940395355, 0, -0.2874999940395355, 0, 0, 0, 0, 0.2874999940395355, 0, 0, 20.625, -13.730499267578125, -0.7520008087158203, 1]))
    
	//TODO: temporary fix for temp board, enlarge the round (more hard to break):
	round = round.scaleSizeAnchored([0,round.getSize("y")*3, 0], 0, -1, 0);
	
    return round;
};

drawRearTopPivot = function(pivotCenter, rearTop) {
	//Align the pivot to the pivot of the gear:
	var topZ = rearTop.getBoundsAt(0, 0, -1)[2];
	var rearPivot = rearTopPivot(topZ);
	var rearPivotMove = getMove(rearPivot.getBoundsAt(0, 0, 0), pivotCenter);
	rearPivot = rearPivot.translate([ rearPivotMove[0], 0, rearPivotMove[2] ]);

	var joinerWithTopHeight = topZ - rearPivot.getBoundsAt(0, 0, 0)[2] + 0.5; //A bit higher to be sure to intersect the top

	var joinerWithTop = drawCube([0,0,0], [rearPivot.getSize("x"), rearPivot.getSize("y"), joinerWithTopHeight]).alignTo(rearPivot, 0,0,0);
	joinerWithTop = joinerWithTop.translate([0,0, joinerWithTop.getSize("z")/2 + 0.5]);
	rearPivot = rearPivot.union(joinerWithTop);
		
	//The hole for the pivot to rotate
	var pivotSpace = drawCube().transform(new CSG.Matrix4x4([0, 0.3375169038772583, 0, 0, -0.33746689558029175, 0, 0, 0, 0, 0, 0.25001251697540283, 0, 20.875499725341797, -10.855500221252441, -5.00200080871582, 1])).translate([1.6, 0, 1])
		.scaleSizeAnchored([20 /* <- to be sure to pierce the bottom */, rearPivot.getSize("y")+0.7, rearPivot.getSize("z")+2.5], -1, -1, 0)
		
	
	pivotSpace = pivotSpace.alignTo(rearPivot, -1, 0, -1).translate([-1.5,0,-1]);	//A little margin on the front
	
	//Align the gear hole to the gear:
	var rearTopGearHole = drawCube().transform(new CSG.Matrix4x4([0, 0.26246315240859985, 0, 0, -0.7999899983406067, 0, 0, 0, 0, 0, 0.38751935958862305, 0, 22.000499725341797, 11.894999504089355, -2, 1]))
									.scaleSizeAnchored([0,3.5,25], 0, -1, 0) //A little scale up
	var rearTopGearHoleMove = getMove(rearTopGearHole.getBoundsAt(0, 0, 0), pivotCenter);
	rearTopGearHole = rearTopGearHole.translate([rearTopGearHoleMove[0], rearTopGearHole.getAlignTo(rearTop, 0, 1, 0)[1], 0]); //Align the hole to the right border of the top element
	
	rearPivot.properties.rearTopPivotSpace = pivotSpace;
	rearPivot.properties.rearTopGearHole = rearTopGearHole;
	
	rearPivot = rearPivot.setColorName("red");
	
	return rearPivot;
}

drawRearTop = function(width, carLength) {
	//Scale-3 the part:
	var dLength = carLength - 49; //49: Default length of the car;	
	var mesh = rearTopMesh();
	
	//mesh = mesh.scaleLength3(mesh.getSize("x")+dLength, carTopCutStart, carTopCutEnd).translate([-1 * (dLength / 2),0,0]);
	
	//Deform:
	var prevSize = mesh.getSize("x");
	mesh = mesh.deform3(0, 2, -2, carTopCutStart, carTopCutEnd); //Deform, was 0, 1, -1, and change hoodTopOverlapX=5.5
	
	var rearTop = mesh.scaleSizeAnchored([prevSize, width, 0], -1, -1, 0).setColorName("red");
	
	return rearTop;
};
