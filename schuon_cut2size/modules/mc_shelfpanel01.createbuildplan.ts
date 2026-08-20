  // Schuler Consulting
  // Create: January 2026
  // By Henning Wiesbrock
  // Purpose: Cut2SizeLibrary
  //
  // Description:
  // CreateBuildPlan mc_ShelfPanel01
  // Add the shelf panel
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the shelf panel
  //===================================================

  try {

    // Variables
    let Panel: any;
    const groupName = this.mod_TypeElement;

    // Add the part group
    let Panelgroup = this.addpart_PanelGroup(0, 0, 0, this.mod_Length, this.mod_Thickness, this.mod_Width);
    this.createPartGroup(groupName, Panelgroup);
    Panelgroup.pa_BomId = groupName;

    // Add the shelf
    Panel = this.addpart_Shelf(0, 0, 0, this.mod_Length, this.mod_Thickness, this.mod_Width);
    this.assignPartGroup(groupName, Panel);
    Panel.pa_BomId = groupName;

    // AddMaterial
    GlobalFunc.process_AddMaterial(Panel, 'Shelf', this.mod_PartGrain, this.mod_Color, this.mod_BtmColor, this.mod_EdgeFrontColor, this.mod_EdgeBackColor, this.mod_EdgeLeftColor, this.mod_EdgeRightColor);

  }
    // Log the error and stop execution if any function call fails
  catch (error:any) {

    let ErrorMessage = GlobalFunc.find_ErrorList('Error 21002', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }