process_CarcasePartConnection(
	ncElement: any, 
	partSelf: any, 
	part2: any, 
	posRel: any, 
	Area: string, 
	PartType: string, 
	DrillingArea: string, 
	TouchDirectionGraphic: string, 
	FallingDirection: string, 
	ConnectionOrientation: string, 
	ConnectionType: string, 
	FittingType: string,
	InsideDirection: string,
	DrillingPartType: string
){

	//###############################################################################################################
	// Initialization
	//###############################################################################################################

	// Initialize variables
	let ParentModule = partSelf.pa_ParentName;
	let TypeElement = partSelf.pa_TypeElement;
	let HardwareColor = partSelf.pa_HardwareColor;

	// Touch dimensions
	let [TouchLength, TouchWidth] = calculateTouchDimensions();

	// Find parts and Connection
	let CarcasePartConnection = GlobalFunc.find_CarcasePartConnectionMapping(ParentModule, TypeElement, Area, ConnectionType, FittingType, HardwareColor)

	//###############################################################################################################
	// Main procedure
	//###############################################################################################################

	// Check if the touch dimension were calculated correctly
	if (TouchLength > 0 && TouchWidth > 0) {

		try {

			//====================================================================
			// Outer Cycle for different connections (Minifix / Dowel)
			//====================================================================

			CarcasePartConnection.forEach(Connect => {

				//Inside/Outside variable 
				let HardwareFixed = Connect.HardwareFixed;

				// Find Settings for drillings and hardware
				let CarcasePartConnectionSettings = GlobalFunc.find_PartConnectionSettings(Connect.ConnectionHardwarePositioning!, TouchLength, TouchWidth)

				// Process Descriptor
				let LengthPositions = GlobalFunc.process_Descriptor(CarcasePartConnectionSettings.LengthDescriptor!, TouchLength);
				let WidthPositions = GlobalFunc.process_Descriptor(CarcasePartConnectionSettings.WidthDescriptor!, TouchWidth);

				// Cycle for WidthPosition descriptor (Actually we can not cover multiple drills in width direction)
				let widthPosition: number;
				WidthPositions.forEach(position => {
					widthPosition = position;
				});

				//====================================================================
				// Inner Cycle for descriptors (Different positions of the fitting)
				//====================================================================

				LengthPositions.forEach(position => {

					// Find Object 
					let Object = GlobalFunc.find_ObjectMapping(Connect.Object!);

					// Find ProcessingItem
					let ProcessingItem = GlobalFunc.find_ProcessingMapping(Object.ProcessingItem!);

					// Find GraphicItem
					let GraphicItem = GlobalFunc.find_GraphicLibraryMapping(Object.GraphicItem!);

					// Cycle for the drills
					ProcessingItem.forEach(Drill => {

						//====================================================================
						// Add Vertical Drill
						//====================================================================

						if (Drill.ProcessingLibrary == "DrillVertical") {
							let DrillLibVert = GlobalFunc.find_HardwareDrillVertLibrary(Drill.ProcessingId!, DrillingPartType)

							DrillLibVert.forEach(DrillPosition => {

								// Get the drill data from the table
								//--------------------------------------------------------------------	

								let drillData = ct_tab_CarcasePartConnectionCalculations.find(p =>
									p.in_DrillType == 'DrillVertical' &&
									p.in_PartType == PartType &&
									p.in_DrillingArea == DrillingArea &&
									p.in_TouchDirection == TouchDirectionGraphic &&
									p.in_InsideDirection == InsideDirection &&
									p.in_HardwarePosition == HardwareFixed! &&
									p.in_FallingDirection == FallingDirection &&
									p.in_ConnectionOrientation == ConnectionOrientation
								);

								if (drillData == undefined) {
									let Text = "DrillVertical - " + PartType + " - " + DrillingArea + " - " + TouchDirectionGraphic + " - " + InsideDirection + " - " + HardwareFixed + " - " + FallingDirection + " - " + ConnectionOrientation;
									let ErrorMessage = GlobalFunc.find_ErrorList('Error 40004',1)
									logError(ErrorMessage.Message(Text));
								}
								else {
									// Calculations
									//--------------------------------------------------------------------

									let positionWidth = widthPosition;
									if (DrillPosition.XA > 0) {
										positionWidth = DrillPosition.XA;
									}

									// Variables for the graphics
									let gPosX = drillData.GraphicPosX(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gPosY = drillData.GraphicPosY(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gPosZ = drillData.GraphicPosZ(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gDimX = drillData.GraphicDimX(DrillPosition);
									let gDimY = drillData.GraphicDimY(DrillPosition);
									let gDimZ = drillData.GraphicDimZ(DrillPosition);
									let extrusionMode = drillData?.GraphicExtrusion;

									// Add NC-element
									//--------------------------------------------------------------------

									let DrillVert = ncElement.addncout_DrillVert();
									DrillVert.nc_TOOL = "102";
									DrillVert.nc_XA = drillData?.NcPosX(partSelf, gPosX, gPosY, gPosZ);
									DrillVert.nc_YA = drillData?.NcPosY(partSelf, gPosX, gPosY, gPosZ);
									DrillVert.nc_TI = DrillPosition.TI;
									DrillVert.nc_DU = DrillPosition.DU;
									DrillVert.nc_BM = DrillPosition.matrix_BM || "LS"
									DrillVert.nc_WI = DrillPosition.matrix_WI ?? 0;
									DrillVert.nc_AB = DrillPosition.matrix_AB ?? 1;
									DrillVert.nc_LA = DrillPosition.matrix_LA ?? 0;
									DrillVert.nc_MI = DrillPosition.matrix_MI ?? 0;
									DrillVert.nc_KO = DrillPosition.matrix_KO || "00";
									DrillVert.nc_Side = drillData.NcSide;

									// Add drawing
									//--------------------------------------------------------------------

									let drilling01 = partSelf.add3DElement('Drilling01', DrillVert, gPosX, gPosY, gPosZ, gDimX, gDimY, gDimZ);
									drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + DrillPosition.DU! / 2 + '" /></svg>', extrusionMode);
								}
							})
						}

						//====================================================================
						// Add Horizontal Drill
						//====================================================================

						else if (Drill.ProcessingLibrary == "DrillHorizontal") {
							let DrillLibHor = GlobalFunc.find_HardwareDrillHorLibrary(Drill.ProcessingId!, DrillingPartType)

							DrillLibHor.forEach(DrillPosition => {

								// Get the drill data from the table
								//--------------------------------------------------------------------	

								let drillData = ct_tab_CarcasePartConnectionCalculations.find(p =>
									p.in_DrillType == 'DrillHorizontal' &&
									p.in_PartType == PartType &&
									p.in_DrillingArea == DrillingArea &&
									p.in_TouchDirection == TouchDirectionGraphic &&
									p.in_InsideDirection == InsideDirection &&
									p.in_HardwarePosition == HardwareFixed! &&
									p.in_FallingDirection == FallingDirection &&
									p.in_ConnectionOrientation == ConnectionOrientation
								);

								if (drillData == undefined) {
									let Text = "DrillHorizontal - " + PartType + " - " + DrillingArea + " - " + TouchDirectionGraphic + " - " + InsideDirection + " - " + HardwareFixed + " - " + FallingDirection + " - " + ConnectionOrientation;
									let ErrorMessage = GlobalFunc.find_ErrorList('Error 40004',1)
									logError(ErrorMessage.Message(Text));
								}
								else {
									// Calculations
									//--------------------------------------------------------------------

									let positionWidth = widthPosition;
									if (DrillPosition.ZA > 0) {
										positionWidth = DrillPosition.ZA;
									}

									// Variables for the graphics
									let gPosX = drillData.GraphicPosX(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gPosY = drillData.GraphicPosY(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gPosZ = drillData.GraphicPosZ(partSelf, part2, posRel, DrillPosition, positionWidth, position, TouchLength, TouchWidth);
									let gDimX = drillData.GraphicDimX(DrillPosition);
									let gDimY = drillData.GraphicDimY(DrillPosition);
									let gDimZ = drillData.GraphicDimZ(DrillPosition);
									let extrusionMode = drillData.GraphicExtrusion;

									// Add NC-element
									//--------------------------------------------------------------------

									let DrillHor = ncElement.addncout_DrillHor();
									DrillHor.nc_TOOL = "103";
									DrillHor.nc_XA = drillData.NcPosX(partSelf, gPosX, gPosY, gPosZ);
									DrillHor.nc_YA = drillData.NcPosY(partSelf, gPosX, gPosY, gPosZ);
									DrillHor.nc_ZA = drillData.NcPosZ(partSelf, gPosX, gPosY, gPosZ);
									DrillHor.nc_BM = drillData.DrillDirection;
									DrillHor.nc_TI = DrillPosition.TI;
									DrillHor.nc_DU = DrillPosition.DU;
									DrillHor.nc_KO = DrillPosition.matrix_KO || "00";
									DrillHor.nc_Side = drillData.NcSide;

									// Add drawing
									//--------------------------------------------------------------------

									let drilling02 = partSelf.add3DElement('Drilling01', DrillHor, gPosX, gPosY, gPosZ, gDimX, gDimY, gDimZ);
									drilling02.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + DrillPosition.DU! / 2 + '" /></svg>', extrusionMode);
								}
							})
						}
					})
				})
			})
		}
		catch (error: any) {
			// The errors are shown before, here only stop the evaluation
		}
	}

	//###############################################################################################################
	// Touch dimensions
	//###############################################################################################################

	//====================================================================
	// Main function for calculation of touch dimensions
	//====================================================================

	function calculateTouchDimensions(): [number, number] {

		let Length = 0;
		let Width = 0;

		// Sidepanel
		//--------------------------------------------------------------------
		if (PartType === 'Sidepanel') {

			// Situation sidepanel connection with shelves left/right
			if ((ConnectionOrientation === 'FrontBack' || ConnectionOrientation === 'BackFront') && (TouchDirectionGraphic === 'Left' || TouchDirectionGraphic === 'Right')) {
				Width = part2._dimy;
				Length = calculateTouchLength(posRel.z, partSelf._dimz, part2._dimz);
			}

			// Situation sidepanel connection with shelves top/bottom
			if ((ConnectionOrientation === 'FrontBack' || ConnectionOrientation === 'BackFront') && (TouchDirectionGraphic === 'Top' || TouchDirectionGraphic === 'Bottom')) {
				Width = partSelf._dimx;
				Length = calculateTouchLength(posRel.z, partSelf._dimz, part2._dimz);
			}

			// Situation sidepanel connection with vertical panels or vertical rails left/right
			if ((ConnectionOrientation === 'TopBottom' || ConnectionOrientation === 'BottomTop') && (TouchDirectionGraphic === 'Left' || TouchDirectionGraphic === 'Right')) {
				Width = part2._dimz;
				Length = calculateTouchLength(posRel.y, partSelf._dimy, part2._dimy);
			}

			// Situation sidepanel connection with vertical panels or vertical rails front/back
			if ((ConnectionOrientation === 'TopBottom' || ConnectionOrientation === 'BottomTop') && (TouchDirectionGraphic === 'Front' || TouchDirectionGraphic === 'Back')) {
				Width = partSelf._dimx;
				Length = calculateTouchLength(posRel.y, partSelf._dimy, part2._dimy);
			}
		}

		// Shelf
		//--------------------------------------------------------------------
		if (PartType === 'Shelf') {

			// Situation shelf connection with sidepanels left/right
			if ((ConnectionOrientation === 'FrontBack' || ConnectionOrientation === 'BackFront') && (TouchDirectionGraphic === 'Left' || TouchDirectionGraphic === 'Right')) {
				Width = partSelf._dimy;
				Length = calculateTouchLength(posRel.z, partSelf._dimz, part2._dimz);
			}

			// Situation shelf connection with sidepanels top/bottom
			if ((ConnectionOrientation === 'FrontBack' || ConnectionOrientation === 'BackFront') && (TouchDirectionGraphic === 'Top' || TouchDirectionGraphic === 'Bottom')) {
				Width = part2._dimx;
				Length = calculateTouchLength(posRel.z, partSelf._dimz, part2._dimz);
			}

			// Situation shelf connection with vertical panels top/bottom
			if ((ConnectionOrientation === 'LeftRight' || ConnectionOrientation === 'RightLeft') && (TouchDirectionGraphic === 'Top' || TouchDirectionGraphic === 'Bottom')) {
				Width = part2._dimz;
				Length = calculateTouchLength(posRel.x, partSelf._dimx, part2._dimx);
			}

			// Situation shelf connection with vertical panels front/back
			if ((ConnectionOrientation === 'LeftRight' || ConnectionOrientation === 'RightLeft') && (TouchDirectionGraphic === 'Front' || TouchDirectionGraphic === 'Back')) {
				Width = partSelf._dimy;
				Length = calculateTouchLength(posRel.x, partSelf._dimx, part2._dimx);
			}
		}


		// Situation vertical panels (rails, cleat, blind panel)
		//--------------------------------------------------------------------
		if (PartType === 'PanelVertical') {

			// Situation vertical panel connection with sidepanels left/right
			if ((ConnectionOrientation === 'TopBottom' || ConnectionOrientation === 'BottomTop') && (TouchDirectionGraphic === 'Left' || TouchDirectionGraphic === 'Right')) {
				Width = partSelf._dimz;
				Length = calculateTouchLength(posRel.y, partSelf._dimy, part2._dimy);
			}

			// Situation vertical panel connection with sidepanels front/back
			if ((ConnectionOrientation === 'TopBottom' || ConnectionOrientation === 'BottomTop') && (TouchDirectionGraphic === 'Front' || TouchDirectionGraphic === 'Back')) {
				Width = part2._dimx;
				Length = calculateTouchLength(posRel.y, partSelf._dimy, part2._dimy);
			}

			// Situation vertical panel connection with shelves top/bottom
			if ((ConnectionOrientation === 'LeftRight' || ConnectionOrientation === 'RightLeft') && (TouchDirectionGraphic === 'Top' || TouchDirectionGraphic === 'Bottom')) {
				Width = partSelf._dimz;
				Length = calculateTouchLength(posRel.x, partSelf._dimx, part2._dimx);
			}

			// Situation vertical panel connection with shelves front/back
			if ((ConnectionOrientation === 'LeftRight' || ConnectionOrientation === 'RightLeft') && (TouchDirectionGraphic === 'Front' || TouchDirectionGraphic === 'Back')) {
				Width = part2._dimy;
				Length = calculateTouchLength(posRel.x, partSelf._dimx, part2._dimx);
			}
		}

		// Throw an error if touch dimension is not calculated correctly
		//--------------------------------------------------------------------
		if (Length <= 0 || Width <= 0) {
			let Text = PartType + ' in area: ' + Area;
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 40004',1)
			logError(ErrorMessage.Message(Text));
		}

		// Return the values
		//--------------------------------------------------------------------
		return [Length, Width];
	}

	//====================================================================
	// Helper function to calculate touch length
	//====================================================================

	function calculateTouchLength(position: number, dimSelf: number, dim2: number): number {

		// Situation 1: part2 is completly inside partSelf
		if (position >= 0 && position + dim2 <= dimSelf) {
			return dim2;
		}

		// Situation 2: partSelf is completly inside part2
		else if (position < 0 && position + dim2 > dimSelf) {
			return dimSelf;
		}

		// Situation 3: Starting point of part2 outside of partself
		else if (position < 0) {
			return Math.max(0, dim2 + position);
		}

		// Situation 4: Ending point of part2 outside of partSelf
		else if (position + dim2 > dimSelf) {
			return Math.max(0, dimSelf - position);
		}

		// Undefined situation
		return 0;
	}
}