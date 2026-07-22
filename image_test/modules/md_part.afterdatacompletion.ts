  // Schuler Consulting
  // Create: January 2026
  // By Henning Wiesbrock
  // Purpose: Cut2Size
  //
  // Description:
  // AfterDataCompletion mrd_Part
  // Settings for dummy module like mr_Part
  //
  // Revisions:
  // 
  //===================================================

  try {

    // Front View
    if (this.mod_TypeElement_matrix.PartView == 'FrontView') {
      this.addOD_M_mc_FrontPanel01(0);

      // POS Data
      this._posData.set('depth', this.mod_Thickness);
      this._posData.set('width', this.mod_Length);
      this._posData.set('height', this.mod_Width);
      this._posData.set('color', this.mod_Color);
    }

    // ShelfView
    else if (this.mod_TypeElement_matrix.PartView == 'ShelfView') {
      this.addOD_M_mc_ShelfPanel01(0);

      // POS Data
      this._posData.set('depth', this.mod_Width);
      this._posData.set('width', this.mod_Length);
      this._posData.set('height', this.mod_Thickness);
      this._posData.set('color', this.mod_Color);
    }

    // SideView
    else {
      this.addOD_M_mc_SidePanel01(0);

      // POS Data
      this._posData.set('depth', this.mod_Width);
      this._posData.set('width', this.mod_Thickness);
      this._posData.set('height', this.mod_Length);
      this._posData.set('color', this.mod_Color);
    }
  }
  // Log the error and stop execution if any function call fails
  catch (error: any) {

    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22001', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }