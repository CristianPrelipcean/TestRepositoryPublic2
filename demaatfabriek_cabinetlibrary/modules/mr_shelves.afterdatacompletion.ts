  // Schuler Consulting
  // Create: May 2025
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // Insertion of the Shelves
  //
  //
  // Revisions:
  //
  //===================================================

  //=> Add the module of the shelf
  let shelfboard = this.addOD_M_mc_Shelves01(0);

  //=> Adding the Brackets
  let Brackets = GlobalFunc.process_Bracket(this);
  let BracketNo=Brackets.BrNo

  //let bracket = this.addOD_M_mc_Bracket01(0);

  for (let i = 0; i < BracketNo; i++) {
    let bracket = this.addOD_M_mc_Bracket01(i);
    let position = Brackets["Pos" + (i + 1)];
    position = 100;
    bracket.setOrigin(position, 0-Brackets.yDim, 0);
  }

	//===================================================
	//          Call the UserExit of this module
	//===================================================

	let retInfo = GlobalFunc.ue_Shelves(this);
