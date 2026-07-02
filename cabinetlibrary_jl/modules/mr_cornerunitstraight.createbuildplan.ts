	// Schuler Consulting
	// Create: February 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// Insert the contours for the generation modules
	//
	// Revisions:
	//
	//======================================================================


	//======================================================================
	// Countertop
	//======================================================================

	const {
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE,
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT,
		CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR,
		CONTOUR_ATTRIBUTE_OWNER_ID,
		CONTOUR_ATTRIBUTE_OWNER_TYPE,
		CONTOUR_ATTRIBUTE_ADD_TOEKICK,
		mr_CornerunitStraight,
	} = GlobalFunc.process_MathLongparts();

	const mf_CornerFillerFront = this.m.find((p) => p instanceof OD_M_mf_CornerFillerFront) as OD_M_mf_CornerFillerFront;
	let FillerWidthLeft = mf_CornerFillerFront?.mod_WidthLeft ?? 0;
	let FillerWidthRight = mf_CornerFillerFront?.mod_WidthRight ?? 0;

	const PlinthAreaType = this.mod_PlinthAreaDesign_matrix.PlinthAreaType ?? 'None';
	const plinthAreaHeight = (PlinthAreaType !== 'None' ? (this.mod_PlinthAreaHeight ?? 0) : 0);

	const countertopContourBounds = {
		xMin: 0,
		xMid: (
			this.mod_CarcaseDirection === 'Right'
				? (
					this.mod_CornerunitFrontWidth
					+ FillerWidthLeft
				)
				: (
					this.mod_Width
					- this.mod_CornerunitFrontWidth
					- FillerWidthRight
				)
		),
		xMax: this.mod_Width,
		zMin: Math.min(
			0,
			-this.mod_CarcaseDistanceWall,
		),
		zMid: this.mod_Depth,
		zMax: (
			this.mod_Depth
			+ (
				this.mod_CarcaseDirection === 'Right'
					? FillerWidthRight
					: FillerWidthLeft
			)
		),
		h: this.mod_Height + plinthAreaHeight,
	};

	//======================================================================
	// Countertop
	//======================================================================


	const contourCountertopStraightPart = Contour
		.M(countertopContourBounds.xMin, countertopContourBounds.zMin)
		.L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
		.L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMid)
		.L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMid)
		.Z(CKind.Left)
		;
	// This actually decides if the countertop should really be added.
	contourCountertopStraightPart.attributes
		.set('mod_CarcaseDirection', this.mod_CarcaseDirection)
		.set('mod_CarcaseVisLeft', this.mod_CarcaseVisLeft ? 1 : 0)
		.set('mod_CarcaseVisRight', this.mod_CarcaseVisRight ? 1 : 0)
		.set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
		.set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
		.set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT)
		;



	const contourCountertopPerpendicularPart = this.mod_CarcaseDirection === 'Right'
		? (Contour
			.M(countertopContourBounds.xMax, countertopContourBounds.zMin)
			.L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMax)
			.L(CKind.Right, countertopContourBounds.xMid, countertopContourBounds.zMax)
			.L(CKind.Front, countertopContourBounds.xMid, countertopContourBounds.zMin)
			.Z(CKind.Left)
		) : (Contour
			.M(countertopContourBounds.xMin, countertopContourBounds.zMax)
			.L(CKind.Back, countertopContourBounds.xMin, countertopContourBounds.zMin)
			.L(CKind.Right, countertopContourBounds.xMid, countertopContourBounds.zMin)
			.L(CKind.Front, countertopContourBounds.xMid, countertopContourBounds.zMax)
			.Z(CKind.Left)
		);
	// This actually decides if the countertop should really be added.
	contourCountertopPerpendicularPart.attributes
		.set('mod_CarcaseDirection', this.mod_CarcaseDirection)
		.set('mod_CarcaseVisLeft', this.mod_CarcaseVisLeft ? 1 : 0)
		.set('mod_CarcaseVisRight', this.mod_CarcaseVisRight ? 1 : 0)
		.set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
		.set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
		.set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR)
		;

	if (this.mod_CreateCountertop) {
		this.addGenerationContour(
			GenerationMethod.Countertop,
			countertopContourBounds.h,
			contourCountertopStraightPart,
		);

		this.addGenerationContour(
			GenerationMethod.Countertop,
			countertopContourBounds.h,
			contourCountertopPerpendicularPart,
		);
	}

	// ===============
	// Backsplash
	// ===============

	if (this.mod_CreateBacksplash) {
		const backsplashTopY = countertopContourBounds.h + (this.mod_CreateCountertop ? this.mod_CountertopThk : 0);
		this.addGenerationContour(
			GenerationMethod.Backsplash,
			backsplashTopY,
			contourCountertopStraightPart,
		);

		this.addGenerationContour(
			GenerationMethod.Backsplash,
			backsplashTopY,
			contourCountertopPerpendicularPart,
		);
	}

	//======================================================================
	// Paneltop
	//======================================================================

	if (this.mod_CreatePaneltop) {

	}

	//======================================================================
	// Fingergrip (gola)
	//======================================================================

	if (this.mod_CreateFingergrip) {

		// collect middle fingergrips, based on corner direction, add them between min and max on x
		const mc = this.m.find(p => p instanceof OD_M_mc_Storageunit01) as any;
		if (mc) {
			const middleFingergripPositions = [
				mc.mod_FingergripPos1 ?? 0,
				mc.mod_FingergripPos2 ?? 0,
				mc.mod_FingergripPos3 ?? 0,
				mc.mod_FingergripPos4 ?? 0,
				mc.mod_FingergripPos5 ?? 0,
			].filter(p => p !== undefined && p > 0) as number[];

			if (middleFingergripPositions.length > 0) {

				const middleFingergripContourBounds = {
					xMin: this.mod_CarcaseDirection === 'Right' ? 0 : this.mod_Width - this.mod_CornerunitFrontWidth,
					xMax: this.mod_CarcaseDirection === 'Right' ? this.mod_CornerunitFrontWidth : this.mod_Width,
					zMin: countertopContourBounds.zMin,
					zMax: countertopContourBounds.zMax,
				}

				middleFingergripPositions.forEach((pos) => {

					const fingergripContour = Contour
						.M(middleFingergripContourBounds.xMin, middleFingergripContourBounds.zMin)
						.L(CKind.Back, middleFingergripContourBounds.xMax, middleFingergripContourBounds.zMin)
						.L(CKind.Right, middleFingergripContourBounds.xMax, middleFingergripContourBounds.zMax)
						.L(CKind.Front, middleFingergripContourBounds.xMin, middleFingergripContourBounds.zMax)
						.Z(CKind.Left)
						;

					fingergripContour.attributes
						.set('mod_FingergripPostype', 'Middle')
						.set('mod_FingergripType', mc.mod_FingergripType ?? 'None')
						;

					this.addGenerationContour(
						GenerationMethod.Fingergrip,
						pos + plinthAreaHeight,
						fingergripContour,
					);
				});
			}

			if (mc.mod_FingergripTop) {

				const h = mc.mod_CarcaseHeight - mc.mod_FingergripType_matrix.LShapeHeight + plinthAreaHeight;

				const profileThickness = this.mod_FingergripType_matrix.LShapeDepth ?? 0;

				let fingergripContourStraight: Contour;
				let fingergripContourPerpendicular: Contour;

				if (this.mod_CarcaseDirection === 'Right') {

					fingergripContourStraight = Contour
						.M(countertopContourBounds.xMin, countertopContourBounds.zMin)
						.L(CKind.Back, countertopContourBounds.xMid + profileThickness, countertopContourBounds.zMin)
						.L(CKind.Right, countertopContourBounds.xMid + profileThickness, countertopContourBounds.zMid)
						.L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMid)
						.Z(CKind.Left)
						;

					fingergripContourPerpendicular = Contour
						.M(countertopContourBounds.xMax, countertopContourBounds.zMid - profileThickness)
						.L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMax)
						.L(CKind.Right, countertopContourBounds.xMid, countertopContourBounds.zMax)
						.L(CKind.Front, countertopContourBounds.xMid, countertopContourBounds.zMid - profileThickness)
						.Z(CKind.Left)
						;

				}
				else {

					fingergripContourStraight = Contour
						.M(countertopContourBounds.xMid - profileThickness, countertopContourBounds.zMin)
						.L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
						.L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMid)
						.L(CKind.Front, countertopContourBounds.xMid - profileThickness, countertopContourBounds.zMid)
						.Z(CKind.Left)
						;

					fingergripContourPerpendicular = Contour
						.M(countertopContourBounds.xMin, countertopContourBounds.zMax)
						.L(CKind.Back, countertopContourBounds.xMin, countertopContourBounds.zMid - profileThickness)
						.L(CKind.Right, countertopContourBounds.xMid, countertopContourBounds.zMid - profileThickness)
						.L(CKind.Front, countertopContourBounds.xMid, countertopContourBounds.zMax)
						.Z(CKind.Left)
						;

				}

				fingergripContourStraight.attributes
					.set('mod_FingergripPostype', 'Top')
					.set('mod_FingergripType', mc.mod_FingergripType ?? 'None')
					;

				fingergripContourPerpendicular.attributes
					.set('mod_FingergripPostype', 'Top')
					.set('mod_FingergripType', mc.mod_FingergripType ?? 'None')
					;

				this.addGenerationContour(
					GenerationMethod.Fingergrip,
					h,
					fingergripContourStraight,
				);

				this.addGenerationContour(
					GenerationMethod.Fingergrip,
					h,
					fingergripContourPerpendicular,
				);
			}

		}

		// if fingergriptop, add two - between side and frontwidth + fillerwidth, then between depth and depth + fillerdepth

	}

	//======================================================================
	// Toekick
	//======================================================================

	// Seems sufficient without the isOnFloor check, but can be added later if needed.
	// const isOnFloor = this.getFullOrigin()._y < 1;
	const createToekick =
		// THIS CONDITION MUST BE IN PLACE !!!!!
		// WITHOUT THE WALL UNITS CREATE ERRORS !!!!!
		(this.mod_CreateToekick ?? false)
		// && isOnFloor
		&& this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None'
		;

	if (this.mod_CreateToekick && this.mod_PlinthAreaDesign != "10") {

		// Retrieve the positions of the legs
		let legPositionInfo;
		try {
			legPositionInfo = JSON.parse(this.mod_PlinthAreaPositionInfo[0]);
		}
		catch {
			logError(`Could not parse this.mod_PlinthAreaPositionInfo[0] in mr_CornerunitStraight ${this._id}. Toekick will not be recessed correctly.`)
			legPositionInfo = undefined;
		}
		// legPositionInfo.LineLeft  (In case this.mod_PlinthAreaVisLeft == true)
		// legPositionInfo.LineRight  (In case this.mod_PlinthAreaVisRight == true)
		// legPositionInfo.LineFront
		// legPositionInfo.LineBack (Probably not needed)

		const LineLeft = legPositionInfo?.LineLeft ?? 0;
		const LineRight = legPositionInfo?.LineRight ?? 0;
		const LineFront = legPositionInfo?.LineFront ?? 0;
		const LineBack = legPositionInfo?.LineBack ?? 0;
		const mod_PlinthAreaVisLeft = this.mod_PlinthAreaVisLeft ?? false;
		const mod_PlinthAreaVisRight = this.mod_PlinthAreaVisRight ?? false;


		const toekickContourBounds = {
			xMin: countertopContourBounds.xMin + (
				this.mod_CarcaseDirection === 'Right'
					? 0
					: (this.mod_CarcaseVisLeft ? LineLeft : 0)
			),
			xMid: (
				this.mod_CarcaseDirection === 'Right'
					? (
						this.mod_CornerunitFrontWidth
						+ FillerWidthLeft
						+ LineFront
					)
					: (
						this.mod_Width
						- this.mod_CornerunitFrontWidth
						- FillerWidthRight
						- LineFront
					)
			),
			xMax: countertopContourBounds.xMax + (
				this.mod_CarcaseDirection === 'Right'
					? (this.mod_CarcaseVisRight ? LineRight : 0)
					: 0
			),
			zMin: LineBack,
			zMid: this.mod_Depth - LineFront,
			zMax: (
				this.mod_Depth
				+ (
					this.mod_CarcaseDirection === 'Right'
						? FillerWidthRight
						: FillerWidthLeft
				)
				- (
					this.mod_CarcaseDirection === 'Right'
						? (this.mod_CarcaseVisRight ? LineRight : 0)
						: (this.mod_CarcaseVisLeft ? LineLeft : 0)
				)
			),
			h: plinthAreaHeight,
		};

		const contourToekickStraightPart = Contour
			.M(toekickContourBounds.xMin, toekickContourBounds.zMin)
			.L(CKind.Back, toekickContourBounds.xMax, toekickContourBounds.zMin)
			.L(CKind.Right, toekickContourBounds.xMax, toekickContourBounds.zMid)
			.L(CKind.Front, toekickContourBounds.xMin, toekickContourBounds.zMid)
			.Z(CKind.Left)
			;

		contourToekickStraightPart.attributes
			.set('mod_CarcaseDirection', this.mod_CarcaseDirection)
			.set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
			.set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
			.set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
			.set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, createToekick ? 1 : 0)
			.set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
			.set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT)
			;

		this.addGenerationContour(
			GenerationMethod.Toekick,
			toekickContourBounds.h,
			contourToekickStraightPart,
		);

		const contourToekickPerpendicularPart = this.mod_CarcaseDirection === 'Right'
			? (Contour
				.M(toekickContourBounds.xMax, toekickContourBounds.zMin)
				.L(CKind.Back, toekickContourBounds.xMax, toekickContourBounds.zMax)
				.L(CKind.Right, toekickContourBounds.xMid, toekickContourBounds.zMax)
				.L(CKind.Front, toekickContourBounds.xMid, toekickContourBounds.zMin)
				.Z(CKind.Left)
			) : (Contour
				.M(toekickContourBounds.xMin, toekickContourBounds.zMax)
				.L(CKind.Back, toekickContourBounds.xMin, toekickContourBounds.zMin)
				.L(CKind.Right, toekickContourBounds.xMid, toekickContourBounds.zMin)
				.L(CKind.Front, toekickContourBounds.xMid, toekickContourBounds.zMax)
				.Z(CKind.Left)
			);
		// This actually decides if the countertop should really be added.
		contourToekickPerpendicularPart.attributes
			.set('mod_CarcaseDirection', this.mod_CarcaseDirection)
			.set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
			.set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
			.set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
			.set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, createToekick ? 1 : 0)
			.set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
			.set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR)
			;

		this.addGenerationContour(
			GenerationMethod.Toekick,
			toekickContourBounds.h,
			contourToekickPerpendicularPart,
		);
	}
