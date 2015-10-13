
drawSteeringBar = function(width /* distance beetween the holes*/) {
    
    var holeSx = drawCylinder().transform(new CSG.Matrix4x4([-0.17647065222263336, 4.3221391380867573e-17, -2.2655206428406547e-17, 0, 4.3221394689590023e-17, 0.17647048830986023, 0, 0, 4.9646209077685346e-17, -1.2159407604453808e-32, -0.4249996840953827, 0, -7.449772357940674, 0.09978866577148438, 2.9998579025268555, 1]));
    
    var holeDx = holeSx.translate([width, 0, 0]);

    var rectHole = drawCube().transform(new CSG.Matrix4x4([-0.10000497847795486, 1.2957199478950104e-17, 0, 0, -1.8363892672154945e-17, -0.162458136677742, 0, 0, 0, 0, 1, 0, 0.5002284049987793, -0.12546157836914062, -12.750139236450195, 1]));
    

    
    var struct = drawCube().setColorName('red').transform(new CSG.Matrix4x4([-6.400812253696994e-17, -0.2999900281429291, -1.7492878572761938e-33, 0, -0.7750388383865356, 4.363031506500031e-16, -2.143137749201107e-16, 0, 5.423605314418795e-18, -2.088925644111185e-33, -0.10000497847795486, 0, -0.1247715950012207, -0.000213623046875, 1.999863624572754, 1]));
    struct = struct.translate([ struct.getAlignTo(holeSx,-1, 0, 0)[0], 0, 0])
            .scaleSizeAnchored([width, 0, 0], -1, 0, 0)
            .translate([holeSx.getSize("x")/2, 0, 0])
            ;
    
    var roundSx = drawCylinder().setColorName('orange').transform(new CSG.Matrix4x4([-0.29999998211860657, 7.347637593538672e-17, -3.673818796769336e-17, 0, 7.347637593538672e-17, 0.29999998211860657, 0, 0, 1.2246064861712753e-17, -2.999321774252061e-33, -0.10000000894069672, 0, -7.499771595001221, 0.00003814697265625, 1.999863624572754, 1]));
    var roundDx = roundSx.translate([width, 0, 0]);
    
    rectHole = rectHole.translate([rectHole.getAlignTo(struct, 0, 0, 0)[0], 0, 0]);

    var rod = struct.union(roundSx).union(roundDx)
            .subtract(holeDx.union(holeSx)).subtract(rectHole)
        .setColorRgb(0, 159, 215);
     
    rod.properties.steeringBarHoleSx = holeSx;
    rod.properties.steeringBarHoleDx = holeDx;
    return rod;
}

/**
 * The steering part with the weels attached
 * CONNECTORS: pivotHole -> the hole where the part rotate
 */
