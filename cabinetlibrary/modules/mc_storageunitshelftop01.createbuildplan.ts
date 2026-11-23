// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_StorageUnitSide
// Add an element for the top shelf including rails
//
// Revisions:
// 2026-11-03 | Ludwig Weber | Integrate r10 column-wrap feature while preserving current live behaviour.
//
//===================================================

let columnDiagnosticStage: string = 'Start';
try {
    let Elem: any;

    //===================================================
    //          Add the top shelf
    //===================================================

    if (this.mod_ShelftopConstruction == 'ShelfTop') {
        Elem = this.addpart_Shelftop(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
        const columnHasShape = !!this.mod_ColumnShelfSvgPath;
        if (columnHasShape)
            Elem.extrude(`<svg><path d="${this.mod_ColumnShelfSvgPath}"></path></svg>`, 'y');

        this.assignPartGroup(this.mod_CarcaseId, Elem);

        GlobalFunc.process_AddMaterialCarcase(
            Elem,
            this,
            'shelf',
            columnHasShape,
            this.mod_CarcaseVisTop,
            'bottom',
        );
    }

    //===================================================
    //          Add the rail top horizontal front
    //===================================================
    else if (this.mod_ShelftopConstruction == 'RailFrontHorizontal') {
        Elem = this.addpart_Railhortopfront(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
        this.assignPartGroup(this.mod_CarcaseId, Elem);

        GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelf', false, false, 'bottom');
    }

    //===================================================
    //          Add the rail top horizontal back
    //===================================================
    else if (this.mod_ShelftopConstruction == 'RailBackHorizontal') {
        Elem = this.addpart_Railhortopback(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
        this.assignPartGroup(this.mod_CarcaseId, Elem);

        GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelfNoFrontEdge', false, false, 'none');
    }

    //===================================================
    //          Add the rail top vertical front
    //===================================================
    else if (this.mod_ShelftopConstruction == 'RailFrontVertical') {
        Elem = this.addpart_Railverttopfront(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
        this.assignPartGroup(this.mod_CarcaseId, Elem);

        GlobalFunc.process_AddMaterialCarcase(Elem, this, 'rail', false, false, 'back');
    }

    //===================================================
    //          Add the rail top vertical back
    //===================================================
    else if (this.mod_ShelftopConstruction == 'RailBackVertical') {
        Elem = this.addpart_Railverttopback(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
        this.assignPartGroup(this.mod_CarcaseId, Elem);

        GlobalFunc.process_AddMaterialCarcase(Elem, this, 'rail', false, false, 'front');
    }
} catch (columnError: unknown) {
    logError(
        'mc_StorageunitShelftop01.CreateBuildPlanScript | ' +
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
