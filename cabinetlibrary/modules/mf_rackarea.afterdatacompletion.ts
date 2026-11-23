// Schuler Consulting
// Create: July 2024
// By Henning Wiesbrock
// Purpose: CabinetLibrary
//
// Description:
// AfterDataCompletion of mf_RackArea
// Setting for interior
// Add module for adjustable shelves
//
// Revisions:
// 2026-11-03 | Ludwig Weber | Integrate r10 column-wrap feature while preserving current live behaviour.
// September 2025
// By Ludwig Weber
// Change the adjustable shelves
// Add the equipment adjustable shelf multiple
//===================================================

//===================================================
//          Add module
//===================================================

// Add the module
//---------------------------------------------------

let columnDiagnosticStage: string = 'Start';
try {
    let RackArea = this.addOD_M_mc_RackArea01();
    RackArea.setOrigin(0, 0, this.mod_FrontGapCarcase);

    // Set values to the attributes of the child
    //---------------------------------------------------

    // Absolute Origin
    RackArea.mod_Originpos[0] = this.mod_Originpos[0];
    RackArea.mod_Originpos[1] = this.mod_Originpos[1];
    RackArea.mod_Originpos[2] = this.mod_Originpos[2] + this.mod_FrontGapCarcase;

    // Front Width
    RackArea.mod_FrontWidth = this.mod_CarcaseWidth;

    // Free Space
    let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

    //===================================================
    //          Build Compartments (add dividers and create compartments informations)
    //===================================================

    const compartmentsInformation = JSON.parse(GlobalFunc.process_CreateCompartments(this));
    this.mod_CompartmentsInformation.push(JSON.stringify(compartmentsInformation));

    //===================================================
    //          Find Equipment Docked
    //===================================================

    // Check if an equipment is docked in the cabinet
    let checkEquipmentDocked = false;

    // Cycle through all children of the mf_Door
    this.m.forEach((p, index) => {
        // If there is a shelfadjMultiple
        if (p instanceof OD_M_me_ShelfadjMultiple01) {
            checkEquipmentDocked = true;
            // Geometry and shelf fallbacks are resolved by process_CreateCompartments.
        }

        // If there is a clothing organzier
        else if (p instanceof OD_M_me_ClothingOrganizer01) {
            checkEquipmentDocked = true;
            GlobalFunc.process_StorageunitColumnPass(
                this,
                p,
                CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0],
                0,
                CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2],
            );

            // Geometry and shelf fallbacks are resolved by process_CreateCompartments.
        }

        // If there is a inner drawer group
        else if (p instanceof OD_M_me_InnerDrawerGroup) {
            checkEquipmentDocked = true;
            // Geometry and shelf fallbacks are resolved by process_CreateCompartments.

            // Run the InnerDrawers Process
            let innerDrawerGroupInfo = GlobalFunc.process_InnerDrawerGroup(p);

            let numberOfDrawers = p.mod_InnerDrawerCount ?? 1;
            let isComplete = innerDrawerGroupInfo.IsComplete ?? false;

            // Check if the number of drawers fit inside the space available and if not reduce the number of drawers until it fits
            while (numberOfDrawers > 1 && !isComplete) {
                // Reduce the number of drawers by 1 an try again
                numberOfDrawers--;

                p.mod_InnerDrawerCount = numberOfDrawers;

                // Run the InnerDrawers Process
                innerDrawerGroupInfo = GlobalFunc.process_InnerDrawerGroup(p);

                isComplete = innerDrawerGroupInfo.IsComplete ?? false;
            }
        }

        // If there is a VertDivider (Middle Side Panel)
        else if (p instanceof OD_M_me_Vertdivider01) {
            checkEquipmentDocked = true;
        }

        // If there is a ShelfFixed (Middle Side Panel)
        else if (p instanceof OD_M_me_Shelffixed01) {
            checkEquipmentDocked = true;
        }

        // If there is a Laundry machine
        else if (p instanceof OD_M_me_LaundryMachine) {
            checkEquipmentDocked = true;

            p.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

            // SetOrigin of the child
            p.setOrigin(
                CarcaseSpaceDimension.WidthFreeStartPos -
                    this.mod_Originpos[0] +
                    CarcaseSpaceDimension.WidthFreeSpace / 2,
                CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1],
                CarcaseSpaceDimension.DepthFreeStartPos -
                    this.mod_Originpos[2] +
                    CarcaseSpaceDimension.DepthFreeSpace,
            );
            GlobalFunc.process_StorageunitColumnPass(
                this,
                p,
                CarcaseSpaceDimension.WidthFreeStartPos -
                    this.mod_Originpos[0] +
                    CarcaseSpaceDimension.WidthFreeSpace / 2,
                CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1],
                CarcaseSpaceDimension.DepthFreeStartPos -
                    this.mod_Originpos[2] +
                    CarcaseSpaceDimension.DepthFreeSpace,
            );
        }

        // If there is an Appliance
        else if (p instanceof OD_M_me_Appliance) {
            checkEquipmentDocked = true;

            p.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

            // Find Appliance Mapping
            let ApplianceInfo = GlobalFunc.find_ApplianceMapping(
                p.mod_ApplianceSupplier ?? '',
                p.mod_ApplianceId ?? '',
            );

            // SetOrigin of the child
            const widthAlignment = ApplianceInfo.PositionWidth ?? 'CenterAligned';
            const heightAlignment = ApplianceInfo.PositionHeight ?? 'CenterAligned';
            const depthAlignment = ApplianceInfo.PositionDepth ?? 'FrontAligned';

            let widthPos = 0;
            if (widthAlignment == 'LeftAligned') {
                widthPos = CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0];
            } else if (widthAlignment == 'CenterAligned') {
                widthPos =
                    CarcaseSpaceDimension.WidthFreeStartPos -
                    this.mod_Originpos[0] +
                    CarcaseSpaceDimension.WidthFreeSpace / 2;
            }

            let heightPos = 0;
            if (heightAlignment == 'BottomAligned') {
                heightPos = CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1];
            } else if (heightAlignment == 'CenterAligned') {
                heightPos =
                    CarcaseSpaceDimension.HeightFreeStartPos -
                    this.mod_Originpos[1] +
                    CarcaseSpaceDimension.HeightFreeSpace / 2;
            }

            let depthPos = 0;
            if (depthAlignment == 'FrontAligned') {
                depthPos =
                    CarcaseSpaceDimension.DepthFreeStartPos -
                    this.mod_Originpos[2] +
                    CarcaseSpaceDimension.DepthFreeSpace;
            } else if (depthAlignment == 'BackAligned') {
                depthPos = CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2];
            }

            p.setOrigin(widthPos, heightPos, depthPos);
        }
    });

    //===================================================
    //          Add module for the shelves (Standard if no equipment docked)
    //===================================================

    if (!checkEquipmentDocked) {
        if (this.mod_RackAreaType == 'Adj') {
            // Add the module
            let shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

            // Set the attributes to the child
            shelfadjgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
            shelfadjgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
            shelfadjgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
            shelfadjgroup.mod_ShelfadjPartParentName = 'RackArea';
            shelfadjgroup.mod_ShelfadjPartParentType = this.mod_RackAreaType;
            shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

            // SetOrigin of the child
            shelfadjgroup.setOrigin(
                CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0],
                CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1],
                CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2],
            );
            GlobalFunc.process_StorageunitColumnPass(
                this,
                shelfadjgroup,
                CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0],
                CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1],
                CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2],
            );
        } else if (this.mod_RackAreaType == 'Fixed') {
            // Add the module
            let shelffixedgroup = this.addOD_M_mc_ShelffixedGroup01();

            // Set the attributes to the child
            shelffixedgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
            shelffixedgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
            shelffixedgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
            shelffixedgroup.mod_ShelffixedPartParentName = 'RackArea';
            shelffixedgroup.mod_ShelffixedPartParentType = this.mod_RackAreaType;
            shelffixedgroup.mod_ShelffixedOffsetFront = this.mod_ShelfadjOffsetFront;
            shelffixedgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

            // SetOrigin of the child
            shelffixedgroup.setOrigin(
                CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0],
                CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1],
                CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2],
            );
        } else if (this.mod_RackAreaType == 'Empty') {
        }
    }
} catch (columnError: unknown) {
    logError(
        'mf_RackArea.AfterDataCompletionScript | ' +
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
