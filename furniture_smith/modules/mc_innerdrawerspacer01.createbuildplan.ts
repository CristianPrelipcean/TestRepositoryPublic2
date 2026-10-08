
  const Information = JSON.parse(this.mod_Information)
  const spacer = Information.spacer;
  if (!spacer) {
    return
  }

  if (Information.spacer.Side == "LeftRight") {
    let SpacerLeft = this.addpart_InnerDrawerSpacer(Information.spacer.PosX[0], Information.spacer.PosY[0], Information.spacer.PosZ[0], Information.spacer.DimX[0], Information.spacer.DimY[0], Information.spacer.DimZ[0]);
    GlobalFunc.process_AddMaterial(SpacerLeft, "", this.mod_CarcaseColor)
    let SpacerRight = this.addpart_InnerDrawerSpacer(Information.spacer.PosX[1], Information.spacer.PosY[1], Information.spacer.PosZ[1], Information.spacer.DimX[1], Information.spacer.DimY[1],Information.spacer.DimZ[1]);
    GlobalFunc.process_AddMaterial(SpacerRight, "", this.mod_CarcaseColor)
  } else {
    let Spacer = this.addpart_InnerDrawerSpacer(Information.spacer.PosX, Information.spacer.PosY, Information.spacer.PosZ, Information.spacer.DimX, Information.spacer.DimY, Information.spacer.DimZ);
    GlobalFunc.process_AddMaterial(Spacer, "", this.mod_CarcaseColor)
  };


