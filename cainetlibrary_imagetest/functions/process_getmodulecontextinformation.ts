process_GetModuleContextInformation(module: any): {
	NeedsVisibleSideLeft: boolean;
	NeedsVisibleSideRight: boolean;
	ReturnPlinthLeft: boolean;
	ReturnPlinthRight: boolean;
	ReturnCeilingFillerLeft: boolean;
	ReturnCeilingFillerRight: boolean;

	DistanceWallLeft: number;
	DistanceWallRight: number;
	DistanceWallBack: number;
	DistanceCeiling: number;

	FirstElement: boolean;
	LastElement: boolean;
	HasDockingLeft: boolean;
	HasDockingRight: boolean;
	HeightPosition: number;

	SlopedCeiling: boolean;
	SlopedCeilingDirection: "toLeft" | "toRight" | "toBack" | null;
	SlopedCeilingAngle: number;
	SlopedCeilingLevel: number;

	DataComplete: boolean;
}
{
	//======================================================================
	// Create the default return object
	//======================================================================

	const result = {
		NeedsVisibleSideLeft: true,
		NeedsVisibleSideRight: true,
		ReturnPlinthLeft: true,
		ReturnPlinthRight: true,
		ReturnCeilingFillerLeft: true,
		ReturnCeilingFillerRight: true,

		DistanceWallLeft: 0,
		DistanceWallRight: 0,
		DistanceWallBack: 0,
		DistanceCeiling: 0,

		FirstElement: false,
		LastElement: false,
		HasDockingLeft: false,
		HasDockingRight: false,
		HeightPosition: 0,

		SlopedCeiling: false,
		SlopedCeilingDirection: null as "toLeft" | "toRight" | "toBack" | null,
		SlopedCeilingAngle: 0,
		SlopedCeilingLevel: 0,

		DataComplete: false
	};

	//======================================================================
	// Guard
	//======================================================================

	if (!module || !(module instanceof OD_M_mr_StorageunitSingle)) {
		return result;
	}

	//======================================================================
	// Read all required data from the module
	//======================================================================

	const moduleContext = module.getContextModule(module._id);
	const surroundingContours = module.getRoomContours() ?? [];
	const articlePos = module.getArticlePos();

	const articleDimension = {
		x: module.mod_Width ?? 0,
		y: module.mod_Height ?? 0,
		z: module.mod_Depth ?? 0,
		ry: moduleContext?._articlePos?.rotationY ?? 0
	};

	//======================================================================
	// Analyze neighboring modules and dockings
	//======================================================================

	const dockingInfo = analyzeDocking(module, moduleContext, articleDimension.y);

	result.NeedsVisibleSideLeft = dockingInfo.needsVisibleSideLeft;
	result.NeedsVisibleSideRight = dockingInfo.needsVisibleSideRight;
	result.ReturnPlinthLeft = dockingInfo.returnPlinthLeft;
	result.ReturnPlinthRight = dockingInfo.returnPlinthRight;
	result.ReturnCeilingFillerLeft = dockingInfo.returnCeilingFillerLeft;
	result.ReturnCeilingFillerRight = dockingInfo.returnCeilingFillerRight;
	result.HasDockingLeft = dockingInfo.hasDockingLeft;
	result.HasDockingRight = dockingInfo.hasDockingRight;

	//======================================================================
	// Analyze room contours, wall distances and ceiling information
	//======================================================================

	const surroundingInfo = analyzeSurroundings(
		surroundingContours,
		articlePos,
		articleDimension
	);

	result.DistanceWallLeft = surroundingInfo.distanceWallLeft;
	result.DistanceWallRight = surroundingInfo.distanceWallRight;
	result.DistanceWallBack = surroundingInfo.distanceWallBack;
	result.DistanceCeiling = surroundingInfo.distanceCeiling;

	result.HeightPosition = surroundingInfo.heightPosition;

	result.SlopedCeiling = surroundingInfo.slopedCeiling;
	result.SlopedCeilingDirection = surroundingInfo.slopedCeilingDirection;
	result.SlopedCeilingAngle = surroundingInfo.slopedCeilingAngle;
	result.SlopedCeilingLevel = surroundingInfo.slopedCeilingLevel;

	//======================================================================
	// Determine first and last element
	//======================================================================

	result.FirstElement = surroundingInfo.firstElement && !dockingInfo.hasDockingLeft;
	result.LastElement = surroundingInfo.lastElement && !dockingInfo.hasDockingRight;

	//======================================================================
	// Data set completed
	//======================================================================

	result.DataComplete = dockingInfo.dataComplete && surroundingInfo.dataComplete;
	return result;


	//======================================================================
	// Helper functions
	//======================================================================

	/** Analyze Docking
	 * Analyzes all neighboring modules and determines
	 * visible sides, plinth returns and ceiling fillers.
	 */
	//--------------------------------------------------------------------

	function analyzeDocking(module: any, moduleContext: any, myHeight: number): {
		hasDockingLeft: boolean;
		hasDockingRight: boolean;

		returnPlinthLeft: boolean;
		returnPlinthRight: boolean;
		returnCeilingFillerLeft: boolean;
		returnCeilingFillerRight: boolean;

		needsVisibleSideLeft: boolean;
		needsVisibleSideRight: boolean;

		dataComplete: boolean;
	} {
		const coveredLeft: { from: number; to: number }[] = [];
		const coveredRight: { from: number; to: number }[] = [];

		let dockLeftTop = false;
		let dockRightTop = false;
		let dockLeftBtm = false;
		let dockRightBtm = false;

		if (!moduleContext) {
			return {
				hasDockingLeft: false,
				hasDockingRight: false,

				returnPlinthLeft: true,
				returnPlinthRight: true,
				returnCeilingFillerLeft: true,
				returnCeilingFillerRight: true,

				needsVisibleSideLeft: true,
				needsVisibleSideRight: true,

				dataComplete: true
			};
		}

		const neighborModules = moduleContext._contextData?.dockedRoots || [];

		neighborModules.forEach((neighbor: any) => {
			const ownDock = neighbor.ownDockingVector;

			switch (ownDock) {
				case Dock.LeftTop:
					dockLeftTop = true;
					break;

				case Dock.LeftBottom:
					dockLeftBtm = true;
					break;

				case Dock.RightTop:
					dockRightTop = true;
					break;

				case Dock.RightBottom:
					dockRightBtm = true;
					break;
			}

			const neighborAttributes = module
				.getContextModule(neighbor.dockedRoots?.[0]?.id)
				?.getAttributes();

			if (!neighborAttributes) {
				return;
			}

			const neighborHeight = Number(neighborAttributes.get("mod_Height") ?? 0);
			const coveredInterval = getCoveredInterval(ownDock, myHeight, neighborHeight);

			if (!coveredInterval) {
				return;
			}

			if (ownDock === Dock.LeftBottom || ownDock === Dock.LeftTop) {
				coveredLeft.push(coveredInterval);
			}

			if (ownDock === Dock.RightBottom || ownDock === Dock.RightTop) {
				coveredRight.push(coveredInterval);
			}
		});

		return {
			hasDockingLeft: dockLeftTop || dockLeftBtm,
			hasDockingRight: dockRightTop || dockRightBtm,

			returnPlinthLeft: !dockLeftBtm,
			returnPlinthRight: !dockRightBtm,
			returnCeilingFillerLeft: !dockLeftTop,
			returnCeilingFillerRight: !dockRightTop,

			needsVisibleSideLeft: !isFullyCovered(coveredLeft, myHeight),
			needsVisibleSideRight: !isFullyCovered(coveredRight, myHeight),

			dataComplete: true
		};
	}


	/** Get Covered Interval
	 * Calculates the covered height range created by a neighboring module.
	 */
	//--------------------------------------------------------------------

	function getCoveredInterval(
		ownDock: any,
		myHeight: number,
		neighborHeight: number
	): { from: number; to: number } | null {
		let coveredFrom = 0;
		let coveredTo = 0;

		switch (ownDock) {
			case Dock.LeftBottom:
			case Dock.RightBottom:
				coveredFrom = 0;
				coveredTo = neighborHeight;
				break;

			case Dock.LeftTop:
			case Dock.RightTop:
				coveredFrom = myHeight - neighborHeight;
				coveredTo = myHeight;
				break;

			default:
				return null;
		}

		// Clamp values
		coveredFrom = Math.max(0, coveredFrom);
		coveredTo = Math.min(myHeight, coveredTo);

		if (coveredTo <= coveredFrom) {
			return null;
		}

		return {
			from: coveredFrom,
			to: coveredTo
		};
	}


	/** Is Fully Covered
	 * Checks whether the complete side of the module
	 * is covered by neighboring modules.
	 */
	//--------------------------------------------------------------------

	function isFullyCovered(intervals: { from: number; to: number }[], totalHeight: number): boolean {
		if (totalHeight <= 0 || intervals.length === 0) {
			return false;
		}

		const sorted = intervals
			.slice()
			.sort((a, b) => a.from - b.from);

		let coveredTo = 0;

		for (const interval of sorted) {
			if (interval.from > coveredTo) {
				return false;
			}

			coveredTo = Math.max(coveredTo, interval.to);

			if (coveredTo >= totalHeight) {
				return true;
			}
		}

		return false;
	}


	/** Analyze Surroundings
	 * Analyzes the room contours and calculates
	 * wall distances, ceiling distance and sloped ceiling information.
	 *
	 * This is the former process_AnalyzeArticleSurroundings logic,
	 * moved into this function as local helper.
	 */
	//--------------------------------------------------------------------

	function analyzeSurroundings(surroundingContours: any, articlePosition: any, articleDimension: any): {
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

		// Rounding
		function round2(value: number): number {
			return Math.round(value * 100) / 100;
		}

		// Guards
		if (!surroundingContours || !surroundingContours.length) {
			return result;
		}

		if (!articlePosition) {
			return result;
		}

		if (!articleDimension) {
			return result;
		}

		// Get all valid contours
		const validContours = surroundingContours.filter((c: any) =>
			c &&
			typeof c.level === "number" &&
			!isNaN(c.level) &&
			c.segments?.length
		);

		if (validContours.length === 0) {
			return result;
		}

		// Get all levels
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

		// Article dimensions
		const dimX = articleDimension.x ?? 0;
		const dimY = articleDimension.y ?? 0;
		const dimZ = articleDimension.z ?? 0;

		// Article position
		const x = articlePosition.x ?? 0;
		const y = articlePosition.y ?? 0;
		const z = articlePosition.z ?? 0;

		// Normalize rotation
		const ryRaw = articleDimension.ry ?? 0;
		const ry = ((Math.round(ryRaw / 90) * 90) % 360 + 360) % 360;

		// Find the lowest level
		const lowestLevel = Math.min(...validLevels);
		const groupHeightFromFloor = lowestLevel * (-1);

		// Return the distance to the floor
		result.heightPosition = round2(groupHeightFromFloor + y);

		// Calculate the distance to the ceiling
		if (validLevels.length >= 2) {
			const highestLevel = Math.max(...validLevels);
			result.distanceCeiling = round2(highestLevel - y - dimY);
		}
		else {
			result.distanceCeiling = 0;
		}

		// Distance to the wall
		//--------------------------------------------------------------

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

		result.distanceWallLeft = round2(disLeft);
		result.distanceWallRight = round2(disRight);
		result.distanceWallBack = round2(disBack);

		// First or last element in the group
		//--------------------------------------------------------------

		const EPS = 0.001;
		const maxWallDistance = 300;

		function isNearWall(distance: number): boolean {
			return distance >= -EPS && distance <= maxWallDistance + EPS;
		}

		result.firstElement = isNearWall(result.distanceWallLeft);
		result.lastElement = isNearWall(result.distanceWallRight);

		// Sloped ceiling
		//--------------------------------------------------------------

		let slopedSegmentFound = false;

		for (const contour of validContours) {
			const xs = contour.segments.map((s: any) => s.x);
			const ys = contour.segments.map((s: any) => s.y);

			const minX = Math.min(...xs);
			const maxX = Math.max(...xs);
			const minY = Math.min(...ys);
			const maxY = Math.max(...ys);

			for (let i = 1; i < contour.segments.length; i++) {
				const prev = contour.segments[i - 1];
				const curr = contour.segments[i];

				if (typeof curr.angle !== "number" || curr.angle === 0) {
					continue;
				}

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

				if (!direction) {
					continue;
				}

				result.slopedCeiling = true;
				result.slopedCeilingDirection = direction;
				result.slopedCeilingAngle = round2(180 - curr.angle);

				let correctedLevel = contour.level;

				// Correction only if the sloped ceiling falls to the back side of the cabinet
				if (direction === "toBack" && disBack > 0) {
					const slopeAngle = 90 - curr.angle;
					const angleRad = slopeAngle * Math.PI / 180;
					const deltaHeight = Math.tan(angleRad) * disBack;

					correctedLevel = contour.level + deltaHeight;
				}

				result.slopedCeilingLevel = round2(correctedLevel);

				slopedSegmentFound = true;
				break;
			}

			if (slopedSegmentFound) {
				break;
			}
		}

		// Return the room data
		//--------------------------------------------------------------
		result.dataComplete = true;
		return result;
	}
}