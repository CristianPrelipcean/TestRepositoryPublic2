  // Schuler Consulting
  // Create: May 2025
  // By Stefano Cortese
  // Purpose: Floating Shelves
  //
  // Description:
  //
  //
  //
  //
  // Revisions:
  //
  //===================================================


  //=> Adding the Brackets
  let Brackets = GlobalFunc.process_Bracket(this);

  let xDim = Brackets.xDim;
  let yDim = Brackets.yDim;
  let zDim = Brackets.zDim;
  let xIns = Brackets.xIns;
  let yIns = Brackets.yIns;
  let zIns = Brackets.zIns;


  let Shelfbracket = this.addpart_ShelvesBrackets(xIns, yIns, zIns, xDim, yDim, zDim);
  Shelfbracket.assign3DModel(Brackets.model3D);