drawSteeringRod = function(steeringAxleDiameter, steeringLength, servoHolderHeight, rodZAdjust, wheelZAdjust, steeringPivotInHoodAdd) {
	var defaultHeight = 11.5;
	var heightAdd = servoHolderHeight - defaultHeight;
	
	 
    var rod = drawSteeringRodAxle(steeringLength).translate([0,0,heightAdd + rodZAdjust]);
	
    var pivot = drawHexagonalPrism().setColorRgb(169, 123, 80).transform(new CSG.Matrix4x4([-0.12801283597946167, 0.0739082470536232,2.3514797631720627e-17, 0, -0.0739082470536232, -0.12801283597946167, 2.2508034453821112e-17, 0, -1.6103572017517044e-16, -4.0300527302436677e-17, -0.75, 0, -5.000999450683594, -4.87213134765625, 16.999996185302734, 1]));
    pivot = pivot.scaleSizeAnchored([0,0,pivot.getSize("z") + heightAdd + steeringPivotInHoodAdd], 0,0,-1);
	
	
	var wheelHole = drawCylinder().transform(new CSG.Matrix4x4([-0.1499999612569809, -2.962680043628922e-17, 2.5952672604843036e-17, 0, 2.595266433303691e-17, -3.7010172704299293e-11, 0.15000002086162567, 0, 7.29473376853774e-17, -0.4249999225139618, -2.6075408499082187e-10, 0, -4.951000213623047, -2.292003631591797, 6.999997138977051, 1]));
	
	wheelHole = wheelHole.scaleSize([steeringAxleDiameter, 0, steeringAxleDiameter]).translate([0,0, wheelZAdjust]);

    //The hole:
    pivot.properties.steeringPivotHole = CSG.cylinder({
        start: [0, 0, -2],
        end: [0, 0, 80],
        radius: 13
    }).setColorRgb(169, 123, 80).transform(new CSG.Matrix4x4([-0.12801283597946167, 0.0739082470536232,2.3514797631720627e-17, 0, -0.0739082470536232, -0.12801283597946167, 2.2508034453821112e-17, 0, -1.6103572017517044e-16, -4.0300527302436677e-17, -0.75, 0, -5.000999450683594, -4.87213134765625, 16.999996185302734, 1]))
		.translate([0,0,heightAdd])
	;
    
	pivot.properties.steeringWheelHole = wheelHole;
	
	var bigAxle = drawHexagonalPrism().setColorRgb(169, 123, 80).transform(new CSG.Matrix4x4([-6.139231108792002e-25, 0.317307710647583, 0, 0, 0.317307710647583, 6.139231108792002e-25, 0, 0, 0, 0, 0.5, 0, -5, -6.270746231079102, 4.260009765625, 1]));
	bigAxle = bigAxle.scaleSizeAnchored([0,0,bigAxle.getSize("z") +0.5 /* less movement */ + heightAdd], 0,0,-1);

    var obj = ((
            bigAxle
            .union(pivot)
            .union(drawCube().setColorName('red').transform(new CSG.Matrix4x4([2.20437578283298e-17, -0.25501272082328796, 0, 0, -0.2100105732679367, -3.6434298354253626e-17, 0, 0, 0, 0, 0.23751185834407806, 0, -5.600000381469727, -6.049999237060547, 4.249997138977051, 1])))
            .union(rod)
            
        )
        .subtract(wheelHole
            .union(drawCube().transform(new CSG.Matrix4x4([-2.1432382020146956e-17, 0.32501623034477234, 7.348005523475135e-17, 0, 7.311211193549843e-33, -5.970254156951302e-17, 0.40001997351646423, 0, 0.3000035583972931, 1.6837779183580337e-17, -4.499207199166198e-33, 0, -8.000999450683594, -10.256004333496094, 14.99999713897705, 1])))));
			
	obj.properties.steeringRodAxle = rod;
	return obj;
};

/**
 * The Axle of the steering part.
 * CONNECTORS: jointHole -> the hole where the moving bar (where the servo is attached) is attached
 */
drawSteeringRodAxle = function (steeringLength) {
    var length = steeringLength;
    var scale = length / 12.25;
    var move = length - 12.25;
    var marginFromBorder = 1;
    
    var axle = drawCube().scale([1,scale,1]).translate([0,move,0]).setColorName('red').transform(new CSG.Matrix4x4([-1.9996123507152757e-17, -2.723817306159003e-33, -0.09998001158237457, 0, -
0.6124556660652161, -1.1786966386856021e-16, 1.8369402356779039e-16, 0, 3.109243544155763e-17, -0.175009086728096, -1.968406983767176e-33, 0, -
10.875749588012695, -3.5062332153320312, 6.000247001647949, 1])
            //.multiply(CSG.Matrix4x4.scaling([scale, 1, 1]))
        );

    var joint = drawHexagonalPrism().setColorRgb(169, 123, 80).transform(new CSG.Matrix4x4([-0.12801283597946167, 0.0739082470536232, 
1.2492237120730984e-17, 0, -0.0739082470536232, -0.12801283597946167, 9.743061823060981e-18, 0, -9.674389454042951e-17, -4.0300527302436677e-17, -
0.2124999761581421, 0, -15.229164123535156, -4.87213134765625, 10.99999713897705, 1])
            );
    
    //Connector for holes:
    joint.properties.steeringJointHole = CSG.cylinder({
        start: [0, 0, -40],
        end: [0, 0, 80],
        radius: 12
    }).setColorRgb(169, 123, 80).transform(new CSG.Matrix4x4([-0.12801283597946167, 0.0739082470536232, 1.2492237120730984e-17, 0, -0.0739082470536232, -0.12801283597946167, 9.743061823060981e-18, 0, -9.674389454042951e-17, -4.0300527302436677e-17, -0.2124999761581421, 0, -15.229164123535156, -4.87213134765625, 10.99999713897705, 1]));
 
 
    var jointWidth = (joint.getBounds()[1].x - joint.getBounds()[0].x);
    var jointStartPosition = joint.getBounds()[1].x;
    var axleEndPoint = axle.getBounds()[0].x;
    
    var jointEndPosition = axleEndPoint + jointWidth + marginFromBorder; //Move to the end of the axle, with a margin

    joint = joint.translate([-(jointStartPosition - jointEndPosition), 0, 0]); //Traslate is relative to the start position
    
       
    return axle.union(joint);
            
    
};
