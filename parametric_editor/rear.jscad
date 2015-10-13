//NB: we are rotated here!! 90° Z. ie: X is Y and viceversa

rearBase = function(width) {

	var base = drawCube().setColorName('red').transform(new CSG.Matrix4x4([-1.1250561475753784, 0, 0, 0, 0, -0.8750436902046204, 0, 0, 0, 0, 0.07500375062227249, 0, 1.9997711181640625, 3.4999637603759766, -0.00014591217041015625, 1]));
	
	var widthVariationFromDefault = width - 30.50;
	
	//TODO: base = base.scaleSize( [0, width, 0 ]);

	var gearSpace = drawCube().transform(new CSG.Matrix4x4([-0.21246065199375153, 0, 0, 0, 0, -0.7375372052192688, 0, 0, 0, 0, 0.1375068724155426, 0, 12.62527084350586, -0.37503623962402344, -0.00014591217041015625, 1]));
	
	//TODO: gearSpace = gearSpace.translate([widthVariationFromDefault/2, 0, 0]);
					
    return base
		   .subtract(gearSpace)
		   .setColorName('red');
};

//Used only for position (then used the leftBearing for symmetry)
rightBearingHole = function() {
    return ((
        drawRoundRoof().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-9.184547819103952e-18, 0.30000001192092896, 0, 0, -0.15000000596046448, -1.8369095638207904e-17, 0, 0, 0, 0, -0.30000001192092896, 0, 7.0140228271484375, -1.2387847900390625, 4.497690200805664, 1]))
        .union(drawCube().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-0.15003249049186707, 0, 0, 0, 0, -0.30004018545150757, 0, 0, 0, 0, -0.6500325202941895, 0, 7.0140228271484375, -1.2387847900390625, 17.249858856201172, 1])))
    )).setColorRgb(117, 206, 219);
};

leftBearingHole = function() {
    return ((
        drawRoundRoof().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-9.184547819103952e-18, 0.30000001192092896, 0, 0, -0.15000000596046448, -1.8369095638207904e-17, 0, 0, 0, 0, -0.30000001192092896, 0, -5.485979080200195, -1.2387847900390625, 4.74769401550293, 1]))
        .union(drawCube().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-0.15003249049186707, 0, 0, 0, 0, -0.30004018545150757, 0, 0, 0, 0, -0.6500325202941895, 0, -5.485979080200195, -1.2387847900390625, 17.499858856201172, 1])))
    )).setColorRgb(117, 206, 219);
};

rearAxleSpace = function() {
    return ((
        drawRoundRoof().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-8.56512767946403e-17, 0.1953488141298294, 0, 0, -1.398837685585022, -1.1961269885533195e-17, 0, 0, 0, 0, -0.1953488141298294, 0, 2.5277180671691895, -1.238700270652771, 4.201934337615967, 1]))
        .union(drawCube().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-1.3991405963897705, 0, 0, 0, 0, -0.19537495076656342, 0, 0, 0, 0, -0.26047810912132263, 0, 2.5277180671691895, -1.238700270652771, 9.249852180480957, 1])))
    )).setColorRgb(117, 206, 219);
};

