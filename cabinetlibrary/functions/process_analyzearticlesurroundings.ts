process_AnalyzeArticleSurroundings(surroundingContours: any, articlePosition: any, articleDimension: any): {
	distanceWallLeft: number;
	distanceWallRight: number;
	distanceWallBack: number;
	distanceCeiling: number;
	firstElement: boolean;
	lastElement: boolean;
	heightPosition: number;
	slopedCeiling: boolean;
	slopedCeilingDirection: "toLeft" | "toRight" | "toBack" | null;
	slopedCeilingAngle: number;
	slopedCeilingLevel: number;
	dataComplete: boolean;
} {

	//======================================================================
	// Default object
	//======================================================================

	const result = {
		distanceWallLeft: 0,
		distanceWallRight: 0,
		distanceWallBack: 0,
		distanceCeiling: 0,
		firstElement: false,
		lastElement: false,
		heightPosition: 0,
		slopedCeiling: false,
		slopedCeilingDirection: null as "toLeft" | "toRight" | "toBack" | null,
		slopedCeilingAngle: 0,
		slopedCeilingLevel: 0,
		dataComplete: false
	};

	//======================================================================
	// Helper functions
	//======================================================================

	// Rounding
	function round2(value: number): number {
		return Math.round(value * 100) / 100;
	}

	//======================================================================
	// Guards
	//======================================================================

	if (!surroundingContours || !surroundingContours.length) {
		return result;
	}

	if (!articlePosition) {
		return result;
	}

	if (!articleDimension) {
		return result;
	}

	//======================================================================
	// Base contour to calculate surroundings
	//======================================================================

	// Get all the contours
	const validContours = surroundingContours.filter((c: any) => c && typeof c.level === "number" && !isNaN(c.level) && c.segments?.length);

	// Guard
	if (validContours.length === 0) {
		return result;
	}

	// Get all the levels
	const validLevels = validContours.map((c: any) => c.level);

	// Get the contour-element with the lowest level
	const baseLevel = validContours.reduce((lowest: any, current: any) => {
		return current.level < lowest.level ? current : lowest;
	});

	// Extract coordinates
	const xs = baseLevel.segments.map((s: any) => s.x);
	const ys = baseLevel.segments.map((s: any) => s.y);

	// Get the min and max values
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	//======================================================================
	// Article dimension
	//======================================================================

	const dimX = articleDimension.x ?? 0;
	const dimY = articleDimension.y ?? 0;
	const dimZ = articleDimension.z ?? 0;

	//======================================================================
	// Article position
	//======================================================================

	const x = articlePosition.x ?? 0;
	const y = articlePosition.y ?? 0;
	const z = articlePosition.z ?? 0;
	const ryRaw = articleDimension.ry ?? 0;
	const ry = ((Math.round(ryRaw / 90) * 90) % 360 + 360) % 360;

	// Find the lowest level
	const lowestLevel = Math.min(...validLevels);
	const groupHeightFromFloor = lowestLevel * (-1);

	// Return the distance to the floor
	result.heightPosition = round2(groupHeightFromFloor + y);

	// Calculate the distance to the ceiling and return the distance if we can find a second contour
	if (validLevels.length >= 2) {
		const highestLevel = Math.max(...validLevels);
		result.distanceCeiling = round2(highestLevel - y - dimY);
	}
	else {
		result.distanceCeiling = 0;
	}

	//======================================================================
	// Distance to the wall
	//======================================================================

	// Calculate the distance to the wall
	let disLeft = 0;
	let disRight = 0;
	let disBack = 0;

	if (ry === 0) {
		disLeft = x - minX;
		disRight = maxX - x - dimX;
		disBack = z - minY;
	}
	else if (ry === 90) {
		disLeft = maxY - z;
		disRight = z - minY - dimX;
		disBack = minX - x;
	}
	else if (ry === 180) {
		disLeft = maxX - x;
		disRight = x - minX - dimX;
		disBack = maxY - z;
	}
	else if (ry === 270) {
		disLeft = z - minY - dimX;
		disRight = maxY - z;
		disBack = maxX - x - dimZ;
	}

	// Return the distance to the wall
	result.distanceWallLeft = round2(disLeft);
	result.distanceWallRight = round2(disRight);
	result.distanceWallBack = round2(disBack);

	//======================================================================
	// First or last element in the group
	//======================================================================

	// Settings
	const EPS = 0.001;
	const maxWallDistance = 300;

	// Check if it is close to the wall (between 0 and 300) => Expect it is the first or last
	// That is expecting not knowing!
	function isNearWall(distance: number): boolean {
		return distance >= -EPS && distance <= maxWallDistance + EPS;
	}

	// Return first or last element = true or false
	result.firstElement = isNearWall(result.distanceWallLeft);
	result.lastElement = isNearWall(result.distanceWallRight);

	//======================================================================
	// Sloped ceiling
	//======================================================================

	// Initial we got no sloped ceiling
	let slopedSegmentFound = false;

	// Iterate through the surrondingContour
	for (const contour of validContours) {

		// Get the contour points
		const xs = contour.segments.map((s: any) => s.x);
		const ys = contour.segments.map((s: any) => s.y);

		// Calculate the surrounding koordinates
		const minX = Math.min(...xs);
		const maxX = Math.max(...xs);
		const minY = Math.min(...ys);

		// Iterate through the segments inside a contour
		for (let i = 1; i < contour.segments.length; i++) {

			// Get the point before and the current one
			const prev = contour.segments[i - 1];
			const curr = contour.segments[i];

			// Guard for the angle
			if (typeof curr.angle !== "number" || curr.angle === 0) {
				continue;
			}

			// Initialize the direction => default null
			let direction: "toLeft" | "toRight" | "toBack" | null = null;

			// Left side
			if (Math.abs(prev.x - minX) < EPS && Math.abs(curr.x - minX) < EPS) {
				if (ry === 0) direction = "toLeft";
				else if (ry === 90) direction = "toBack";
				else if (ry === 180) direction = "toRight";
			}

			// Right side
			else if (Math.abs(prev.x - maxX) < EPS && Math.abs(curr.x - maxX) < EPS) {
				if (ry === 0) direction = "toRight";
				else if (ry === 180) direction = "toLeft";
				else if (ry === 270) direction = "toBack";
			}

			// Back side
			else if (Math.abs(prev.y - minY) < EPS && Math.abs(curr.y - minY) < EPS) {
				if (ry === 0) direction = "toBack";
				else if (ry === 90) direction = "toRight";
				else if (ry === 270) direction = "toLeft";
			}

			// Front side
			else if (Math.abs(prev.y - maxY) < EPS && Math.abs(curr.y - maxY) < EPS) {
				if (ry === 90) direction = "toLeft";
				else if (ry === 180) direction = "toBack";
				else if (ry === 270) direction = "toRight";
			}

			// Guard for direction => no sloped ceiling found for this segment
			if (!direction) {
				continue;
			}

			// Return the calculated values
			result.slopedCeiling = true;
			result.slopedCeilingDirection = direction;
			result.slopedCeilingAngle = round2(180 - curr.angle);

			// Return the calculated values
			result.slopedCeiling = true;
			result.slopedCeilingDirection = direction;
			result.slopedCeilingAngle = round2(180 - curr.angle);
			
			// Calculate the slopedCeilingLevel at the back end of the cabines
			let correctedLevel = contour.level;

			// Correction only if the sloped ceiling falls to the back side of the cabinet
			if (direction === "toBack" && disBack > 0) {
				const slopeAngle = 90 - curr.angle;
				const angleRad = slopeAngle * Math.PI / 180;
				const deltaHeight = Math.tan(angleRad) * disBack;
				correctedLevel = contour.level + deltaHeight;
			}
			result.slopedCeilingLevel = round2(correctedLevel);

			// If we found it, we can stop
			slopedSegmentFound = true;
			break;
		}

		if (slopedSegmentFound) {
			break;
		}
	}

	//======================================================================
	// Data set completed
	//======================================================================

	result.dataComplete = true;
	return result;
}