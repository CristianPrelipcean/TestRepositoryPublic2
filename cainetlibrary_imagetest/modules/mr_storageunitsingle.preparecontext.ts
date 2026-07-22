
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
	//===================================================

	// Create the array of attributes which are set from this script
	this._forcedInputAttributes = [];
	// this._forcedInputAttributes.push(); => push the attributes which are set in this script

	// Read the dockings and room contours, create an object with the relevant data
	const result = GlobalFunc.process_GetModuleContextInformation(this);
	this.mod_ModuleContextInformationList.push(JSON.stringify(result));

	// Auto adjust the height to match the room height
	if (this.mod_AutomaticHeightAdjustment && result?.DistanceCeiling != null) {
		this.mod_Height = this.mod_Height! + result.DistanceCeiling - 20 - (this.mod_PlinthAreaHeight ?? 0);
		this._forcedInputAttributes.push('mod_Height');
	}