rearShaft = function(rearHeight, rearWheelsPaddingX, rearBearingsInsetZ) {

	var leftBearing = drawCube().setColorName('red').transform(new CSG.Matrix4x4([-0.3500175178050995, 0, 0, 0, 0, -0.4000200033187866, 0, 0, 0, 0, 0.4358789324760437, 0, -5.486228942871094, -1.2390365600585938, -0.00014495849609375, 1]))
		.scaleSizeAnchored([0, 0, rearHeight], 0 , 0, 1);

	var rightBearing = drawCube().setColorName('red').transform(new CSG.Matrix4x4([-0.3500175178050995, 0, 0, 0, 0, -0.4000200033187866, 0, 0, 0, 0, 0.4000200033187866, 0, 7.013771057128906, -1.2390365600585938, -0.000148773193359375, 1])).scaleSizeAnchored([0, 0, rearHeight], 0 , 0, 1); //<-Used only for position
	var rightBearingMove = leftBearing.getAlignTo(rightBearing, [0, 0, -1]);
	rightBearing = leftBearing.translate([rightBearingMove[0] - 0.5  /* safe margin */, rightBearingMove[1], 0]);

	var rearHolder = drawCube().setColorName('red').transform(new CSG.Matrix4x4([-0.9600479602813721, 0, 0, 0, 0, -0.4505707919597626, 0, 0, 0, 0, 0.4358789324760437, 0, 0.6499991416931152, -7.744518280029297, -0.00014495849609375, 1]))
	rearHolder = rearHolder.scaleSizeAnchored([0, rearHolder.getSize("y") + rearWheelsPaddingX, rearHeight], 0 ,0 ,1)
		.translate([0, -rearWheelsPaddingX, 0]);
	
	var leftBearingHoleObj = leftBearingHole();
	
	var axle = cylinder({r: 1, h: 40, center:true}).rotateX(90).rotateZ(90).alignTo(leftBearingHoleObj, 0, 0, -1).setColorRgb(200, 200, 200)
				.translate([0,0,2]); // Bearing radius - axle radius
		
	var hole = leftBearingHole().alignTo(rightBearingHole(), [0, 0, -1]) //Carve also the rearHolder, Use only left for symmetry
            .union(leftBearingHole()) //Carve also the rearHolder
            .union(rearAxleSpace()) //The hole where the axle of the rear wheels will go 
			;
	hole = hole.translate([0, 0, -rearBearingsInsetZ]) //Lower all the bearings
    var back = ((
            drawCylinder().setColorRgb(43, 46, 49).transform(new CSG.Matrix4x4([-5.155084098605582e-34, -0.30000001192092896, -1.8369095638207904e-17, 0, 8.419169178837211e-18, -1.8369095638207904e-17, 0.30000001192092896, 0, -0.13750000298023224, 0, 1.8369095638207904e-17, 0, -4.236228942871094, -1.2390365600585938, 4.749855041503906, 1]))
            .union(rightBearing)
            .union(leftBearing)
            .union(rearHolder)
        )
        .subtract(
			hole
			)).setColorRgb(43, 46, 49);
				
	back.properties.axle = axle;
	back.properties.leftBearing = leftBearing;
	back.properties.rightBearing = rightBearing;
	back.properties.backAxleHole = hole;
	
	back = back.translate([0, rearWheelsPaddingX, 0]);
	return back;
};


rearGear2 = function() {
    return ((
            drawCylinder().setColorRgb(250, 250, 250).transform(new CSG.Matrix4x4([1.3776821480501744e-16, 0, 0.75, 0, 0, -0.75, 0, 0, 0.046875, 0, -8.61051342531359e-18, 0, -2.984720230102539, 0.0000400543212890625, 7.499852180480957, 1]))
        )
        .subtract(drawCylinder().transform(new CSG.Matrix4x4([9.184547819103952e-18, 0, 0.05000000074505806, 0, 0, -0.05000000074505806, 0, 0, 0.26250001788139343, 0, -4.8218879152223045e-17, 0, -2.9847278594970703, 0.0000400543212890625, 7.499852180480957, 1])))).setColorRgb(250, 250, 250);
};

drawRearGear = function() {
    return ((
        drawCylinder().setColorRgb(250, 250, 250).transform(new CSG.Matrix4x4([5.2045770699195524e-17, 0, 0.30000001192092896, 0, 0, -0.30000001192092896, 0, 0, 0.25, 0, -4.898425282940611e-17, 0, -2.015726089477539, 0.0000400543212890625, 7.499852180480957, 1]))
        .union(rearGear2().translate([0.5, 0, 0]))
    )).setColorRgb(250, 250, 250);
};


rearStruct = function(width, rearHeight, rearWheelsPaddingX, rearBearingsInsetZ) {
	var shaft = rearShaft(rearHeight, rearWheelsPaddingX, rearBearingsInsetZ).translate([0, 3, 0]);/*<- fix to reallign to center the rear wheels, don't change */
    return ((
            rearBase(width)
            .union(shaft)
        )
        .subtract(
			shaft.properties.backAxleHole
			
			//Cut the rear to a 45° angle
			.union(drawCube().transform(new CSG.Matrix4x4([-1.125056266784668, 0, 0, 0, 0, -0.7071067690849304, 0.7071067690849304, 0, 0, 0.7071067690849304, 0.7071067690849304, 0, 1.2637710571289062, -21.809249877929688, -9.962286949157715, 1])).translate([0, -4 ,0]))
		)
	).setColorName('red');
};

