// HOMAG Digital
// Create: November 2026
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Resolves the user direction and prepares optional room and neighbour context.
// Uses the Storageunit height calculation without requiring a room for master data.
// Creates no child modules, uprights or additional wall fillers.

// Revisions:
// 2026-11-02 | Ludwig Weber | Add standalone Cornerunit context, height and direction-dependent side completion.

//======================================================================

//======================================================================
// Read base values
//======================================================================
const ceilingDistance = this.mod_CarcaseCeilingDistance ?? 0;
const plinthHeight = this.mod_PlinthAreaHeight ?? 0;
const countertopThk = this.mod_CountertopThk ?? 0;
const paneltopThk = this.mod_CountertopThk ?? 0;

//======================================================================
// Prepare module context
//======================================================================
// Reset all attributes forced by this script.
this._forcedInputAttributes = [];

// Read dockings and room contours and store the resulting context information.
const result = GlobalFunc.process_GetCornerunitContextInformation(this);

//======================================================================
// Resolve the user direction without changing either side configuration
//======================================================================
const directionSelection = this.mod_CarcaseDirectionSelection;
let effectiveDirection = this.mod_CarcaseDirection === 'Right' ? 'Right' : 'Left';
if (directionSelection === 'Left' || directionSelection === 'Right') {
    effectiveDirection = directionSelection;
} else if (directionSelection === 'Automatic') {
    if (result.SuggestedDirection !== null) effectiveDirection = result.SuggestedDirection;
} else {
    logError(`mr_CornerunitStraight: unknown direction selection '${String(directionSelection)}'.`);
}
this.mod_CarcaseDirection = effectiveDirection;
this._forcedInputAttributes.push('mod_CarcaseDirection');

// Replace the current snapshot; repeated preparation must not read stale index 0.
this.mod_ModuleContextInformationList[0] = JSON.stringify(result);

// Determine the actual insertion height of the module in the room.
const moduleInsertionHeight =
    this.mod_PlacementLevels === 'OnFloor' ? plinthHeight : (result.HeightPosition ?? 0);
this.mod_HeightPosInsertion = moduleInsertionHeight;
this._forcedInputAttributes.push('mod_HeightPosInsertion');

//======================================================================
// Prepare carcase height calculation
//======================================================================
// The plinth affects the carcase height only when the module is placed on the floor.
const carcaseInsertionHeight = this.mod_PlacementLevels === 'OnFloor' ? plinthHeight : 0;

// Calculate all additional height parts above the carcase.
let topHeight = 0;
if (this.mod_CreateCeilingFiller) topHeight += ceilingDistance;
if (this.mod_CreateCountertop) topHeight += countertopThk;
if (this.mod_CreatePaneltop) topHeight += paneltopThk;

// Group height adjustment requires information from the group orchestrator.
const hasGroupHeight = this.mod_UseGroupHeight && this.mod_GroupHeight != null;

// Room height adjustment requires an actual room; master-data previews keep their configured height.
const hasRoomHeight =
    result.DataComplete === true &&
    result.HasCeilingInformation &&
    this.mod_AutomaticHeightAdjustment &&
    result.DistanceCeiling != null;

// Any active room or group height adjustment requires a calculated height.
const hasHeightAdjustment = hasRoomHeight || hasGroupHeight;

//======================================================================
// Calculate carcase height
//======================================================================
let calculatedCarcaseHeight = this.mod_Height ?? 0;

// In FullHeight mode, subtract all elements outside the carcase.
if (this.mod_HeightInputMode === 'FullHeight' && !hasHeightAdjustment) {
    calculatedCarcaseHeight = (this.mod_Height ?? 0) - topHeight - carcaseInsertionHeight;
}

// When room height adjustment is active, calculate the carcase height
if (hasRoomHeight) {
    calculatedCarcaseHeight += result.DistanceCeiling - ceilingDistance - carcaseInsertionHeight;
}

// When group height adjustment is active, calculate the carcase height
if (hasGroupHeight) {
    const groupHeight = this.mod_GroupHeight ?? 0;
    calculatedCarcaseHeight = groupHeight - moduleInsertionHeight;
}

//======================================================================
// Store the calculated carcase height
//======================================================================
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
        } else {
            this.mod_Height = calculatedCarcaseHeight + carcaseInsertionHeight + ceilingDistance;
        }
        this._forcedInputAttributes.push('mod_Height');
    }
}

// Store the actual calculated carcase height.
this.mod_CarcaseHeight = calculatedCarcaseHeight;

this._forcedInputAttributes.push('mod_CarcaseHeight');
