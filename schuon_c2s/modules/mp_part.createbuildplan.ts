  try {
    // Front View
    if (this.mod_TypeElement_matrix.PartView == 'FrontView') {
      this.addpart_PartPlaceholder(0, 0, 0, this.mod_Length, this.mod_Width, this.mod_Thickness);
    }

    // ShelfView
    else if (this.mod_TypeElement_matrix.PartView == 'ShelfView') {
      this.addpart_PartPlaceholder(0, 0, 0, this.mod_Length, this.mod_Thickness, this.mod_Width);
    }
    // SideView
    else {
      this.addpart_PartPlaceholder(0, 0, 0, this.mod_Thickness, this.mod_Length, this.mod_Width);
    }
  }
  // Log the error and stop execution if any function call fails
    catch (error:any) {

    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22001', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }