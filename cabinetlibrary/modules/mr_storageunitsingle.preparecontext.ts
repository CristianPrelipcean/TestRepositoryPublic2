
  // HOMAG Digital
	// Create: May 2026
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// PREPARECONTEXT of mr_StorageUnitSingle
	// Read the dockings and room contours
	// provide the needed data to the module context information list
	//
	// Revisions:
	//
	//=============================================================================

	//=============================================================================
	// Prepare the context of the module
	//=============================================================================

	// Create the array of attributes which are set from this script
	this._forcedInputAttributes = [];
	// this._forcedInputAttributes.push(); => push the attributes which are set in this script

	// Read the dockings and room contours, create an object with the relevant data
	const result = GlobalFunc.process_GetModuleContextInformation(this);
	this.mod_ModuleContextInformationList.push(JSON.stringify(result));

	// Height position of the module in the room
	this.mod_HeightPosInsertion = result.HeightPosition ?? 0;
	this._forcedInputAttributes.push('mod_HeightPosInsertion');

	//=============================================================================
	// Prepare the needed data for the carcase height calculation
	//=============================================================================

	// Read base values
	const ceilingDistance = this.mod_CarcaseCeilingDistance ?? 0;
	const plinthHeight = this.mod_PlinthAreaHeight ?? 0;
	const countertopThk = this.mod_CountertopThk ?? 0;
	const paneltopThk = this.mod_CountertopThk ?? 0;

	// The insertion height only matters if the carcase is placed on the floor.
	// If the module is placed on a defined placement level, the insertion height is 0.
	let insertionHeight = plinthHeight;
	if (this.mod_PlacementLevels !== 'OnFloor') {
		insertionHeight = 0;
	}

	// Additional height parts above the carcase.
	// These are only subtracted in FullHeight mode.
	let topHeight = 0;

	if (this.mod_CreateCeilingFiller) {
		topHeight += ceilingDistance;
	}

	if (this.mod_CreateCountertop) {
		topHeight += countertopThk;
	}

	if (this.mod_CreatePaneltop) {
		topHeight += paneltopThk;
	}

	//=============================================================================
	// Carcase height calculation
	//=============================================================================

	// Check if the height can be calculated by the automatic height adjustment based on the room height
	const hasAutomaticHeight = this.mod_AutomaticHeightAdjustment && result?.DistanceCeiling != null;

	// Start with the user input height is the carcase height (might be overridden)
	let calculatedCarcaseHeight = this.mod_Height ?? 0;

	// The user enters the full height.
	// Therefore the carcase height must be calculated by subtracting all additional parts
	if (this.mod_HeightInputMode === 'FullHeight') {
		if (!hasAutomaticHeight) {
			calculatedCarcaseHeight = (this.mod_Height ?? 0) - topHeight - insertionHeight;
		}
	}

	// If automatic height adjustment is active, the carcase height is derived from the room height
	if (hasAutomaticHeight) {
		calculatedCarcaseHeight += result.DistanceCeiling - ceilingDistance - insertionHeight;
	}

	//=============================================================================
	// Force calculated attributes
	//=============================================================================

	// If automatic height adjustment is active
	//  the carcase height must be forced as it is calculated based on the room height
	if (hasAutomaticHeight) {

		// User expects that mod_Height shows the calculated carcase height
		if (this.mod_HeightInputMode === 'CarcaseHeight') {
			this.mod_Height = calculatedCarcaseHeight;
			this._forcedInputAttributes.push('mod_Height');
		}

		// User expects that mod_Height shows the calculated full height
		if (this.mod_HeightInputMode === 'FullHeight') {
			this.mod_Height = calculatedCarcaseHeight + insertionHeight + ceilingDistance;
			this._forcedInputAttributes.push('mod_Height');
		}		
	}

	// Store the real carcase height.
	this.mod_CarcaseHeight = calculatedCarcaseHeight;
	this._forcedInputAttributes.push('mod_CarcaseHeight');

