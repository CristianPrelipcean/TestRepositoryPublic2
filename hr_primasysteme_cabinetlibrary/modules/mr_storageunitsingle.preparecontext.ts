
  // HOMAG Digital
	// Create: May 2026
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// PREPARECONTEXT of mr_StorageUnitSingle.
	// Reads dockings and room contours and provides the required module context information.
	//
	// Revisions:
	//
	//=============================================================================

	//=============================================================================
	// Interfaces
	//=============================================================================

	interface GroupInformation {
		HeightAdjustmentMode?: string;
		GroupHeight?: number;
		ActivateHeightAdjustment?: boolean;
		DataComplete?: boolean;
	}

	//=============================================================================
	// Read base values
	//=============================================================================

	const ceilingDistance = this.mod_CarcaseCeilingDistance ?? 0;
	const plinthHeight = this.mod_PlinthAreaHeight ?? 0;
	const countertopThk = this.mod_CountertopThk ?? 0;
	const paneltopThk = this.mod_CountertopThk ?? 0;

	//=============================================================================
	// Prepare module context
	//=============================================================================

	// Reset all attributes forced by this script.
	this._forcedInputAttributes = [];

	// Read dockings and room contours and store the resulting context information.
	const result = GlobalFunc.process_GetModuleContextInformation(this);
	this.mod_ModuleContextInformationList.push(JSON.stringify(result));

	// Determine the actual insertion height of the module in the room.
	const moduleInsertionHeight = this.mod_PlacementLevels === 'OnFloor' ? plinthHeight : result.HeightPosition ?? 0;
	this.mod_HeightPosInsertion = moduleInsertionHeight;
	this._forcedInputAttributes.push('mod_HeightPosInsertion');

	//=============================================================================
	// Read group information
	//=============================================================================

	let groupInformation: GroupInformation | undefined;

	if (this.mod_GroupInformation) {
		try {
			groupInformation = JSON.parse(this.mod_GroupInformation) as GroupInformation;
		}
		catch {
			groupInformation = undefined;
		}
	}

	// Group height adjustment requires complete group and module context data.
	const hasGroupHeight =
		groupInformation?.DataComplete === true &&
		groupInformation.ActivateHeightAdjustment === true &&
		groupInformation.HeightAdjustmentMode === 'UseGroupHeight' &&
		groupInformation.GroupHeight != null &&
		result.DataComplete === true;

	//=============================================================================
	// Prepare carcase height calculation
	//=============================================================================

	// The plinth affects the carcase height only when the module is placed on the floor.
	const carcaseInsertionHeight = this.mod_PlacementLevels === 'OnFloor' ? plinthHeight : 0;

	// Calculate all additional height parts above the carcase.
	let topHeight = 0;
	if (this.mod_CreateCeilingFiller) topHeight += ceilingDistance;
	if (this.mod_CreateCountertop) topHeight += countertopThk;
	if (this.mod_CreatePaneltop) topHeight += paneltopThk;

	// Room height adjustment requires a valid distance to the ceiling.
	const hasRoomHeight = this.mod_AutomaticHeightAdjustment && result.DistanceCeiling != null;

	// Any active room or group height adjustment requires a calculated height.
	const hasHeightAdjustment = hasRoomHeight || hasGroupHeight;

	//=============================================================================
	// Calculate carcase height
	//=============================================================================

	let calculatedCarcaseHeight = this.mod_Height ?? 0;

	// In FullHeight mode, subtract all elements outside the carcase.
	if (this.mod_HeightInputMode === 'FullHeight' && !hasHeightAdjustment) {
		calculatedCarcaseHeight = (this.mod_Height ?? 0) - topHeight - carcaseInsertionHeight;
	}

	// When room height adjustment is active, extend the current carcase height
	// to the available room height.
	if (hasRoomHeight) {
		calculatedCarcaseHeight += result.DistanceCeiling - ceilingDistance - carcaseInsertionHeight;
	}

	// When group height adjustment is active, calculate the carcase height
	// from the group height and the actual module insertion height.
	if (hasGroupHeight) {
		const groupHeight = groupInformation?.GroupHeight ?? 0;
		calculatedCarcaseHeight = groupHeight - moduleInsertionHeight - topHeight;
	}

	//=============================================================================
	// Store the calculated carcase height
	//=============================================================================

	if (hasHeightAdjustment) {

		// In CarcaseHeight mode, mod_Height displays the calculated carcase height.
		if (this.mod_HeightInputMode === 'CarcaseHeight') {
			this.mod_Height = calculatedCarcaseHeight;
			this._forcedInputAttributes.push('mod_Height');
		}

		// In FullHeight mode, mod_Height displays the resulting total module height.
		if (this.mod_HeightInputMode === 'FullHeight') {
			if (hasGroupHeight) {
				this.mod_Height = calculatedCarcaseHeight + topHeight + carcaseInsertionHeight;
			}
			else {
				this.mod_Height = calculatedCarcaseHeight + carcaseInsertionHeight + ceilingDistance;
			}

			this._forcedInputAttributes.push('mod_Height');
		}
	}

	// Store the actual calculated carcase height.
	this.mod_CarcaseHeight = calculatedCarcaseHeight;

	//=============================================================================
	// Call module UserExit
	//=============================================================================

	const customExtraContext = GlobalFunc.ue_StorageunitAfterContextScrip(this);
