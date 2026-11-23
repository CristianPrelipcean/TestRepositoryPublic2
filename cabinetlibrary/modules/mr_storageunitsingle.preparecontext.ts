// HOMAG Digital
// Create: May 2026
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Prepares room and neighbour information for mr_StorageunitSingle.
// Provides normalized coverage data and calculates insertion and carcase heights.

// Revisions:
// 2026-11-04 | Ludwig Weber | Remove inactive debug placeholders; preserve optional column fallback.
// 2026-11-03 | Ludwig Weber | Integrate r10 column-wrap feature while preserving current live behaviour.
// 2026-11-02 | Ludwig Weber | Nobilia step 1: decoupled carcase finish from spatial side completion.
// 2026-11-02 | Ludwig Weber | Standardized script headers, block comments and English wording.
// 2026-11-02 | Ludwig Weber | Calculate master-data cabinets without requiring room information.

//======================================================================

//======================================================================
// Read base values
//======================================================================
let columnDiagnosticStage: string = 'Start';
try {
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
    const result = GlobalFunc.process_GetModuleContextInformation(this);
    this.mod_ModuleContextInformationList.length = 0;

    // Replace the current snapshot; repeated preparation must not read stale index 0.
    this.mod_ModuleContextInformationList[0] = JSON.stringify(result);
    // Column recognition is optional; unavailable context means standard construction.
    let columnContext: any = { Version: 1, IsComplete: true, HasIntersection: false, Errors: [] as string[] };
    try {
        const detected = GlobalFunc.process_StorageunitColumnContext(this);
        if (detected?.Version === 1 && detected.IsComplete === true) {
            columnContext = detected;
        }
    } catch {
        // Keep the neutral context and continue normal height and docking calculations.
    }
    this.mod_ColumnContext = JSON.stringify(columnContext);
    this.mod_ColumnWrapInfo[0] = '';
    this.mod_ColumnShelfOrigin.length = 0;

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

    //======================================================================
    // Call module UserExit
    //======================================================================
    const customExtraContext = GlobalFunc.ue_StorageunitAfterContextScrip(this);
} catch (columnError: unknown) {
    logError(
        'mr_StorageunitSingle.PrepareContextScript | ' +
            columnDiagnosticStage +
            ' | ' +
            (columnError instanceof Error ? columnError.message : String(columnError)),
    );
    // Never hide the invalid construction behind an apparently successful standard cabinet.
    throw columnError;
}

