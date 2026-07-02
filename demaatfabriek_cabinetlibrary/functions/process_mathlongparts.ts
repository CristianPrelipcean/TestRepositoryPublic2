process_MathLongparts() {
	/*
			 * Provide mathematical functions required for long parts generation.
			 * Some of those functions should make it to the API.
			 * This is a workaround to be able to provide type-safe code without using import statements.
			 * 
			 * Vector3Extensions: Further mathematical functions for Vector3 objects which are missing in the base.ts
			 * LineSegmentEquation: Mathematical equation for line segment and its supporting math. This is useful for evaluating if contours are adjacent.
			 * Contour computation:
				* Convert contour to a plot of 3D coordinates in the 2D plane and in the world coordinate system.
				* LongPartSegment object to evaluate the length of the segment and finding out if it has its neighbours.
				* LongPartSegmentEdge is an object representing a matchable/connectable edge of the segment.
			 * 
			 * By Jiri Polcar
			 * 
			 */

	/** Attribute to detect contour entries with the same owner. Useful if they should communicate somehow. */
	const CONTOUR_ATTRIBUTE_OWNER_ID = 'OwnerId';
	const CONTOUR_ATTRIBUTE_ADD_COUNTERTOP = 'AddCountertop';
	const CONTOUR_ATTRIBUTE_ADD_TOEKICK = 'AddToekick';
	const CONTOUR_ATTRIBUTE_DOES_NOT_DEFINE_DEPTH = 'NoDepthDefinition';
	const CONTOUR_ATTRIBUTE_OWNER_TYPE = 'OwnerType';
	const CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE = 'CornerContourType';
	const CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT = 'Straight';
	const CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR = 'Perpendicular';
	const mr_CornerunitStraight = 'mr_CornerunitStraight';
	const mr_StorageunitSingle = 'mr_StorageunitSingle';
	const mr_Upright = 'mr_Upright';
	const mr_Filler01 = 'mr_Filler01';

	/** Extends the base Vector3 with some vector math */
	class Vector3Extended extends Vector3 {

		constructor(x: number, y: number, z: number);
		constructor(v: Vector3);
		constructor(xOrVector: number | Vector3, y?: number, z?: number) {
			if (xOrVector instanceof Vector3) {
				super(xOrVector._x, xOrVector._y, xOrVector._z);
			} else {
				super(xOrVector, y!, z!);
			}
		}

		/**
		 * Epsilon value to compare coordinate or position equality.
		 * apparently, 0.000001 was too little
		 * TC provided near-zero position values: "x": 900.0, "y": -2.6679314139854693E-12, "z": -6.103515625E-05, "rotationY": 1.1920928955078125E-07
		 * where the previous value failed
		 * 0.01 mm is a suggestion for trying out
		 */
		static EPS: number = 0.01;

		add(v: Vector3) {
			return new Vector3Extended(this._x + v._x, this._y + v._y, this._z + v._z);
		}
		subtract(v: Vector3) {
			return new Vector3Extended(this._x - v._x, this._y - v._y, this._z - v._z);
		}
		scale(scalar: number) {
			return new Vector3Extended(this._x * scalar, this._y * scalar, this._z * scalar);
		}
		normalize() {
			const magnitude = this.magnitude();
			if (magnitude < Vector3Extended.EPS) {
				return new Vector3Extended(0, 0, 0);
			}
			else {
				return this.scale(1 / this.magnitude());
			}
		}
		/** length of vector */
		magnitude() {
			return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
		}
		isCoincident(v: Vector3, tolerance: number = Vector3Extended.EPS) {
			return this.subtract(v).magnitude() < Vector3Extended.EPS;
		}
		/** dot product */
		dot(v: Vector3) {
			return this._x * v._x + this._y * v._y + this._z * v._z;
		}
		/** cross product */
		cross(v: Vector3) {
			return new Vector3Extended(this._y * v._z - this._z * v._y, this._z * v._x - this._x * v._z, this._x * v._y - this._y * v._x);
		}
		/** size of cross is size of area between two vectors - if that is 0, they are parallel */
		isParallel(v: Vector3) {
			return this.cross(v).magnitude() < Vector3Extended.EPS;
		}
		distanceTo(v: Vector3) {
			return this.subtract(v).magnitude();
		}
	}

	/**
	 * Represents a line segment parametric equation in 3D space.
	 * The line segment is defined by two points, start and end.
	 */
	class LineSegmentEquation {
		/** Starting point of the line */
		readonly start: Vector3Extended;
		/* End point of the line segment */
		readonly end: Vector3Extended;
		/** The length of the line segment, computed as the distance between the start and the end */
		readonly length: number;
		/** The normalized direction vector of the line segment */
		readonly direction: Vector3Extended;
		readonly explicitFootprintEquation: boolean = false;

		/**
		 * 
		 * @param start line segment start point
		 * @param end line segment end point
		 * @param footprintEquation whether to reduce the line segment to a 2D line by setting the y coordinate of the start and end points to 0
		 */
		constructor(start: Vector3, end: Vector3, footprintEquation: boolean = false) {
			this.start = new Vector3Extended(start);
			this.end = new Vector3Extended(end);
			this.explicitFootprintEquation = footprintEquation;
			if (footprintEquation) {
				this.start._y = 0;
				this.end._y = 0;
			}
			this.length = this.start.distanceTo(this.end);
			if (this.length < Vector3Extended.EPS) {
				throw new Error("Line segment must have a length greater than zero");
			}
			this.direction = this.end.subtract(this.start).scale(1 / this.length);
		}

		/**
		 * @returns The same equation with the y coordinate of the start and end points set to 0.
		 */
		toFootprintEquation(): LineSegmentEquation {
			return new LineSegmentEquation(this.start, this.end, true);
		}
		/**
		 * Returns true if both segments are fully coincident (equality on start and end points)
		 */
		isFullyCoincident(other: LineSegmentEquation, tolerance: number | undefined = undefined): boolean {
			const ownStartIsOtherStart = this.start.isCoincident(other.start, tolerance);
			const ownStartIsOtherEnd = this.start.isCoincident(other.end, tolerance);
			const ownEndIsOtherEnd = this.end.isCoincident(other.end, tolerance);
			const ownEndIsOtherStart = this.end.isCoincident(other.start, tolerance);
			return (ownStartIsOtherStart && ownEndIsOtherEnd) || (ownStartIsOtherEnd && ownEndIsOtherStart);
		}
		/**
		 * Returns the length of the concident part of the two line segments.
		 * @returns The length of the common concidence, or 0 if they only touch or null if they do not coincide.
		 */
		getCoincidenceLength(other: LineSegmentEquation): number | null {
			if (!this.isColinear(other)) { return null; }
			else if (this.isFullyCoincident(other)) { return this.length; }
			else {
				const otherStartDistance = this.getParameterOfPoint(other.start)!;
				const otherEndDistance = this.getParameterOfPoint(other.end)!;
				const isReversedDirection = otherStartDistance > otherEndDistance;
				// other start and end reordered to fit this line segment's direction
				const alignedOtherStartDistance = isReversedDirection ? otherEndDistance : otherStartDistance;
				const alignedOtherEndDistance = isReversedDirection ? otherStartDistance : otherEndDistance;
				// If the other segment is fully outside, that means that the start if after own end and vice versa
				if (alignedOtherStartDistance > this.length || alignedOtherEndDistance < 0) {
					// if other start is after own end || other end is before own start, there is no coincidence
					return 0;
				}
				else {
					const positionOfStartEndNearFar = [
						0, // own start
						alignedOtherStartDistance, // other first point
						alignedOtherEndDistance, // other second point
						this.length, // own end
					].sort();
					// the two middle values are the start and end of the common part
					// all other cases have been filtered out by previous conditions
					return positionOfStartEndNearFar[2] - positionOfStartEndNearFar[1];
				}
			}
		}
		/**
		 * Returns the length of the start to @param point on the line segment or null if the point is not on the line segment.
		 */
		getParameterOfPoint(point: Vector3 | Vector3Extended): number | null {
			const pointVector3Extended = point instanceof Vector3 ? new Vector3Extended(point) : point;
			if (this.start.isCoincident(pointVector3Extended)) {
				return 0;
			}
			else if (!new LineSegmentEquation(this.start, pointVector3Extended).isColinear(this)) {
				return null;
			}
			else {
				return this.direction.dot(pointVector3Extended.subtract(this.start));
			}
		}
		/** gets point in given distance from start in the direction to the end */
		getPointAt(t: number): Vector3Extended {
			return this.start.add(this.direction.scale(t));
		}
		/**
		 * Returns the perpendicular distance of a point to the line the segment is on. Can be 0 if point is on the line.
		 */
		perpendicularDistanceOfPoint(point: Vector3): number {
			const pointToStart = this.start.subtract(point);
			const cross = pointToStart.cross(this.direction);
			return cross.magnitude();
		}
		/**
		 * Returns true if the two line segments are parallel. 
		 * Note: They can still be coincident if they are parallel.
		 */
		isParallel(other: LineSegmentEquation): boolean {
			return this.direction.isParallel(other.direction);
		}
		/**
		 * Returns true if the lines of the two segments are colinear.
		 * Note: This doesn't evaluate line segment coincidence, only if they are on the same line.
		 * (checks whether they're parallel and perpendicular distace is < tolerance).
		 */
		isColinear(other: LineSegmentEquation, tolerance: number | undefined = undefined): boolean {
			return this.isParallel(other) && this.perpendicularDistanceOfPoint(other.start) < (tolerance ?? Vector3Extended.EPS);
		}
		/**
		 * If the one line segment continues with another one (one pair of start/end points coincide), this function returns true.
		 * If the line segments are coincident, it returns false (both start and end points coincide).
		 */
		continuesWith(other: LineSegmentEquation, tolerance: number | undefined = undefined): boolean {
			if (!this.isColinear(other, tolerance)) {
				return false;
			}
			const checks = [
				this.start.subtract(other.start).magnitude(),
				this.start.subtract(other.end).magnitude(),
				this.end.subtract(other.end).magnitude(),
				this.end.subtract(other.start).magnitude(),
			];
			const eps = tolerance ?? Vector3Extended.EPS;
			// How many points pairs' distances are 0,
			//   if 2, the line segments are fully coincident
			//   if 1, the line segments continue
			return checks.filter(check => check < eps).length === 1;
		}
		/**
		 * Takes the start point of the line segment as the origin and the 2D projection
		 * of the direction vector as the azimuth and returns a transformation matrix
		 * to transform to start point in the azimuth of the direction.
		 */
		getTransformationMatrixToStartPoint(): Matrix4 {
			const translation = new Matrix4().makeTranslation(this.start._x, this.start._y, this.start._z);
			// because considering zero rotation and rotation direction
			const azimuth = -90 + Math.atan2(this.direction._x, this.direction._z) / Math.PI * 180;
			const rotation = new Matrix4().makeRotationY(azimuth);
			return (new Matrix4()
				.multiply(translation)
				.multiply(rotation)
			);
		}
		/** Gets point of intersection with another line or null if colinear 
		 * WARNING: Wasn't tested on non-colinear lines that are missing each other.
		*/
		intersection(other: LineSegmentEquation): Vector3Extended | null {
			if (this.isColinear(other)) {
				return null;
			}
			//const t = (this.start._z * other.direction._x - this.start._x * other.direction._z - other.start._z * other.direction._x + other.start._x * other.direction._z) / (this.direction._x * other.direction._z - this.direction._z * other.direction._x);
			//return this.start.add(this.direction.scale(t));
			const cross = this.direction.cross(other.direction);
			const diff = other.start.subtract(this.start);
			const t = diff.cross(other.direction).dot(cross) / cross.dot(cross);
			return this.start.add(this.direction.scale(t));
		}
		/** Returns a new equation which is moved by a vector to a different position */
		translate(args: { both?: Vector3 | undefined, start?: Vector3 | undefined, end?: Vector3 | undefined }) {
			const { both, start, end } = args;
			return new LineSegmentEquation(this.start.add(start ?? new Vector3(0, 0, 0)).add(both ?? new Vector3(0, 0, 0)), this.end.add(end ?? new Vector3(0, 0, 0)).add(both ?? new Vector3(0, 0, 0)));
		}
		/** Returns a new line segment where start and end are moved by a distance, where the positive direction is from start to end */
		extend(start: number = 0, end: number = 0): LineSegmentEquation {
			return new LineSegmentEquation(this.getPointAt(start), this.getPointAt(this.length + end));
		}
	}

	class MatchingOptions {
		match3D: boolean = true;
		matchFootprint: boolean = true;
		toleranceOrMinimumCoincidence?: number = undefined;
		condition: (a: LongPartSegment, b: LongPartSegment) => boolean = () => true;
		constructor(partial: Partial<MatchingOptions> = {}) {
			Object.assign(this, partial);
		}
	}

	/**
	 * Uses the GenerationContour to extend the contour with an additional functionality
	 * for creating segments of long parts.
	 * Usage:
	 * 	1. Construct from a GenerationContour, this will plot the contour and transforming the plot to the world coordinates (@member worldPlot)
	 * 	2. Assign matchability to the individual sides using the @method addSide
	 *  3. Match the sides with the same sides on other segments using @method tryMatchNeighbourBySideCoincidence
	 *  4. Use the @method crawlAndAccumulateLength to accumulate the length of the matched segments
	 *  5. Go to a neighbour segment behind a side by the @method getNeighbourBySide
	 */
	class LongPartSegment {

		readonly generationContour: GenerationContour;
		readonly worldPlot: ContourEntryWorld[];
		neighbours: Map<CKind, LongPartSegmentEdge> = new Map();
		/** 
		 * List of other by their matching contour attribute under `CONTOUR_ATTRIBUTE_OWNER_ID` 
		 * The purpose is to indicate that they are coming from the same module 
		 */
		siblings: LongPartSegment[] = [];
		/** Space to store data during computations and processing. */
		additionalData: any = {};

		constructor(
			generationContour: GenerationContour,
		) {
			this.generationContour = generationContour;

			// plot the contour in world coordinates
			this.worldPlot = [];
			let lastEntryTypeM: ContourEntry | null = null;
			let x = 0;
			let y = 0;
			for (const entry of generationContour.contour._entries) {
				switch (entry.posType) {
					case 'M':
						x = entry.x!;
						y = entry.y!;
						lastEntryTypeM = entry;
						break;
					case 'L':
						x = entry.x!;
						y = entry.y!;
						break;
					case 'H':
						x = entry.x!;
						break;
					case 'V':
						y = entry.y!;
						break;
					case 'Z':
						if (!lastEntryTypeM) {
							// this actually should not be possible
							logError('Z entry without an M entry before. This should not happen. Fix this in the contour definition. Using default 0, 0.');
							x = 0;
							y = 0;
						} else {
							x = lastEntryTypeM.x!;
							y = lastEntryTypeM.y!;
						}
						break;
					default:
						logError(`Unsupported posType ${entry.posType}. Either only use M, L, H, V, Z in the contour definition or complement in the code above. Adding 0, 0.`);
						break;
				}
				this.worldPlot.push(new ContourEntryWorld(entry, generationContour, x, y));
			}
			/*
			 * Based on version of the API with which this has been developed, the first entry must be M and M can only be the first entry.
			 * Therefore, we can assume that if the last entry is Z, it can be collapsed down to the M, creating a closed contour with the 
			 * possibility to easily get all corner points.
			 */

			const first = this.worldPlot[0];
			const last = this.worldPlot[this.worldPlot.length - 1];
			if (first.kind === CKind.None && first.posType === 'M' && last.kind !== CKind.None && last.posType === 'Z') {
				this.worldPlot.pop();
				first.kind = last.kind;
			}

		}
		/**
		 * Initialize a side of the segment with a matching side on another segment.
		 * This creates an edge line segment equation from the contour entry that is of the given CKind.
		 * It can be checked for matching with another LongPartSegment
		 * @param side the side on this
		 * @param matchingSide a side or a list of sides' CKinds that are eligible for matching
		 * @returns existing or new edge
		 */
		getOrAddSide(side: CKind, matchingSide: CKind | CKind[] | undefined = undefined): LongPartSegmentEdge {
			const existingEdge = this.neighbours.get(side);
			if (existingEdge) {
				return existingEdge;
			}
			else {
				const newEdge = new LongPartSegmentEdge(side, this, matchingSide);
				this.neighbours.set(side, newEdge);
				return newEdge;
			}
		}
		/**
		 * Create a geometrical equation from the contour side.
		 * @param kind kind of the contour side to create the line segment equation from
		 * @returns
		 */
		createLineSegmentEquationFromContourSide(kind: CKind): LineSegmentEquation | undefined {
			const indexOfSideEnd = this.worldPlot.findIndex(entry => entry.kind === kind);
			if (indexOfSideEnd === -1) {
				return undefined;
			}
			const indexOfSideStart = indexOfSideEnd === 0 ? this.worldPlot.length - 1 : indexOfSideEnd - 1;
			const sideEnd = this.worldPlot[indexOfSideEnd].toVector3Extended();
			const sideStart = this.worldPlot[indexOfSideStart].toVector3Extended();
			return new LineSegmentEquation(sideStart, sideEnd);
		}
		/** Tries to match this line segment with others
		 * see `LongPartSegmentEdge.tryMatchNeighbourBySideCoincidence` 
		 */
		tryMatchNeighboursByFullSideCoincidence(others: LongPartSegment | LongPartSegment[], options: Partial<MatchingOptions> = {}) {
			const othersAsArray = Array.isArray(others) ? others : [others];
			for (const other of othersAsArray) {
				if (other === this) { continue; }
				for (const edge of this.neighbours.values()) {
					edge.tryMatchNeighbourByFullSideCoincidence(other, options);
				}
			}
		}
		tryMatchNeighboursByPartialCoincidence(others: LongPartSegment | LongPartSegment[], options: Partial<MatchingOptions> = {}) {
			const othersAsArray = Array.isArray(others) ? others : [others];
			for (const other of othersAsArray) {
				if (other === this) { continue; }
				for (const edge of this.neighbours.values()) {
					edge.tryMatchNeighbourByPartialCoincidence(other, options);
				}
			}
		}
		/** Tries to match this line segment with others
		 * see `LongPartSegmentEdge.tryMatchNeighbourByAxialContinuity` 
		 */
		tryMatchNeighboursByAxialContinuity(axialSide: CKind, others: LongPartSegment | LongPartSegment[], options: Partial<MatchingOptions> = {}) {
			const othersAsArray = Array.isArray(others) ? others : [others];
			for (const other of othersAsArray) {
				if (other === this) { continue; }
				for (const edge of this.neighbours.values()) {
					edge.tryMatchNeighbourByAxialContinuity(axialSide, other, options);
				}
			}
		}
		/**
		 * navigate to the neighbour segment by the contour side
		 * @param side 
		 * @returns null if no neighbour has been matched
		 */
		getNeighbourBySide(side: CKind): LongPartSegment | null {
			return this.neighbours.get(side)?.other ?? null;
		}
		/**
		 * Calculates a distance between two contour sides that are parallel
		 * @param side1 
		 * @param side2 
		 * @returns null if the sides are not parallel or the distance cannot be calculated
		 */
		getLengthBetweenParallelSides(side1: CKind, side2: CKind): number | null {
			const edge1 = this.neighbours.get(side1)?.edge;
			const edge2 = this.neighbours.get(side2)?.edge;
			if (!edge1 || !edge2) {
				return null;
			}
			if (!edge1.isParallel(edge2)) {
				return null;
			}
			return edge1.perpendicularDistanceOfPoint(edge2.start);
		}
		/**
		 * Crawls the segment and accumulates the length of the segment.
		 * Calls the getLengthBetweenParallelSides between start side and crawl direction side
		 * Then calls the same function on the neighbour segment in the crawl direction.
		 * @param startSide 
		 * @param crawlDirection 
		 * @param runningLength 
		 * @returns the accumulated length of the segments
		 */
		crawlAndAccumulateLength(startSide: CKind, crawlDirection: CKind, runningLength: number = 0): number {
			const length = this.getLengthBetweenParallelSides(startSide, crawlDirection) ?? 555;
			const nextSegment = this.getNeighbourBySide(crawlDirection);
			if (!nextSegment) {
				return runningLength + length;
			}
			return nextSegment.crawlAndAccumulateLength(startSide, crawlDirection, runningLength + length);
		}
		/**
		 * Returns a corner point of the segment by two sides
		 * @param side1 
		 * @param side2 
		 * @returns null if no such point is found
		 */
		getCornerPoint(side1: CKind, side2: CKind): ContourEntryWorld | null {
			const l = this.worldPlot.length;
			for (let i = 0; i < l; i++) {
				const point = this.worldPlot[i % l];
				const nextPoint = this.worldPlot[(i + 1) % l];
				if (
					point.kind === side1 && nextPoint.kind === side2
					|| point.kind === side2 && nextPoint.kind === side1
				) {
					return point;
				}
			}
			return null;
		}
		/**
		 * If `CONTOUR_ATTRIBUTE_OWNER_ID` is set on the contour, it tries to match the siblings of the segments.
		 * If there is a match, a reference is pushed to both sides, to the `siblings` array.
		 * @param others 
		 * @returns 
		 */
		tryMatchSiblings(others: LongPartSegment[] | LongPartSegment) {
			const othersAsArray = Array.isArray(others) ? others : [others];
			const ownerId = this.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_ID, CONTOUR_ATTRIBUTE_OWNER_ID);
			if (ownerId === CONTOUR_ATTRIBUTE_OWNER_ID) { return; }
			othersAsArray.forEach(o => {
				if (
					o !== this
					&& o.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_ID, CONTOUR_ATTRIBUTE_OWNER_ID) === ownerId
				) {
					if (this.siblings.indexOf(o) < 0) { this.siblings.push(o); }
					if (o.siblings.indexOf(this) < 0) { o.siblings.push(this); }
				}
			});
		}
		/**
		 * Helper function to not to have to write .generationContour.contour.attributes.get(CONTOUR_ATTRIBUTE_OWNER_ID) as * all the time
		 * @param attribute 
		 * @param defaultValue 
		 * @returns attribute value in the type of the default value or the default value if no such attribute is on the countertop
		 */
		getAttributeOrDefault(attribute: string, defaultValue: string | number): any {
			const attributeValue = this.generationContour.contour.attributes.get(attribute);
			if (attributeValue === undefined) { return defaultValue; }
			else {
				return attributeValue as typeof defaultValue;
			}
		}
	}

	/**
	 * Extends the ContourEntry from local space to world space.
	 * Applies a transformation to the ContourEntry to world using the generationContour.position
	 */
	class ContourEntryWorld extends ContourEntry {
		override x: number;
		override y: number;
		z: number;
		constructor(entry: ContourEntry, generationContour: GenerationContour, plottedX: number, plottedY: number) {
			super();
			const phi = -generationContour.position.rotationY * Math.PI / 180;
			this.x = (
				generationContour.position.x
				+ plottedX * Math.cos(phi) - plottedY * Math.sin(phi)
			);
			this.y = (
				generationContour.position.y
				+ generationContour.height
			);
			this.z = (
				generationContour.position.z
				+ plottedX * Math.sin(phi) + plottedY * Math.cos(phi)
			);
			this.kind = entry.kind;
			this.posType = entry.posType;
			this.attributes = entry.attributes;
		}
		toVector3Extended(): Vector3Extended {
			return new Vector3Extended(this.x, this.y, this.z);
		}
	}

	/**
	 * A matchable edge of the LongPartSegment, so that it can be matched with another segment at a given side.
	 * A pair of kind and matchingKinds is used to match the edge with another segment.
	 * Then the equations of the line segments are compared for coincidence.
	 * The same operation is being compared in 2D on the footprint, all matching neighbour segments are stored
	 * in the array `neighboursInFootprint`. Only one really matching neighbour is possible, under the reference `other`.
	 */
	class LongPartSegmentEdge {
		kind: CKind;
		matchingKinds: CKind[];
		edge: LineSegmentEquation | undefined;
		edgeInFootprint: LineSegmentEquation | undefined;
		other: LongPartSegment | null = null;
		neighboursInFootprint: LongPartSegment[] = [];
		readonly parent: LongPartSegment;

		/**
		 * 
		 * @param side CKind of the side which should be matched
		 * @param segment generation contour long part segment instance to which the side is assigned
		 * @param matchingSide CKind or array of CKinds that are eligible for matching
		 */
		constructor(
			side: CKind,
			segment: LongPartSegment,
			matchingSide: CKind | CKind[] | undefined,
		) {
			this.kind = side;
			if (!matchingSide) {
				this.matchingKinds = LongPartSegmentEdge.DefaultMatchingKinds[side];
			}
			else if (Array.isArray(matchingSide)) {
				this.matchingKinds = matchingSide;
			}
			else {
				this.matchingKinds = [matchingSide];
			}
			this.edge = segment.createLineSegmentEquationFromContourSide(side);
			this.edgeInFootprint = segment.createLineSegmentEquationFromContourSide(side)?.toFootprintEquation();
			this.parent = segment;
		}

		/**
		 * Tries to match the neighbour segment by finding a matching edge in the neighbour and comparing the line segment equations.
		 * If the line segments are coincident, the neighbour is stored in the `other` property.
		 * If the line segments are parallel, the neighbour is stored in the `neighboursInFootprint` array.
		 * @param other 
		 * @returns 
		 */
		tryMatchNeighbourByFullSideCoincidence(other: LongPartSegment, options: Partial<MatchingOptions> = {}) {
			const {
				toleranceOrMinimumCoincidence: tolerance = undefined,
				match3D,
				matchFootprint,
				condition,
			} = new MatchingOptions(options);
			const conditionResult = condition(this.parent, other);
			if (!conditionResult) { return; }
			if (this.other !== null || this.neighboursInFootprint.indexOf(other) > -1 || (!match3D && !matchFootprint)) { return; }
			const otherEdgesToTryMatching = this.matchingKinds.filter(kind => kind !== CKind.None && other.neighbours.has(kind));
			otherEdgesToTryMatching.forEach(kind => {
				const otherSide = other.neighbours.get(kind)!;
				const isFullyCoincident = this.edge!.isFullyCoincident(otherSide.edge!, tolerance);
				if (match3D && isFullyCoincident) {
					this.other = other;
					this.neighboursInFootprint.push(other);
					otherSide.other = this.parent;
					otherSide.neighboursInFootprint.push(this.parent);
					return;
				}
				if (!matchFootprint) { return; }
				const isFullyCoincidentInFootprint = isFullyCoincident || this.edgeInFootprint!.isFullyCoincident(otherSide.edgeInFootprint!, tolerance);
				if (isFullyCoincidentInFootprint) {
					this.neighboursInFootprint.push(other);
					otherSide.neighboursInFootprint.push(this.parent);
					return;
				}
			});
		}
		tryMatchNeighbourByPartialCoincidence(other: LongPartSegment, options: Partial<MatchingOptions> = {}) {
			const {
				toleranceOrMinimumCoincidence: minimumConcidence = 100,
				match3D,
				matchFootprint,
				condition,
			} = new MatchingOptions(options);
			const conditionResult = condition(this.parent, other);
			if (!conditionResult) { return; }
			if (this.other !== null || this.neighboursInFootprint.indexOf(other) > -1 || (!match3D && !matchFootprint)) { return; }
			const otherEdgesToTryMatching = this.matchingKinds.filter(kind => kind !== CKind.None && other.neighbours.has(kind));
			otherEdgesToTryMatching.forEach(kind => {
				const otherSide = other.neighbours.get(kind)!;
				const isPartiallyCoincident = (this.edge!.getCoincidenceLength(otherSide.edge!) ?? -999) > minimumConcidence;
				if (match3D && isPartiallyCoincident) {
					this.other = other;
					this.neighboursInFootprint.push(other);
					otherSide.other = this.parent;
					otherSide.neighboursInFootprint.push(this.parent);
					return;
				}
				if (!matchFootprint) { return; }
				const isPartiallyCoincidentInFootprint = isPartiallyCoincident || (this.edgeInFootprint!.getCoincidenceLength(otherSide.edgeInFootprint!) ?? -999) > minimumConcidence;
				if (isPartiallyCoincidentInFootprint) {
					this.neighboursInFootprint.push(other);
					otherSide.neighboursInFootprint.push(this.parent);
					return;
				}
			});
		}
		/**
		 * This is similar to @function tryMatchNeighbourBySideCoincidence, but here it is not checking for a full coincidence of line segments.
		 * Instead, the neighbour edges have to have a minimum concidence length and an axis must be continuous among them.
		 * This means, that i.e. CKind.Left and CKind.Right edges still have to touch each other, but an edge of axialSide has to be continuous,
		 * which is checked by method `LineSegmentEquation.continuesWith` that is defined as true if colinear and touching.
		 * @param axialSide 
		 * @param other 
		 * @param minimumConcidenceLength 
		 * @returns 
		 */
		tryMatchNeighbourByAxialContinuity(axialSide: CKind, other: LongPartSegment, options: Partial<MatchingOptions>) {
			const {
				toleranceOrMinimumCoincidence: minimumConcidenceLength = 10,
				match3D,
				matchFootprint,
				condition,
			} = new MatchingOptions(options);
			const conditionResult = condition(this.parent, other);
			if (!conditionResult) { return; }
			if (this.other !== null || this.neighboursInFootprint.indexOf(other) > -1 || (!match3D && !matchFootprint)) { return; }
			const otherEdgesToTryMatching = this.matchingKinds.filter(kind => kind !== CKind.None && kind !== axialSide && other.neighbours.has(kind));
			const ownAxialSide = this.parent.getOrAddSide(axialSide);
			otherEdgesToTryMatching.forEach(kind => {
				const otherAxialSide = other.getOrAddSide(axialSide);
				const otherTraverseSide = other.neighbours.get(kind)!;
				const concidenceLength = this.edge!.getCoincidenceLength(otherTraverseSide.edge!);
				const isContinuous = ownAxialSide.edge!.continuesWith(otherAxialSide.edge!, Vector3Extended.EPS);
				if (match3D && isContinuous && (concidenceLength ?? -9999) > minimumConcidenceLength) {
					this.other = other;
					this.neighboursInFootprint.push(other);
					otherTraverseSide.other = this.parent;
					otherTraverseSide.neighboursInFootprint.push(this.parent);
					return;
				}
				if (!matchFootprint) { return; }
				const coincidenceLengthInFootprint = concidenceLength ?? this.edgeInFootprint!.getCoincidenceLength(otherTraverseSide.edgeInFootprint!);
				const isContinuousInFootprint = isContinuous ?? ownAxialSide.edgeInFootprint!.continuesWith(otherAxialSide.edgeInFootprint!);
				if (isContinuousInFootprint && (coincidenceLengthInFootprint ?? -9999) > minimumConcidenceLength) {
					this.neighboursInFootprint.push(other);
					otherTraverseSide.neighboursInFootprint.push(this.parent);
					return;
				}
			});
		}

		static DefaultMatchingKinds = {
			[CKind.Left]: [CKind.Right],
			[CKind.Right]: [CKind.Left],
			[CKind.Front]: [CKind.Back],
			[CKind.Back]: [CKind.Front],
			[CKind.None]: [CKind.None],
		}
	}



	/**
	 * Evaluates the size of the perpendicular part of a corner unit straight segment.
	 * 
	 * Corner unit straight segments have defined size on the straight part of the corner (that is the part that is the cabinet).
	 * However, on the perpendicular side (the filler part), the size is not defined directly, but we can get into two situations:
	 * 1. There is a neighbour -> take the size from the neighbour segment's straight part.
	 * 		Note: It could be that two corners dock by their fillers; I have not not handled this case, as it is not expected in real life.
	 * 2. There is no neighbour -> Assume that the depth of the contour is the same as the depth of the straight part contour.
	 * 		(We probably want to use the same depth of the countertop etc. as on the straight part)
	 * Then, the segment lengths and depths need to be evaluated based on the intersection point of the back sides of the straight and perpendicular parts.
	 * 
	 * @param cornerUnitStraightSegment The corner unit straight segment to evaluate.
	 * @param straightPartDepthEvaluator A function that takes a long part segment and returns the depth of its straight part (this can be different for different contour types)
	 * @param contourFrontOverhangValue An optional value to add to the depth of the perpendicular part (e.g. for front overhangs). This is necessary to compute some additional helper geometry correctly. I.e. mod_CountertopOverhangFront for Countertops
	 * @param lengthAttributeName The name of the attribute in additionalData where the length of the segment is stored. Default is 'segmentLength'. This is where the result will be stored.
	 * @param depthAttributeName The name of the attribute in additionalData where the depth of the segment is stored. Default is 'segmentDepth'. This is where the result will be stored.
	 * @param displaceOriginXAttributeName The name of the attribute in additionalData where the displaceOriginX of the segment is stored. Default is 'displaceOriginX'. This is where the result will be stored.
	 * @returns An object containing the lengths and depths of the perpendicular part.
	 * @throws Error if the provided segment is not a corner unit straight segment.
	 * @throws Error if the mod_CarcaseDirection attribute is not valid because the values change to be different from 'Left' and 'Right'.
	 */
	const evaluateCornerUnitStraightSizeOfPerpendicularPart = (
		cornerUnitStraightSegment: LongPartSegment,
		contourFrontOverhangValue: number = 0,
		lengthAttributeName: string = 'segmentLength',
		depthAttributeName: string = 'segmentDepth',
		displaceOriginXAttributeName: string = 'displaceOriginX',
	): {
		leftCornerPart: LongPartSegment,
		rightCornerPart: LongPartSegment,
		straightCornerPart: LongPartSegment,
		perpendicularCornerPart: LongPartSegment,
	} => {
		// CKind and mod_CarcaseDirection have the same values coincidentally, so let's use them as enums. If they change, this code will throw.
		const left = CKind.Left;
		const right = CKind.Right;

		const isCorner: boolean = cornerUnitStraightSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined owner type') === mr_CornerunitStraight;
		if (!isCorner) {
			throw new Error('evaluateCornerUnitStraightSizeOfPerpendicularPart called on a segment that is not a corner unit straight segment.');
		}
		const cornerContourType = cornerUnitStraightSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'not a corner');
		const argumentIsStraightCornerPart = cornerContourType === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT;
		/** The attribute of the corner unit */
		const mod_CarcaseDirection = cornerUnitStraightSegment.getAttributeOrDefault('mod_CarcaseDirection', 'undefined direction');
		if ([left, right].indexOf(mod_CarcaseDirection) < 0) {
			throw new Error(`evaluateCornerUnitStraightSizeOfPerpendicularPart called on a corner unit straight segment with invalid mod_CarcaseDirection: ${mod_CarcaseDirection}. Expected values: ['${left}', '${right}'], got ${mod_CarcaseDirection}. If the values changed from 'Left' and 'Right', please update the code accordingly.`);
		}
		// Corner provides two parts of the countertop, we need first to compute both contributions.
		// For this, we need to find the perpendicular and straight part of the corner.
		// The cornerunit straight sends two contours, one for the straight part, one for the perpendicular part.
		// We have one of them, the other is its sibling, which we can assume reliably to exist and we can safely use the ! operator.
		const sibling = cornerUnitStraightSegment.siblings.find((s: any) => s.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'no corner') === mr_CornerunitStraight)!;
		// Get to know which is which and define it accordingly
		const straightCornerPart: LongPartSegment = argumentIsStraightCornerPart ? cornerUnitStraightSegment : sibling;
		const perpendicularCornerPart: LongPartSegment = argumentIsStraightCornerPart ? sibling : cornerUnitStraightSegment;
		const leftCornerPart = mod_CarcaseDirection === left ? perpendicularCornerPart : straightCornerPart;
		const rightCornerPart = mod_CarcaseDirection === left ? straightCornerPart : perpendicularCornerPart;

		// if the perpendicular part has a neighbour, take depth from the neighbour; otherwise we assume that the straight and perpendicular depths are the same
		const straightPartDockSide = mod_CarcaseDirection === left ? right : left;
		const perpendicularPartDockSide = mod_CarcaseDirection === left ? left : right;
		const perpendicularPartNeighbour = perpendicularCornerPart.neighbours.get(perpendicularPartDockSide)!.other;

		perpendicularCornerPart.additionalData[depthAttributeName] = perpendicularPartNeighbour?.additionalData[depthAttributeName] ?? straightCornerPart.additionalData[depthAttributeName];

		// Get the meeting point of the back sides
		// Compute the length or the corner part. First, we compute them in a way that they are extended so that their backwalls meet at the corner of the assumed wall
		// We make a line segment of the straight backwall from BL to BR corner:
		const straightBackSide = new LineSegmentEquation(
			// more robust, doesn't rely on contour winding order, than using the getOrAddSide method
			// also it is more confident later for computing the displaceOriginX
			straightCornerPart.getCornerPoint(CKind.Left, CKind.Back)!.toVector3Extended(),
			straightCornerPart.getCornerPoint(CKind.Right, CKind.Back)!.toVector3Extended()
		);
		// We don't have a contour on the back side of the perpendicular part to create the line segmnet.
		// We get an oriented line segment of the docking side in the direction front front to back.
		const perpendicularDockingSideLineSegment = new LineSegmentEquation(
			perpendicularCornerPart.getCornerPoint(perpendicularPartDockSide, CKind.Front)!.toVector3Extended(),
			perpendicularCornerPart.getCornerPoint(perpendicularPartDockSide, CKind.Back)!.toVector3Extended()
		);
		// Then, we use it to compute a coordinate of a point that belongs to the back side at its depth.
		const perpendicularPartBackEdgePoint = perpendicularDockingSideLineSegment.getPointAt(
			perpendicularCornerPart.additionalData.segmentDepth
			- contourFrontOverhangValue // the overhang is already included on the front; it needs to be subtracted, otherwise it'll be counted twice
		);
		const perpendicularPartBackside = new LineSegmentEquation(perpendicularPartBackEdgePoint, perpendicularCornerPart.neighbours.get(CKind.Front)!.edge!.direction.add(perpendicularPartBackEdgePoint));
		// and now we can get the point of intersection of the back sides
		const intersectionOfBacksides = straightBackSide.intersection(perpendicularPartBackside)!;
		// and finally, we can get the length of the corner parts:
		const straightPartEdge = straightCornerPart.neighbours.get(straightPartDockSide)!.edge!;
		straightCornerPart.additionalData[lengthAttributeName] = straightPartEdge.perpendicularDistanceOfPoint(intersectionOfBacksides);
		perpendicularCornerPart.additionalData[lengthAttributeName] = perpendicularCornerPart.neighbours.get(perpendicularPartDockSide)!.edge!.perpendicularDistanceOfPoint(intersectionOfBacksides);

		// Compute the displacement origin X for the straight part. This is needed because in this case, the origin of the part on the contour shifts along X.
		if (mod_CarcaseDirection === 'Left' && intersectionOfBacksides) {
			straightCornerPart.additionalData[displaceOriginXAttributeName] += straightBackSide.getParameterOfPoint(intersectionOfBacksides);
		}

		return {
			leftCornerPart,
			rightCornerPart,
			straightCornerPart,
			perpendicularCornerPart,
		}
	}

	return {
		Vector3Extended,
		LineSegmentEquation,
		LongPartSegment,
		LongPartSegmentEdge,
		evaluateCornerUnitStraightSizeOfPerpendicularPart,
		/** @deprecated An attribute to mark, that this contour segment is not able to define countertop depth. Usage: corner perpendicular part. */
		CONTOUR_ATTRIBUTE_OWNER_ID,
		CONTOUR_ATTRIBUTE_ADD_COUNTERTOP,
		CONTOUR_ATTRIBUTE_ADD_TOEKICK,
		CONTOUR_ATTRIBUTE_DOES_NOT_DEFINE_DEPTH,
		CONTOUR_ATTRIBUTE_OWNER_TYPE,
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE,
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT,
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR,
		mr_CornerunitStraight,
		mr_StorageunitSingle,
		/** @deprecated
		 * there is a typo in this one ... use `mr_StorageunitSingle` instead 
		 * */
		mr_StorateunitSingle: mr_StorageunitSingle,
		mr_Upright,
		mr_Filler01,
	}
}