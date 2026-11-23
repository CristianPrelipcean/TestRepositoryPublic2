process_StorageunitColumnPass(parent: any, child: any, x: number, y: number, z: number){
    // HOMAG Digital
    // Create: October 2026
    // By Ludwig Weber
    // Purpose: CabinetLibrary

    // Description:
    // process_StorageunitColumnPass implements the cabinet column-wrap feature.

    // Revisions:
    // 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

    //======================================================================
    // Column-wrap calculation
    //======================================================================
    // Explicit propagation through front and compartment coordinate frames.
    child.mod_ColumnWrapInfo[0] = parent.mod_ColumnWrapInfo[0] || '';
    child.mod_ColumnShelfOrigin.length = 0;
    const origin = parent.mod_ColumnShelfOrigin;
    child.mod_ColumnShelfOrigin.push((origin?.[0] ?? 0) + x, (origin?.[1] ?? 0) + y, (origin?.[2] ?? 0) + z);
}