//WARNING: THIS FUNCTION IS ROTATE Z 90°
drawRearBottom = function(width, carLength, rearBottomStructPaddingX, rearWheelsPaddingX, rearHeight, rearWheelsPaddingY, rearBearingsInsetZ) {
	width = 30.5; //TODO: not supported yet
	
	//The rear attach for the body:
	var rearGearHole = drawCylinder().transform(new CSG.Matrix4x4([-7.567465142663824e-18, 0, 0.1250000149011612, 0, 0, -0.1250000149011612, 0, 0, 1.4006885290145874, 0, 8.674295667986329e-17, 0, -9.499998092651367, -9.988960266113281, 14.999858856201172, 1]))
						.scaleSizeAnchored([34.5, 2.5, 2.5], 0, -1, 0).translate([-4, 4, 0]); //This will be changed based on the gear positions if useSamePivotHole=true
	
	
	var gearBox = drawCube().transform(new CSG.Matrix4x4([-1.1750587224960327, 0, 0, 0, 0, 0.22501125931739807, 0, 0, 0, 0, 0.45002248883247375, 0, -1.5000014305114746, -10.000001907348633, 8.716998100280762, 1]));
	gearBox = gearBox.scaleSizeAnchored([0, 6, 10], 0, -1, 1) // <- Bigger, higher
					 .translate([0, 2, 0]); //<- strange bug, the box out on the back

	
	//TODO: ricreare più alto meno profondo
	var rearSensorHole = drawCube().transform(new CSG.Matrix4x4([0.3750187158584595, 0, 0, 0, 0, 0.5750037431716919, 0, 0, 0, 0, 0.8375418186187744, 0, 1, -12.249748229980469, 2.216999053955078, 1]));
	
	var rearScrewHole = drawCylinder().transform(new CSG.Matrix4x4([-0.07000000774860382, 0, 0, 0, 0, -0.07000000774860382, 0, 0, 0, 0, 0.875, 0, 0.7137718200683594, -4.439033508300781, 3.9998531341552734, 1])).translate([0, 3, 0]); /*<- fix to reallign to center the rear wheels, don't change */
	rearScrewHole = rearScrewHole.scaleSize([2,2,0]).translate([0, -1 /* fix for new chip */, 0]);
	
    var rearAttach = ((
            gearBox
            .union(rearStruct(width, rearHeight, rearWheelsPaddingX, rearBearingsInsetZ).translate([rearWheelsPaddingY, rearBottomStructPaddingX, 0]))
        )
        //.subtract(//drawCylinder().transform(new CSG.Matrix4x4([0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, -9.25, -1.25, 4.466999053955078, 1])) //<- a cylinder that carve a hole after the left bearing, before the left wheel
            //.union(drawCube().transform(new CSG.Matrix4x4([0.7071067690849304, 0, 0.7071067690849304, 0, 0, 1, 0, 0, -0.7071067690849304, 0, 0.7071067690849304, 0, -15.929786682128906, -17.750499725341797, 1.5377130508422852, 1])))
            //.union(rearSensorHole) //<- TODO: disabled for now (temporary board)
            
		//	)
			
		)
		.setColorName("red")	
	
	rearAttach.properties.rearScrewHole = rearScrewHole;	
	rearAttach.properties.rearGearBox = gearBox;
	rearAttach.properties.rearGearHole = rearGearHole;
	rearAttach.properties.rearSensorHole = rearSensorHole;
	rearAttach = rearAttach.rotateZ(90);
	
	return rearAttach;
};

