include("lib.jscad");
include("front.jscad");
include("rear.jscad");
include("steering.jscad");
include("lateral.jscad");
include("rearTop.jscad");
include("gears.jscad");
include("screws.jscad");
include("wheels.jscad");
include("chip.jscad");

//Meshes of the car exteriors:
include("corvetteBumper.jscad");
include("corvetteBumperRear.jscad");
include("corvetteLeft.jscad");
include("corvetteHood.jscad");
include("corvetteTop.jscad");

_resolution = 10;

function main(params) {

	//Enable/Disable elements:          |    Dependencies    				|
	SHOW_FRONT_BUMPER = 	true											;
	SHOW_STEERING = 		true											;
	SHOW_SERVO_HOLDER = 	true											;
	SHOW_HOOD 		  = 	true 		&& SHOW_FRONT_BUMPER				;
	SHOW_LR_BODY_PARTS = 	true		&& SHOW_FRONT_BUMPER				;
	SHOW_CHIP		  = 	true		&& SHOW_SERVO_HOLDER  				;
	SHOW_REAR_BOTTOM = 		true											;
	SHOW_REAR_BUMPER = 		true		&& SHOW_LR_BODY_PARTS				;
	SHOW_REAR_TOP = 		true		&& SHOW_REAR_BOTTOM && SHOW_HOOD 	;
	SHOW_WHEELS =			true											;
	
	//Parameters from the gui:
	showPrintPlate = params.printPlate == 'yes';
	
	//Add utility methods to primitives:
    extendsCSG();
	if(showPrintPlate) {
		_resolution = 20;
	}
	
	//######### START DRAWING ################

	carWidth = 30.5; //30.5 default
	var carLength = 53.5; //49 default

	var plateHeight = 1.5;
	var screwDiameter = 1.7;

	var bumperMargin = -2.5; //Distance from the front of the car (nb: was 3.5, lowered to give more space to the wheels)

	var servoHolderHeight = 14.5; //default: 11.5 - This will determine the height of the front bumper and hood too. If you change, refine with lateralHeightAdd, also you could change steeringRodZAdjust (to compensate)
	var servoEmbed = 2; //Small dent for the servo bracket. Nb: this will lower the servo height, compensate using servoHolderHeight.
	
	var hoodHeightAdd = 0; //Raise the height of the hood, and so of the top part and stretch the lateral parts. If you change, refine with lateralHeightAdd
	
	var lateralHeightAdd = 1; //Raise the height (z size) of the lateral parts, on top of the hoodHeightAdd (used for refine)
	var lateralPaddingFromBottom = 0.5; //Cut the laterals up: to counteract the enlargement during print
		
	var topXAdd = 2; //Adjust the Top pivot Hole. NB: used only if useSamePivotHole = false
	var topWidthAdd = 1; //Make the top part slightly larger so that it will fit tight with the laterals.
	
	steeringLength = 11.25; //Default 11.25
	var steeringOutside = 4; //Move the steering outside;
	var steeringFrontMargin = -0.5; //Move the steering away from the bumper
	var steeringRodZAdjust = -2.5; //Adjust the height of the steering rod from the bottom (where the axle is connected and where the servo is connected)
	var steeringPivotInHoodAdd = 1; //Add an amount of the Z of the steering pivot that will be inserted in the hood
	var frontWheelZAdjust = -1; //Height adjust of the front wheel.
    var lateralInset = 0; //Advanced usage: Embed the left/right part in the base. Ie: the wheels are outside

	

	var axleDiameter = 2;
	var axleTightHoles = 2.5;
	var bearingDiameter = 5;
	var rearBearingsInsetZ = 0; //Carve the bearing holder in the bottom
	var rearBearingsHolderPush = 1; //how much the bearing holder fit inside the axle space
	var frontWheelsDiameter = 18;
	var rearWheelsDiameter = 20;
	var wheelHeight = 6;
	var rearBottomStructPaddingX = 2; //stretch car bottom (eg: to align the bottom bumper)
	var rearWheelsPaddingX = 0; //Move the rear wheels on the X axe
	var rearWheelsPaddingY = 0; //Move the rear wheels (and gears) on the Y axe
	
	var chipLayer = 0.8;
	var chipHeight = 8.7 - chipLayer; //The height of the chip from the bottom
	
	var batteryWidth = 12;
	var batteryLength = 49; //From the bottom of the chip
	
	var motorDiameter = 6;
	var motorMarginX = 3.7; //From the bottom of the chip
	var	motorMarginZ = 8.7; //From the bottom of the chip (including chip layer) Small motor: 8.2
	
	var gearTolerance = 0.8; //Todo: tighten
	var gearMotorR = 5.3/2 - gearTolerance;
	var gearReducerRI = 6.7/2 - gearTolerance;
	var	gearReducerRO = 15.8/2 - gearTolerance;
	var	gearWheelsR = 16.8/2 - gearTolerance;
	var useSamePivotHole = false; //Use the same hole (and axle) for the top part pivot and the gears
	
	
	//Steering (part 1, mandatory):
	var steering = drawSteeringRod(axleTightHoles, steeringLength, servoHolderHeight, steeringRodZAdjust, frontWheelZAdjust, steeringPivotInHoodAdd).setColorName("green");
	
		
	//Front base with servo:
    var frontBottom = drawFrontBottom(carWidth + lateralInset, carLength, steering.getSize("x") + steeringFrontMargin, steeringOutside); //<- here can modify wheels space
	//Enforce Simmetry:
    frontBottom = frontBottom.intersect(cube({size: 200}).translate([-100,-200,-100]));
    frontBottom = frontBottom.union(frontBottom.mirroredY());
	var bottom = frontBottom; //*/
	
	var car = bottom; //<- Just to start
	
	//Steering part 2
	var steeringMove = steering.properties.steeringPivotHole.getPlaceAtMiddle(car.properties.frontHoleSx);
	steering = steering.translate([steeringMove[0], steeringMove[1], -2.5])
	
	var bumperScrew = drawScrew(screwDiameter).rotateY(90);
	var frontScrew = drawScrew(screwDiameter).rotateZ(-90);
	var centerScrew = drawScrew(screwDiameter).rotateZ(-90);
	var rearScrew = drawScrew(screwDiameter).rotateZ(-90);
	
    //Bumper:
	
	if(SHOW_FRONT_BUMPER) {
		
		var bumper = drawBumper(carWidth).setColorName("red");
		var bumperMove = getMove(bumper.getBoundsAt(1, 0, -1), car.getBoundsAt(-1, 0, -1));
		bumper = bumper.translate(bumperMove).translate([-bumperMargin, 0, 0]);
		var bumperOriginalSize = bumper.getSize("z"); //If we scale the bumper, we need to scale the left/right pieces too. //TODO: but we should scale only the first 10mm of the l/r part!
		bumper = bumper.scaleSizeAnchored([0,0,servoHolderHeight + plateHeight], 0,0,-1);
		//Top screw:
		var bumperTopScrew = car.properties.frontHoleFront.scaleSizeAnchored([screwDiameter, screwDiameter, 15], 0 ,0 ,-1);
		bumper = bumper.subtract(bumperTopScrew);
		bumper.properties.bumperTopScrew = bumperTopScrew;
		
		//Front, lateral Screw:
		frontScrew = frontScrew.alignTo(bumper, 0, -1, 0).translate([0.5, 0, 1]); //<- add a small margin for the corvette

		car.properties.bumper = bumper;
		car = bottom = bottom.union(bumper); 
	}
	// return car;
	
    //*Steering (part 3):
	if(SHOW_STEERING) {
		
		var frontWheelLeft = drawWheel(frontWheelsDiameter, axleDiameter+1 /* loose */, wheelHeight).alignToAdjacent(steering.properties.steeringWheelHole, 0, 1, 0).setColorName("black");
		steering.properties.frontWheel = frontWheelLeft;
		
		car = car.union(steering);
		var steeringRight = steering.mirroredY();
		car = car.union(steeringRight);
		car.properties.steeringLeft = steering;
		car.properties.steeringRight = steeringRight;
		
		var steeringBar = drawSteeringBar(steeringRight.properties.steeringJointHole.getMiddleCoord("y") - steering.properties.steeringJointHole.getMiddleCoord("y")).rotateZ(90);
		steeringBar = steeringBar.translate(getMove(steeringBar.properties.steeringBarHoleSx.getBoundsAt(0,0, 1), steering.properties.steeringJointHole.getBoundsAt(0,0, 1)));
		steeringBar = steeringBar.translate([ 0,0,steeringBar.getAlignTo(steering.properties.steeringRodAxle, 0, 0, 1)[2] - 1 ]);
		
		car = car.union(steeringBar);
		car.properties.steeringBar = steeringBar;
	} //*/
	
	//*Servo Holder:
	if(SHOW_SERVO_HOLDER) {
		var servoMargin = 5; //Length from the end of the bounding box of the servo to the attach point of the screw that fix it to the steering axe
		var servoHolder = drawServoHolder(servoHolderHeight, servoEmbed);
		var servoHolderMove = getMove(servoHolder.properties.servoHoleBottom.getBoundsAt(1, 0, 0), steering.properties.steeringPivotHole.getBoundsAt(0, 0, 0)); //Allign the servo handle to the pivot hole of the steering rods
		servoHolder = servoHolder.translate([servoHolderMove[0] + servoMargin, 0, 0]);		
		
		//on the front, near the bumper:
		var servoFrontSupport = drawCylinder().scaleSize([4,8, servoHolder.getSize("z") - 4]).alignTo(bottom.properties.bumper, 1, 0, 1);
		servoFrontSupport = servoFrontSupport.translate([-2.5,0, servoFrontSupport.getAlignTo(servoHolder, 0, 0, -1)[2]]);
		
		var servoFrontSupportCut = drawCube().scaleSize([10,10, 5]).alignTo(servoFrontSupport, 0, 0, 0);
		servoFrontSupportCut = servoFrontSupportCut.translate([0,0,servoFrontSupportCut.getAlignToAdjacent(servoHolder, 0,0,-1)[2] -servoEmbed]);

		servoFrontSupport = servoFrontSupport.rotateY(10);
		servoFrontSupport = servoFrontSupport.translate([0,0, servoFrontSupport.getAlignTo(servoHolder, 0, 0, 1)[2] +1]); //Re-align after the rotate
		servoFrontSupport = servoFrontSupport.subtract(servoFrontSupportCut);
		
		bottom = bottom.union(servoHolder).union(servoFrontSupport);
		bottom = bottom.subtract(bottom.properties.bumperTopScrew);
		car = car.union(servoHolder); 
	}//*/
	
	//Chip:
	var chip = drawChip(motorDiameter, motorMarginX, motorMarginZ);
	chip = chip.alignToAdjacent(servoHolder, -1, 0 , -1);
	chip = chip.translate([ -0.5 /* <- insert in the dent */, 0, -getMove([0, 0, chipHeight], chip.getBoundsAt([0,0,0]))[2] ]);
	car.properties.chip = chip;
	
	
	//*Hood:
	if(SHOW_HOOD) {
		var hoodMarginFromBumper = 6.3;
		var hood = drawHood(carWidth).setColorName("darkOrange");
		hood = hood.scaleSizeAnchored([hood.getSize("x") +6, 0 ,hood.getSize("z") + hoodHeightAdd], -1, 0, -1); //Deform
		
		var hoodMove = getMove(hood.getBoundsAt(-1, 0, -1), bumper.getBoundsAt(1, 0, 1));
		hood = hood.translate([hoodMove[0] - hoodMarginFromBumper, hoodMove[1], hoodMove[2]]);

		//Better steering support:
		var hoodSteeringSupport = drawSteeringBar(steeringRight.properties.steeringPivotHole.getMiddleCoord("y") - steering.properties.steeringPivotHole.getMiddleCoord("y")).rotateZ(90);
		hoodSteeringSupport = hoodSteeringSupport.translate(getMove(hoodSteeringSupport.properties.steeringBarHoleSx.getBoundsAt(0,0, 1), steering.properties.steeringPivotHole.getBoundsAt(0,0, 1)));
		hoodSteeringSupport = hoodSteeringSupport.translate([0,0 , hoodSteeringSupport.getAlignTo(hood, 0, 0, -1)[2] ]);	
		hoodSteeringSupport = hoodSteeringSupport.scaleSizeAnchored([0,0, hood.getSize("z")-3], 0, 0, -1);
		//Cut the steering support:
		var hoodCutBoxLx = drawCube(hood.getBoundsAt(0,0,0), [hood.getSize("x"), hood.getSize("y"), hood.getSize("z")+2]);
		hoodCutBoxLx = hoodCutBoxLx.alignToAdjacent(hood, 0, 1, 0)
		var hoodCutBoxRx = hoodCutBoxLx.alignToAdjacent(hood, 0, -1, 0);
		
		hoodSteeringSupport = hoodSteeringSupport.subtract(hoodCutBoxLx).subtract(hoodCutBoxRx);
		hood = hood.union(hoodSteeringSupport);
		
		//Screw:
		var hoodScrew = drawScrew(screwDiameter).rotateY(-90);
		hoodScrew = hoodScrew.alignTo(car.properties.frontHoleFront, 0, 0, -1);
		hoodScrew = hoodScrew.translate([0,0, hoodScrew.getAlignTo(hood, 0, 0, -1)[2] ]).translate([0,0, 1]); //1mm from bottom of hood
		hood = hood.subtract(hoodScrew.properties.screwLoose);		
		
		//Battery space:
		var batterySpace = drawBatterySpace(batteryWidth, batteryLength).rotateZ(90);
		batterySpace = batterySpace.alignTo(car.properties.chip, 1, 0 , 1).translate([0,0,20]);
		
		if(SHOW_STEERING) {
			hood = hood.subtract(car.properties.steeringRight.properties.steeringPivotHole);
			hood = hood.subtract(car.properties.steeringLeft.properties.steeringPivotHole);
		}
		if(SHOW_SERVO_HOLDER) {
			hood = hood.subtract(servoHolder.properties.servoHoleTop);
		}

		hood = hood.subtract(batterySpace);
		
		hood = hood.setColorName("red");
		car = car.union(hood);
		car.properties.hood = hood; 
	}//*/

	//*Left/Right body (Part 1)
    if(SHOW_LR_BODY_PARTS) {
		var bodyMarginFromBumper = -1.6;
		var bodyLeft = drawCarLeft().setColorName("red");
		bodyLeft = bodyLeft.scaleLength3(bodyLeft.getSize("x") + carLength - 49, carLateralCutStart, carLateralCutEnd); //Length
		var prevSize = bodyLeft.getSize("x");
		bodyLeft = bodyLeft.deform3(3, 1, -2, carLateralCutStart, carLateralCutEnd); //Deform, was 6, -2, -4
		bodyLeft = bodyLeft.scaleSize([prevSize, 0, 0]);
		
		var bodyLeftMove = getMove(bodyLeft.getBoundsAt(-1, 1, -1), bumper.getBoundsAt(-1, -1, -1));
		bodyLeft = bodyLeft.translate(bodyLeftMove).translate([-bodyMarginFromBumper, 0, 0]);
		
		
		if(lateralPaddingFromBottom > 0) {
			var bodyLeftCutBottom = drawCube(bodyLeft.getBoundsAt(0,0,-1), [bodyLeft.getSize("x"), bodyLeft.getSize("y"), lateralPaddingFromBottom]);
			bodyLeft = bodyLeft.subtract(bodyLeftCutBottom.setColorRgb(255, 255, 255));
		}
		
		if(SHOW_STEERING) {			
			//bodyLeft = bodyLeft.subtract(car.properties.frontWheelsSpace); //<- carve wheel space
			//TODO: place wheels?
			//bodyLeft = bodyLeft.union(drawCube([0,0,0], [wheelRadius, wheelHeight, wheelRadius]).alignTo(car.properties.steeringWheelHole, 0, 1, 0));
		}		
		if(SHOW_FRONT_BUMPER) {
			//TODO: we should scale only the part up to the bumper (first ca 10mm):
			bodyLeft = bodyLeft.scaleSizeAnchored([0, 0, bodyLeft.getSize("z") + bumper.getSize("z")-bumperOriginalSize + lateralHeightAdd + hoodHeightAdd ], 0, 0, -1); //If we scale the bumper, we need to scale the left/right pieces too
			
			//Front screw
			frontScrew = frontScrew.translate([0, frontScrew.getAlignTo(bodyLeft, 0, -1, 0)[1] + bodyLeft.getSize("y")/100*carLateralFrontScrewPosition, 0]); //TODO: should see the projection on the surface of the lateral part
			bodyLeft = bodyLeft.subtract(frontScrew.properties.screwLoose);
			bodyLeft.properties.frontScrew = frontScrew.properties.screw;
		}

		//Rear screw:
		rearScrewAlign = rearScrew.getAlignTo(bodyLeft, 1, -1, 0);
		rearScrew = rearScrew.translate([rearScrewAlign[0] - bodyLeft.getSize("x")/100*3.5
										, rearScrewAlign[1] + bodyLeft.getSize("y")/100*40
										, rearScrewAlign[2] - bodyLeft.getSize("z")/100*20]);
		bodyLeft.properties.rearScrew = rearScrew;
			
		//Center screw with support:
		var screwSupport = drawCube([0,0,0], [5, 4, chipHeight -3/* there are some pins under the chip */]);
		screwSupport = screwSupport.alignTo(bodyLeft, 0, 1, -1);
		screwSupport = screwSupport.translate([0+11, screwSupport.getSize("y"), +plateHeight -0.5]);
		
		centerScrewAlign = centerScrew.getAlignTo(screwSupport, 0, -1, 0);
		centerScrew = centerScrew.translate([centerScrewAlign[0]-1 /* TODO: fix the lateral mesh */, centerScrew.getAlignTo(bodyLeft, 0, -1, 0)[1] + bodyLeft.getSize("y")/100*40, centerScrewAlign[2]]);
		bodyLeft = bodyLeft.subtract(centerScrew.properties.screwLoose);
		bodyLeft.properties.centerScrew = centerScrew;
		bodyLeft.properties.centerScrewSupport = screwSupport.subtract(centerScrew.properties.screw).setColorName("red");
			
		var bodyRight = bodyLeft.mirroredY();		
		
		//TODO: Right support, make space for position sensor:
		
		bodyLeft = bodyLeft.subtract(rearScrew.properties.screwLoose);
		car.properties.bodyLeft = bodyLeft;
		car.properties.bodyRight = bodyRight; 
	}//*/
	
	//*Rear axle holder
	if(SHOW_REAR_BOTTOM) {

		var rearBottom = drawRearBottom(carWidth, carLength, rearBottomStructPaddingX, rearWheelsPaddingX, chipHeight /* <- it's placed on the plate */, rearWheelsPaddingY, rearBearingsInsetZ);
		var rearBottomMove = getMove(rearBottom.getBoundsAt(-1, 0, -1), frontBottom.getBoundsAt(1, 0, -1));
		rearBottom = rearBottom.translate(rearBottomMove);
		
		rearBottom.properties.rearTopPivotHole = rearBottom.properties.rearGearHole.translate([topXAdd, 0 ,0]);
		rearBottom = attachGears(rearBottom, car.properties.chip.properties.motor.getBoundsAt(0,0,0), gearMotorR, gearReducerRI, gearReducerRO, gearWheelsR, gearTolerance);
		
		if(useSamePivotHole) {
			rearBottom.properties.rearTopPivotHole = rearBottom.properties.rearGearHole;			
		}
		else {
			rearBottom.properties.rearGearHole = rearBottom.properties.rearGearHole.scaleSize([0, carWidth -5, 0]);
			var rearBottomGearHoleMove = rearBottom.properties.rearGearHole.getAlignTo(rearBottom, 0, 1, 0);
			rearBottom.properties.rearGearHole = rearBottom.properties.rearGearHole.translate([0, rearBottomGearHoleMove[1] +5, 0]);
			//Smaller since it's only for the gear
		}
		rearBottom = rearBottom.subtract(rearBottom.properties.rearGearHole);
		
		//Bearings Holder:
		var bearingsHolder = drawBearingsHolder(0.5 + abs(rearBottom.properties.rightBearing.getMiddleCoord("y") - rearBottom.properties.leftBearing.getMiddleCoord("y")), rearBottom.properties.leftBearing.getSize("z") - plateHeight - bearingDiameter/2 +rearBearingsHolderPush/* <- so that it push tight */).rotateZ(90);
		bearingsHolder = bearingsHolder.translate(getMove(bearingsHolder.properties.bearingsHolderBearingSx.getBoundsAt(0,0, 1), rearBottom.properties.leftBearing.getBoundsAt(0,0, 1))); //XY
		bearingsHolder = bearingsHolder.translate([ 0,0,bearingsHolder.getAlignTo(rearBottom.properties.leftBearing, 0, 0, 1)[2] ]); //Z		
		rearBottom.properties.bearingsHolder = bearingsHolder;
		car = car.union(rearBottom.properties.bearingsHolder);
		
		//Left rear wheel
		var rearWheel = drawWheel(rearWheelsDiameter, axleTightHoles, wheelHeight);
		rearWheel = rearWheel.alignTo(rearBottom.properties.leftBearing, 0, 0, 0);
		var rearWheelAlign = rearWheel.getAlignToAdjacent(rearBottom.properties.leftBearing, 0, 1, 0);
		rearWheel = rearWheel.translate([0, rearWheelAlign[1] -3, 0]);
		rearBottom.properties.rearWheelLeft = rearWheel.setColorName("black");
		
		//right rear wheel
		var rearWheelRight = rearWheel.mirroredY();
		var rearWheelAlignRight = rearWheelRight.getAlignToAdjacent(rearBottom.properties.rightBearing, 0, -1, 0);
		rearWheelRight = rearWheelRight.translate([0, rearWheelAlignRight[1] +3, 0]);
		rearBottom.properties.rearWheelRight = rearWheelRight.setColorName("black");
			
		//Chip screw hole:
		rearChipScrewHole = rearBottom.properties.rearScrewHole;
		rearChipScrewHole = rearChipScrewHole.scaleSize([screwDiameter, screwDiameter, 0]);
		rearChipScrewMove = rearChipScrewHole.getAlignTo(chip.properties.chipScrewHole, 0, 0);
		rearChipScrewHole = rearChipScrewHole.translate(rearChipScrewMove[0], rearChipScrewMove[1], 0);
		rearBottom.subtract(rearChipScrewHole);
		
		bottom = bottom.union(rearBottom).subtract(rearChipScrewHole);
		
		if(SHOW_LR_BODY_PARTS) {
			//Carve space for wheels:
			car.properties.bodyLeft = car.properties.bodyLeft.subtract(rearWheel.scaleSizeAnchored([rearWheel.getSize("x")+4, 50, rearWheel.getSize("z")+4], 0, 1, 0)); 
			car.properties.bodyRight = car.properties.bodyRight.subtract(rearWheelRight.scaleSizeAnchored([rearWheelRight.getSize("x")+4, 50, rearWheelRight.getSize("z")+4], 0, -1, 0)); 	
		
			
			car.properties.bodyRight = bodyRight = car.properties.bodyRight.subtract(rearBottom.properties.rearGearSpace
						/*fix: .translate([0, 2.5, 0])//<- TODO: fix to avoid STL Errors */
			); //The hole for the gear 
			car.properties.bodyRight = bodyRight = car.properties.bodyRight.subtract(rearBottom.properties.wheelGearSpace //<- TODO: wrong align here for no reason:
						/*fix: .translate([0, 2.5, 0])//<- TODO: fix to avoid STL Errors */
			);
		}

		car.properties.bottom = bottom;
	}//*/
	
	//*Top part:
	if(SHOW_REAR_TOP) {
		var rearTop = drawRearTop(car.properties.hood.getSize("y") + topWidthAdd/2, carLength );
		
		//Align to hood:
		var rearTop = rearTop.alignToAdjacent(car.properties.hood, -1, 0, -1).translate([-hoodTopOverlapX, topWidthAdd/4, -hoodTopOverlapZ]); //Align to hood
		
		//Now place the pivot beetween the rearTopPivotHole and the top:
		var rearTopPivot = drawRearTopPivot(bottom.properties.rearTopPivotHole.getBoundsAt(0, 0, 0), rearTop);
		//var rearTopMoveY = getMove(rearTopPivot.getBoundsAt(0, -1, 0), bumper.getBoundsAt(0, -1, 0));
		
		//rearTop = rearTop.translate([ 0, rearTopMoveY[1], 0 ]); //Y-align to the 
		rearTop = rearTop.union(rearTopPivot);
		rearTop = rearTop.subtract(rearTop.properties.rearTopGearHole); //The hole for the gear on the top
		
		//The hole where the gear rotate
		var looseness = 0.7; //Not so loose
		var looseRearGearHole = bottom.properties.rearTopPivotHole.scaleSize([axleDiameter+looseness, 0, axleDiameter+looseness]);
		looseRearGearHole = looseRearGearHole.translate(getMove(looseRearGearHole.getBoundsAt(0, 0, 0), bottom.properties.rearTopPivotHole.getBoundsAt(0, 0, 0)));
		rearTop = rearTop.subtract(looseRearGearHole); 

		//The space for the axle of the gear and top:		
		car.properties.bottom = bottom = bottom.subtract(rearTop.properties.rearTopPivotSpace);
		
		
		car = car.union(rearTop); 
		car.properties.rearTop = rearTop;
	}	
	//*
	
	//*Left/Right body (Part 2)
	if(SHOW_LR_BODY_PARTS) {
		bottom = bottom.subtract(bodyLeft.properties.leftBottomDent).subtract(bodyRight.properties.leftBottomDent); //The parts overlap the bottom plate
	
		//Hole of the gears and top part pivots:
		if(SHOW_REAR_BOTTOM) {
			car.properties.bodyLeft = bodyLeft = bodyLeft.subtract(bottom.properties.rearGearHole);
			car.properties.bodyRight = bodyRight = bodyRight.subtract(bottom.properties.rearGearHole);
			if(!useSamePivotHole) {
				car.properties.bodyLeft = bodyLeft = bodyLeft.subtract(bottom.properties.rearTopPivotHole);
				car.properties.bodyRight = bodyRight = bodyRight.subtract(bottom.properties.rearTopPivotHole);
			}
		}
		
		if(SHOW_FRONT_BUMPER) {
			//Front Screw:
			bottom = bottom.subtract(bodyLeft.properties.frontScrew).subtract(bodyRight.properties.frontScrew);
		}
		
		//Chip holder and center screw support:
		bottom = bottom.union(bodyLeft.properties.centerScrewSupport).union(bodyRight.properties.centerScrewSupport);	
			
		car.properties.bottom = bottom;
		car = car.union(bodyLeft);
		car = car.union(bodyRight); 
	}//*/

    //*Rear Bumper:
	if(SHOW_REAR_BUMPER) {
		var bumperRearMarginZ = -0; //From bottom
		var bumperRearMarginX = 0.5; //From rear
		var bumperRear = drawRearBumper(carWidth).setColorName("red");
		var bumperRearMove = getMove(bumperRear.getBoundsAt(1, 0, -1), bodyLeft.getBoundsAt(1, 0, -1));
		var bumperRearMoveY = getMove(bumperRear.getBoundsAt(0, 0, 0), car.getBoundsAt(0, 0, 0));
		bumperRear = bumperRear.translate([bumperRearMove[0] - bumperRearMarginX, bumperRearMoveY[1], bumperRearMove[2] - bumperRearMarginZ]);
		car.properties.rearBumper = bumperRear;
		bottom = bottom.union(bumperRear);
		//bottom = bottom.subtract(bottom.properties.rearSensorHole); //TODO: disabled for temporary board

		if(SHOW_REAR_TOP) {
			bottom = bottom.subtract(car.properties.rearTopPivotSpace);
			bottom = bottom.subtract(car.properties.rearTopGearHole);			
		}
		if(SHOW_LR_BODY_PARTS) {
			bottom = bottom.subtract(car.properties.rearScrew.properties.screw);
		}
		if(SHOW_REAR_BOTTOM) {
			bottom = bottom.subtract(bottom.properties.rearGearHole);
			bottom = bottom.subtract(bottom.properties.wheelGearSpace);
			if(!useSamePivotHole) {
				bottom = bottom.subtract(bottom.properties.rearTopPivotHole);
			}
		}
	}
	//*
	
	//Chip holder:
	if(SHOW_SERVO_HOLDER && SHOW_REAR_BOTTOM) {
		var batterySupportOverDent = 4;
		var chipHolderFront = drawCube([0,0,0], [1, servoHolder.getSize("y"), bottom.properties.leftBearing.getSize("z") - plateHeight + batterySupportOverDent /* <- battery support and better "dent" */]).setColorName("red");
		var chipHolderAlign = chipHolderFront.getAlignToAdjacent(servoHolder, -1, 0, -1);
		chipHolderFront = chipHolderFront.translate([chipHolderAlign[0], chipHolderAlign[1], chipHolderFront.getAlignTo(servoHolder, 0, 0, -1)[2]]);
		var chipHolderDentFront = drawRoof().scaleSize([6, carWidth, 4]).alignToAdjacent(chipHolderFront, -1, 0, -1).translate([-(chipHolderFront.getSize("x") +1/* 1mm inset */), 0 ,-batterySupportOverDent]);
		
		bottom = bottom.union(chipHolderFront).subtract(chipHolderDentFront);
		car = car.union(chipHolderFront).subtract(chipHolderDentFront);
	}
	
	//Finish:
	car = car.union(bottom.setColorName("red"));
	car.properties.bottom = bottom; //Reassign since union and subtract create a copy

	/*echo("Car size: " + [car.getSize("x"), car.getSize("y")] + " chip size: " + [car.properties.chip.getSize("x"), car.properties.chip.getSize("y")] + " position: " + car.properties.chip.getBoundsAt(-1, -1, -1)
			+ " axle position: " + car.properties.axle.getBoundsAt(-1, -1, -1)
		);
	*/
	//FINAL DRAW:
	
	if(!showPrintPlate) {
		//Not for printing, show also not printed items: 
		if(SHOW_SERVO_HOLDER) car = car.union(servoHolder.properties.servo);
		if(SHOW_STEERING) {
			if(SHOW_WHEELS) {
				car = car.union(car.properties.steeringLeft.properties.frontWheel);
				car = car.union(car.properties.steeringRight.properties.frontWheel);
			}
		}
		if(SHOW_REAR_BOTTOM) {
			car = car.union(rearBottom.properties.motorGear);
			car = car.union(rearBottom.properties.rearGear);
			car = car.union(rearBottom.properties.wheelGear);
			if(SHOW_WHEELS) {
				car = car.union(car.properties.rearWheelLeft);
				car = car.union(car.properties.rearWheelRight);
				car = car.union(car.properties.axle);
			}			
		}
		if(SHOW_CHIP) {
			car = car.union(car.properties.chip);
		}
		
		//Rulers:
		var gizmo = CSG.cube({ center: [0, 0, 0], radius: 1 }).setColorRgb(0,0,0);
		gizmo = gizmo.union(CSG.cube({ center: [-50, 0, 0], radius: [50, 1, 1] }).translate([50,0,0]).setColorRgb(100,100,200) );
		gizmo = gizmo.union(CSG.cube({ center: [50, 0, 0], radius: 1 }).setColorName("orange") );
		
		gizmo = gizmo.union(CSG.cube({ center: [0, -50, 0], radius: [1, 50, 1] }).translate([0,50,0]).setColorRgb(0,200,0) );
		gizmo = gizmo.union(CSG.cube({ center: [0, 50, 0], radius: 1 }).setColorName("orange")  );
		car = car.union(gizmo.translate([0,0,0]));
	}
    else {
		//Lie flat on plate:
		carLie = car.properties.bottom;
		
		if(SHOW_LR_BODY_PARTS) {
			car.properties.bodyRight = car.properties.bodyRight.rotateX(90);
			carLie = carLie.union(car.properties.bodyRight.translate([-10, -55, -1*car.properties.bodyRight.getBounds()[0]["z"] ]));
			carLie = carLie.union(car.properties.bodyLeft.lieFlat().translate([0, -35, 0]));
               }
		if(SHOW_HOOD) carLie = carLie.union(car.properties.hood.lieFlat().translate([20, 35, -0.2 /* <- fix strange error after the repair by netfabb */]));
		if(SHOW_STEERING) {
			carLie = carLie.union(car.properties.steeringRight.rotateZ(180).lieFlat().translate([-10, 25, 0]));
			carLie = carLie.union(car.properties.steeringLeft.lieFlat().translate([-10, 43, 0]));
			//carLie = carLie.union(car.properties.steeringRight.properties.frontWheel.rotateZ(180).lieFlat().translate([-30, 30, 0]));
			//carLie = carLie.union(car.properties.steeringLeft.properties.frontWheel.lieFlat().translate([50, 30, 0]));
			carLie = carLie.union(car.properties.steeringBar.lieFlat().translate([-45, 55, 0]));
		}
		if(SHOW_REAR_TOP) {
			var rearTopTmp = car.properties.rearTop.rotateX(90).rotateZ(-90);
			carLie = carLie.union(rearTopTmp.translate([-30, 27, -1*rearTopTmp.getBounds()[0]['z'] ]));
		}
		if(SHOW_REAR_BOTTOM) {
			//carLie = carLie.union(car.properties.rearWheelRight.rotateZ(180).lieFlat().translate([-30, 50, 0]));
			//carLie = carLie.union(car.properties.rearWheelLeft.lieFlat().translate([50, 50, 0]));
			carLie = carLie.union(rearBottom.properties.bearingsHolder.rotateY(180).lieFlat().translate([-45, 20, 0]));
		}

		car = carLie;
	}
	
    return car;
}


function getParameterDefinitions() {
    return [	
    {
      name: 'printPlate',
      type: 'choice',
      values: ['yes', 'no'],              
      captions: ["Yes", "No"],                      
      initial: 'yes',                                              
      caption: 'Create a print plate'    
    }
	];
}
var steeringLength;
var carWidth;
