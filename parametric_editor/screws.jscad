drawScrew = function(screwDiameter) {
	var screwHeadHole = drawCylinder().transform(new CSG.Matrix4x4([0, 0, -0.12499993294477463, 0, 0, -0.12499993294477463, 0, 0, 0.12499994039535522, 0, 0, 0, 5.6959991455078125, -0.25, 1.7499992847442627, 1]))
						.scaleSize([0, screwDiameter*2, screwDiameter*2]);
						
	var screwHole = drawCylinder().transform(new CSG.Matrix4x4([0, 0, -0.07500000298023224, 0, 0, -0.07500000298023224, 0, 0, 0.5375000238418579, 0, 0, 0, -2.5540008544921875, -0.25, 1.7499980926513672, 1]))
						.scaleSize([0, screwDiameter, screwDiameter]);
	
	var screwHoleLoose = screwHole.scaleSize([0, screwDiameter+1, screwDiameter+1]); //loose hole
	
	var screwHeadHoleLong = screwHeadHole.scaleSizeAnchored([10, 0, 0], -1, 0, 0);
    var screw = screwHole.union(screwHeadHoleLong).setColorRgb(250, 250, 250);
	var screwLoose = screwHoleLoose.union(screwHeadHoleLong).setColorRgb(200, 200, 200);
	
	//We'll use the standard screwHeadHole as a placeholder to calculate the positions of the screws
	//but then we'll subtract the long head
	screwHeadHole.properties.screw = screw;
	screwHeadHole.properties.screwLoose = screwLoose;
	
	return screwHeadHole;
	
};

drawBodyPartSupport = function() {
	var cube = drawCube().setColorRgb(250, 250, 250).transform(new CSG.Matrix4x4([-0.18750937283039093, 0, 0, 0, 0, 0.3500174880027771, 0, 0, 0, 0, 0.2000100016593933, 0, 0, 0, 0, 1]));
	
	return cube;
}