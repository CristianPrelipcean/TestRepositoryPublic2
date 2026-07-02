  // Schuler Consulting
  // Create: September 2024
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add module for the Upright
  //
  //
  //
  // Revisions:
  // 25.3.2025 Jiri Polcar added docking vectors
  //
  //===================================================

  //===================================================
  //          Variables
  //===================================================

  let ElementHeight = this.mod_UprightHeight;
  let StartingPosition = this.mod_PlinthAreaHeight

  if (this.mod_HeightPosInsertion > 0) {
    StartingPosition = 0;
  }
  else if (this.mod_UprightConstruction === "ToFloor") {
    ElementHeight = this.mod_UprightHeight + this.mod_PlinthAreaHeight;
    StartingPosition = 0
  }

  //===================================================
  //          Add module for the Upright
  //===================================================

  // Add the module
  let Upright = this.addOD_M_mc_Upright01();

  // Set values to the attributes of the child
  Upright.mod_Depth = this.mod_UprightDepth + this.mod_UprightOverhang;
  Upright.mod_Height = ElementHeight;

  // SetOrigin
  Upright.setOrigin(0, StartingPosition, 0);

  //===================================================
  //          Create vector / docking
  //===================================================

  // Left Dockings
  this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, 0), new Vector3(0, 0, this.mod_UprightDepth));
  this.addDockingInfo(Dock.LeftTop, new Vector3(0, ElementHeight, 0), new Vector3(0, ElementHeight, this.mod_UprightDepth));

  // Right Dockings
  this.addDockingInfo(Dock.RightBottom, new Vector3(this.mod_UprightThk, 0, 0), new Vector3(this.mod_UprightThk, 0, this.mod_UprightDepth));
  this.addDockingInfo(Dock.RightTop, new Vector3(this.mod_UprightThk, ElementHeight, 0), new Vector3(this.mod_UprightThk, ElementHeight, this.mod_UprightDepth));

  // Back side
  this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, 0), new Vector3(this.mod_UprightThk, 0, 0));
  this.addDockingInfo(Dock.BackTop, new Vector3(0, ElementHeight, 0), new Vector3(this.mod_UprightThk, ElementHeight, 0));

  //===================================================
  //          Call the UserExit of this module
  //===================================================

  let retInfo = GlobalFunc.ue_Upright(this);