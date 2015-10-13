// front.jscad
drawServo = function() {
	var servoSupports = drawCube().setColorName('red')
		.transform(new CSG.Matrix4x4([-1.4695101810020952e-16, 0.39999526739120483, 1.836894840005887e-17, 0, -0.19998501241207123, -7.347087683867446e-17, 9.183894346420035e-18, 0, 9.185006904343919e-18, -9.185006904343919e-18, 0.012500672601163387, 0, -9.750215530395508, -0.000476837158203125, 8.24985122680664, 1]))
        .union(drawCube().setColorName('red').transform(new CSG.Matrix4x4([-1.4695101810020952e-16, 0.39999526739120483, 1.836894840005887e-17, 0, -0.19998501241207123, -7.347087683867446e-17, 9.183894346420035e-18, 0, 9.185006904343919e-18, -9.185006904343919e-18, 0.012500672601163387, 0, 9.749784469604492, 0.000019073486328125, 8.24985122680664, 1]))
		);
	
	var servoBox = drawCube().setColorRgb(43, 46, 49).transform(new CSG.Matrix4x4([1.3777509694771388e-16, -1.847206804394218e-16, 0.7500374913215637, 0, 0.800040066242218, 1.9594683160585667e-16, -1.469601237043925e-16, 0, -9.797340918548343e-17, 0.4000200033187866, 9.74409497164606e-17, 0, 0.00003814697265625, -4.0001678466796875, 12.49985122680664, 1]));
	
	var servoHole = servoBox.scale(1.1);
	
    var servo = ((
        drawCylinder().setColorRgb(250, 250, 250).transform(new CSG.Matrix4x4([-0.25, -6.123031769111886e-17, 2.1430608544913642e-17, 0, -6.123031769111886e-17, 0.25, 1.5307579422779716e-17, 0, -1.224606403453214e-17, 1.836909398384668e-17, -0.30000001192092896, 0, 3.4999160766601562, -0.0001678466796875, 5.999855041503906, 1]))
        .union(servoBox)
        .union(drawCube().setColorRgb(250, 250, 250).transform(new CSG.Matrix4x4([-1.3739257389088364e-17, -9.185006077163306e-18, 0.05000249668955803, 0, -8.956240179775028e-18, 0.15001998841762543, 2.755731531205098e-17, 0, -0.5125194787979126, 5.970331581056637e-17, -9.567527645068451e-17, 0, 5.749916076660156, -0.0001678466796875, 0.49985504150390625, 1])))
        )
		.union(servoSupports)
    );
	
	servo.properties.servoSupports = servoSupports;
	servo.properties.servoHoleTop = servoHole;
	return servo;
};

