// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_StorageUnitSide
// Add the bottom shelf including all parts of construction
//
// Revisions:
// 2026-11-03 | Ludwig Weber | Integrate r10 column-wrap feature while preserving current live behaviour.
//
//===================================================

//===================================================
//          Add the bottom shelf
//===================================================

let columnDiagnosticStage: string = 'Start';
try {
    let Elem = this.addpart_Shelfbtm(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    const columnHasShape = !!this.mod_ColumnShelfSvgPath;
    if (columnHasShape) Elem.extrude(`<svg><path d="${this.mod_ColumnShelfSvgPath}"></path></svg>`, 'y');

    this.assignPartGroup(this.mod_CarcaseId, Elem);

    GlobalFunc.process_AddMaterialCarcase(
        Elem,
        this,
        'shelf',
        columnHasShape,
        this.mod_CarcaseVisBtm,
        'top',
    );
} catch (columnError: unknown) {
    logError(
        'mc_StorageunitShelfbtm01.CreateBuildPlanScript | ' +
            columnDiagnosticStage +
            ' | ' +
            (columnError instanceof Error ? columnError.message : String(columnError)),
    );
    if (this.mod_ColumnDebug !== false) {
        const message = columnError instanceof Error ? columnError.message : String(columnError);
        const stack = columnError instanceof Error ? columnError.stack || '' : '';
        void 0;
    }
    // Never hide the invalid construction behind an apparently successful standard cabinet.
    throw columnError;
}
