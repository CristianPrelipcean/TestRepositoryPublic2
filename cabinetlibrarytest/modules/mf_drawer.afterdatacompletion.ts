// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: CabinetLibrary
//
// Description:
// AfterDataCompletion of mf_Drawer
// Add module for the drawer
//
// Revisions:
// 
//===================================================

//===================================================
//          Add module for single drawer
//===================================================

  if (this.mod_DrawerType == 'Single') {

    // Add the module
    let Elem = this.addOD_M_mc_Drawer01();
    Elem.setOrigin(0, 0, this.mod_FrontGapCarcase);

    //===================================================
    //          Set values to the attributes of the child
    //===================================================

    // Front Width
    //Elem.mod_FrontWidth = this.mod_CarcaseWidth;
    Elem.mod_FrontWidth = this.mod_FrontWidth;
    Elem.mod_Originpos.push(this.mod_Originpos[0]);
    Elem.mod_Originpos.push(this.mod_Originpos[1]);
    Elem.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
    Elem.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
  }

//===================================================
//          Add module for double drawer
//===================================================

  if (this.mod_DrawerType == 'Double') {

    // Add the module
    let Drawer1 = this.addOD_M_mc_Drawer01();
    let Drawer2 = this.addOD_M_mc_Drawer01();

    //Set Origin 
    Drawer1.setOrigin(0, 0, this.mod_FrontGapCarcase);
    Drawer2.setOrigin(this.mod_FrontWidth, 0, this.mod_FrontGapCarcase);

    //===================================================
    //          Set values to the attributes of the child
    //===================================================

    // Correct the WidthFreeSpace because we get to FreeSpaces now
    let carcaseCopy = JSON.parse(this.mod_CarcaseSpaceDimension[0]);
    carcaseCopy.WidthFreeSpace = carcaseCopy.WidthFreeSpace/2 - carcaseCopy.WidthFreeStartPos;
    const carcaseUpdate = JSON.stringify(carcaseCopy);

    //DrawerLeft
    Drawer1.mod_FrontId = this.mod_FrontId + "L"
    Drawer1.mod_FrontWidth = this.mod_FrontWidth;
    Drawer1.mod_Originpos.push(this.mod_Originpos[0]);
    Drawer1.mod_Originpos.push(this.mod_Originpos[1]);
    Drawer1.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
    Drawer1.mod_CarcaseSpaceDimension.push(carcaseUpdate);

    //DrawerRight
    Drawer2.mod_FrontId = this.mod_FrontId + "R"
    Drawer2.mod_FrontWidth =this.mod_CarcaseWidth - this.mod_FrontWidth;
    Drawer2.mod_Originpos.push(this.mod_Originpos[0]);
    Drawer2.mod_Originpos.push(this.mod_Originpos[1]);
    Drawer2.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
    Drawer2.mod_CarcaseSpaceDimension.push(carcaseUpdate);
  }



