attachGears = function(rearAttach, motorCenter, motorR, reducerRI, reducerRO, wheelsR, gearMargin) {
	//Calculate gear position:
	var wheelsCenter = rearAttach.properties.axle.getBoundsAt(0,1,0);

	//var motorCenter = [wheelsCenter[0],rearAttach.properties.rearGearBox.getBoundsAt(1, 1, 0)[1] + gearMargin +2, wheelsCenter[2] + 7.8]; //TODO: calculate based on bottom (now from bumper)
	
	var fromAngle = 270;
	var toAngle = 360;
	var rearGearCenter = placeGear(motorCenter, motorR, reducerRI, reducerRO, wheelsCenter, wheelsR, fromAngle, toAngle);
	// [5, 12.7, 9.7 ]

	//Display the motor gear:
	var motorGear = cylinder({r: motorR, h: 4, center:true}).rotateX(90).setColor([0.8, 0.8, 0.8]);
	motorGear = motorGear.translate(getMove(motorGear.getBoundsAt(0,0,0), motorCenter)).translate([0, 10, 0]);
	rearAttach.properties.motorGear = motorGear;
	
	//Attach a gear:
	var reducerInner = cylinder({r: reducerRI, h: 3.5, center:true}).setColor([0.9, 0.9,0.9]).translate([0,0,-1.7]);
    var reducerOuter = cylinder({r: reducerRO, h: 1.7, center:true}).setColor([0.8, 0.8, 0.8]);
    var reducer = reducerInner.union(reducerOuter);
	var rearGear = reducer.rotateX(90);
	//var rearGear = drawRearGear().rotateZ(90);
	
	//Move and carve the hole:
	var rearGearHoleMove = getMove(rearAttach.properties.rearGearHole.getBoundsAt(0, 0, 0), rearGearCenter);
	rearAttach.properties.rearGearHole = rearGearHole = rearAttach.properties.rearGearHole.translate([rearGearHoleMove[0], 0, rearGearHoleMove[2]]);
	
	//Move and resize the rear gear:
	rearGear = rearGear.scaleSize([reducerRO*2, 0, reducerRO*2]);
	
	var rearGearMove = getMove(rearGear.getBoundsAt(1, -1, 0), rearAttach.properties.rearGearBox.getBoundsAt(1, 1, 0));
	var rearGearMoveXZ = getMove(rearGear.getBoundsAt(0, 0, 0), rearAttach.properties.rearGearHole.getBoundsAt(0, 0, 0));	
	rearGear = rearGear.translate([rearGearMoveXZ[0], rearGearMove[1] + gearMargin, rearGearMoveXZ[2]]);

	
	//Attach a cavity to accomodate the gear:
	var rearGearSpace = rearGear.scaleSizeAnchored([reducerRO*2+1, 50 /* be sure to pierce */, reducerRO*2+1], 0, 1, 0);
	
	//Allign the gear to the right and to the rearGearHole:
	var rearGearMove = getMove(rearGearSpace.getBoundsAt(1, -1, 0), rearAttach.properties.rearGearBox.getBoundsAt(1, 1, 0));
	var rearGearMoveXZ = getMove(rearGearSpace.getBoundsAt(0, 0, 0), rearAttach.properties.rearGearHole.getBoundsAt(0, 0, 0));
	rearGearSpace = rearGearSpace.translate([rearGearMoveXZ[0], rearGearMove[1] - gearMargin, rearGearMoveXZ[2]]);
	
	//Debug: show the hole:
	//rearAttach = rearAttach.union(rearGearSpace);
	
	var wheelGear = cylinder({r: wheelsR, h: 1.7, center:true}).rotateX(90);
	wheelGear = wheelGear.translate(getMove(wheelGear.getBoundsAt(0,0,0), wheelsCenter))
			.translate([0, -2, 0]).setColor([0.8, 0.8, 0.8]);
	var wheelGearSpace = wheelGear.scale(1.2).scaleSizeAnchored([0, wheelGear.getSize("y") +3, 0], 0, 1, 0); //3mm inset in the rearBottom to be sure the gears doesn't collide with the base
	
	rearAttach.properties.rearGear = rearGear;
	rearAttach.properties.rearGearSpace = rearGearSpace;
	rearAttach.properties.wheelGear = wheelGear;
	rearAttach.properties.wheelGearSpace = wheelGearSpace;
	return rearAttach;
}

drawBearingsHolder = function(width, height) {

    var marginFromBottom = 2; //How much the support go into the bearing hole (added to the struct)
    var marginLateral = 1;
	
    var bearingSx = drawCube().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-0.12500616908073425, 0, 0, 0, 0, -0.26251280307769775, 0, 0, 0, 0, -0.23751187324523926, 0, -6.250227928161621, -0.00003814697265625, 4.247857093811035, 1]));
    bearingSx = bearingSx.scaleSizeAnchored([0,0,height], 0, 0, 1);
    
    var bearingDx = bearingSx.translate([width, 0, 0]);
                
    var struct = drawCube().setColorRgb(117, 206, 219).transform(new CSG.Matrix4x4([-0.9500474333763123, 0, 0, 0, 0, -0.17502246797084808, 0, 0, 0, 0, -0.26047810912132263, 0, -0.00022792816162109375, -0.12473297119140625, 4.2478532791137695, 1]));
    var heightDelta = height - struct.getSize("z");    
    struct = struct.scaleSizeAnchored([0,0,height- marginFromBottom], 0, 0, 1);
    
    struct = struct.translate([ struct.getAlignTo(bearingSx,-1, 0, 0)[0], 0, struct.getAlignTo(bearingSx,0, 0, 1)[2]])
            .scaleSizeAnchored([width + bearingSx.getSize("x")*2, 0, 0], 1, 0, 0)
            .translate([-marginLateral, 0, 0]);
    
    var holeSx = drawRoundRoof().transform(new CSG.Matrix4x4([-1.0715305099637433e-17, 0.30000001192092896, 0, 0, -0.17499999701976776, -1.8369095638207904e-17, 0, 0, 0, 0, 0.30000001192092896, 0, -6.259230613708496, -0.12528228759765625, -2.2499818801879883, 1]));
    holeSx = holeSx.translate([0,0, -heightDelta]);
    var holeDx = holeSx.translate([width, 0, 0]);
    
    var obj = struct
        .union(bearingSx).union(bearingDx)
        .subtract(holeDx
            .union(holeSx)        
        )
        .setColorRgb(149, 26, 33)
        ;
	obj.properties.bearingsHolderBearingSx = bearingSx;
	obj.properties.bearingsHolderBearingDx = bearingDx;
	
	//Fix size so that it enter right:
	obj = obj.scaleSize([obj.getSize("x")-0.5, 0, 0]);
    return obj;
};
