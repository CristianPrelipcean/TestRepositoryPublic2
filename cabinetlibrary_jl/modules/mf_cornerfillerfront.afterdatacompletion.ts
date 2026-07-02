// Schuler Consulting
// Create: March 2024
// By Joao Lisboa
// Purpose: CabinetLibrary
//
// Description:
// AfterDataCompletion of mf_CornerFillerFront
// Add module for mc_CornerFillerFront01
//
// Revisions:
// 
//===================================================

//===================================================
//          Add module mc_CornerFillerFront01
  //===================================================
  GlobalFunc.process_CornerFillerFrontpanelConstruction(this, 'mf_CornerFillerFront', this.mod_CornerunitStraightFillerConstruction, this.mod_CarcaseDirection, this.mod_WidthLeft, this.mod_WidthRight, this.mod_HeightLeft, this.mod_HeightRight, this.mod_CarcaseWidth, this.mod_CarcaseDepth, 0, this.mod_CornerunitFrontWidth, Number(this.mod_FrontId));