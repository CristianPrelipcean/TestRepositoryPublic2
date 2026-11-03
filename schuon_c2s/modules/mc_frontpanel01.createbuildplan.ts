  // Schuler Consulting
  // Create: January 2026
  // By Henning Wiesbrock
  // Purpose: Cut2SizeLibrary
  //
  // Description:
  // CreateBuildPlan mc_FrontPanel01
  // Add the front panel
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the front panel
  //===================================================

  try {

    // Variables
    let Panel: any;
    const groupName = this.mod_TypeElement;

    // Add the Front
    Panel = this.addpart_Front(0, 0, 0, this.mod_Length, this.mod_Width, this.mod_Thickness);
    Panel.pa_BomId = "Root";

    GlobalFunc.process_AddMaterial(this, Panel, 'Front', this.mod_PartGrain, this.mod_Color, this.mod_BtmColor, this.mod_EdgeFrontColor, this.mod_EdgeBackColor, this.mod_EdgeLeftColor, this.mod_EdgeRightColor);
  }

  // Log the error and stop execution if any function call fails
  catch (error:any) {

    let ErrorMessage = GlobalFunc.find_ErrorList('Error 21001', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }