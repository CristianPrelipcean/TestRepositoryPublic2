// HOMAG Digital
// Create: October 2026
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// mc_StorageunitColumnWrap01 implements the cabinet column-wrap feature.

// Revisions:
// 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

//======================================================================
// Column-wrap calculation
//======================================================================
let columnDiagnosticStage: string = 'Start';
try {
    // Reuse existing parts and their material, connection, BOM and NC pipelines.
    if (!this.mod_ColumnWrapInfo[0]) return;
    const wrap = JSON.parse(this.mod_ColumnWrapInfo[0]);
    if (wrap.Version !== 1 || !wrap.IsComplete)
        throw new Error('Column wrap: invalid construction data.');
    for (const spec of wrap.Parts) {
        const child =
            spec.Role === 'FrontPanel'
                ? this.addOD_M_mc_Panelblind01()
                : this.addOD_M_mc_StorageunitSidepanel01();
        child.mod_Width = spec.Width;
        child.mod_Height = spec.Height;
        child.mod_Depth = spec.Depth;
        child.mod_CarcaseId = this.mod_CarcaseId;
        // Material/connection values derive through this module; edge codes use the standard table result.
        const edges = spec.Edges;
        child.mod_EdgeFrontType = edges.Front;
        child.mod_EdgeLeftType = edges.Left;
        child.mod_EdgeBackType = edges.Back;
        child.mod_EdgeRightType = edges.Right;
        child.mod_EdgeJointType = edges.Joint;
        if (spec.Role !== 'FrontPanel') {
            const side = child as OD_M_mc_StorageunitSidepanel01;
            side.mod_SidepanelType = spec.Side;
            side.mod_ColumnIsReturnPanel = true;
            side.mod_CarcaseVisLeft = false;
            side.mod_CarcaseVisRight = false;
            side.mod_SlopeAngle = 0;
            side.mod_FingergripTop = false;
            side.mod_FingergripPos1 = 0;
            side.mod_FingergripPos2 = 0;
            side.mod_FingergripPos3 = 0;
            side.mod_FingergripPos4 = 0;
            side.mod_FingergripPos5 = 0;
            side.mod_Originpos.length = 0;
            side.mod_Originpos.push(spec.X, spec.Y, spec.Z);
        }
        child.setOrigin(spec.X, spec.Y, spec.Z);
    }
} catch (columnError: unknown) {
    logError(
        'mc_StorageunitColumnWrap01.AfterDataCompletionScript | ' +
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
