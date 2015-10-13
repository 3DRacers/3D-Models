
placeGear = function(motorCenter, motorR, reducerRI, reducerRO, wheelsCenter, wheelsR, fromAngle, toAngle, marginAllowed) {
    
    //Place the reducer tanget to the motor:
    var marginAllowed = 1;
    var distanceAllowed = reducerRI + wheelsR;
    
    var centersFound = [];
    
    for(var angleMotor = fromAngle; angleMotor < toAngle; angleMotor += 1) {
        //Try a position:
        var newCenter = polarToCartesian(angleMotor, motorR + reducerRO, motorCenter);
        
        //Check if it's valid:
        var distance = distanceXZ(wheelsCenter, newCenter);

        if(abs(distance - distanceAllowed) < marginAllowed) {
            centersFound.push(newCenter);      
        }
        
    }
    if(centersFound.length == 0) {
		throw "No valid positions found for centers: motor: " + motorCenter + " and wheels: " + wheelsCenter;
	}
	
    //Filter the solutions to extract the better:
    var minDelta = abs(distanceAllowed - distanceXZ(wheelsCenter, centersFound[0]));
    var found = null;
    for(var c in centersFound) {
        var delta = abs(distanceAllowed - distanceXZ(wheelsCenter, centersFound[c]));
        if(delta < minDelta) {
            found = centersFound[c];
            minDelta = delta;
        }
    }
    return found;
}