frontBase = function(width, length, steeringOffset, steeringOutside) {
	var base = drawCube().setColorName('red').transform(new CSG.Matrix4x4([0, -1.5250762701034546, 0, 0, 2.450122117996216, 0, 0, 0, 0, 0, 0.07500370591878891, 0, 0.0000019073486328125, 0, -0.000002384185791015625, 1]));

    var holeSx = drawCylinder().transform(new CSG.Matrix4x4([2.121451919041274e-17, 0.17323540151119232, 2.5320542835091237e-17, 0, -0.17323540151119232, 2.121451588169029e-17, 0, 0, 5.968246733959796e-33, 4.87360390886361e-17, -0.4750000238418579, 0, -5.049995422363281, -7.700006484985352, 3.499997615814209, 1]));

	var holeSxMargin = distanceSigned(holeSx.getCoordAt("y", -1), base.getCoordAt("y", -1));
	holeSxMargin = holeSxMargin + steeringOutside;
	
	var base = base.scaleSizeAnchored([length, width, 0], -1, 0, 0);
	
	var moveY = distanceSigned(holeSx.getCoordAt("y", -1), base.getCoordAt("y", -1) - holeSxMargin);
	if(steeringOffset > 0) {
		var moveX = distanceSigned(holeSx.getCoordAt("x", -1), base.getCoordAt("x", -1) + steeringOffset);
	}
	
	
	holeSx = holeSx.translate([moveX, moveY, 0]);
	
    var front = ((
            base
         )
        .subtract(holeSx)
		
        ).setColorName('red');

    front.properties.frontHoleFront = drawCylinder().transform(new CSG.Matrix4x4([-0.1499999612569809, 4.59227746642861e-17, 1.1327609004467561e-17, 0, 4.5922728342171797e-17, 0.15000012516975403, 1.1327609004467561e-17, 0, 2.1099627112051574e-17, -2.1099650273108725e-17, 0.4249999225139618, 0, -22, -0.09999847412109375, 5.999999523162842, 1])).translate([-4.5, 0, 0]);
    
    front.properties.frontHoleSx = holeSx;
	
	//Wheels profile:
	var wheelsSpace = drawCube().transform(new CSG.Matrix4x4([0, -0.6500074863433838, 0, 0, 1, 0, 0, 0, 0, 0, 0.8000400066375732, 0, -8.500499725341797, -16.24974822998047, -13.999994277954102, 1]))
					//Front space:
					.union(drawCube().transform(new CSG.Matrix4x4([0.22231565415859222, -0.6108072400093079, 0, 0, 0.9396926164627075, 0.3420201539993286, 0, 0, 0, 0, 0.22001072764396667, 0, -17.499500274658203, -13.249746322631836, -0.19999751448631287, 1]))
							.translate([0, -1, 0]) //Adjust wheel space
					)
					//Rear space:
					.union(drawCube().transform(new CSG.Matrix4x4([-0.5051507353782654, -0.4090629816055298, 0, 0, 0.7866678237915039, -0.971453845500946, 0, 0, 0, 0, 0.765038251876831, 0, 5.7138824462890625, -19.750255584716797, -0.30000361800193787, 1]))
							.scaleSizeAnchored([0,0,10], 0, 0, 1) //<- fix height
							.translate([2, 1, 0]) //Adjust wheel space
					)
	
	wheelsSpace = wheelsSpace.translate([moveX, moveY, 0]);
	front.properties.frontWheelsSpace = wheelsSpace;

    return front;
};

drawServoHolder = function(servoHolderHeight, servoDentEmbed) {
	var servoHoleBottom = drawCube().transform(new CSG.Matrix4x4([0, -0.45002248883247375, 0, 0, 1.0500025749206543, 0, 0, 0, 0, 0, 0.6750337481498718, 0, -9.499500274658203, 0.000499725341796875, 0.4999966621398926, 1]));
	servoHoleBottom = servoHoleBottom.scaleSizeAnchored([0, 0, 40], 0, 0, -1);
	
	var servoHolderMain = drawCube([1.25, 0,7 ], [ 6.5, 11, 11]).scaleSizeAnchored([0, 0, servoHolderHeight], 0, 0, -1).setColorName("red");
	
	var servoDent = CSG.cube({radius: [7/2,9/2, servoDentEmbed/2]}).alignTo(servoHolderMain, 1,0,1);
	
	var servoScrew = drawCylinder().transform(new CSG.Matrix4x4([-4.592273909551976e-18, 0.07500000298023224, 0, 0, -0.07500000298023224, -4.592273909551976e-18, 0, 0, 0, 0, 0.4687500298023224, 0, 2.5, 0, 6.624996185302734, 1]));
	
    var servoHolder = (
            servoHolderMain
        )
        .subtract(servoHoleBottom
			.union(servoDent)
            .union(servoScrew))
		.setColorName('red');
			
	var servo = drawServo();
	var servoMove = getMove(servo.getBoundsAt(1, 0, -1), servoHolder.getBoundsAt(1, 0, -1));
	var servoMoveZ = getMove(servo.properties.servoSupports.getBoundsAt(0, 0, -1), servoHolder.getBoundsAt(0, 0, 1));
	servo = servo.translate([servoMove[0], servoMove[1], servoMoveZ[2]-servoDentEmbed]);
	
	servoHolder.properties.servoHoleBottom = servoHoleBottom;
	servoHolder.properties.servo = servo;
	servoHolder.properties.servoHoleTop = servo.properties.servoHoleTop;
	servoHolder.properties.servoScrew = servoScrew.scaleSizeAnchored([0,0, 20], 0,0,-1);
	return servoHolder;
};

drawFrontBottom = function(width, length, steeringOffset, steeringOutside) {
	var base = frontBase(width, length, steeringOffset, steeringOutside);
	
    return (base
        .subtract(base.properties.frontWheelsSpace)
		).setColorName('red');
};
