
  const Info = JSON.parse(this.mod_Information);
  const drawerInfo = Info.drawer;
  const frontInfo = Info.front;
  const spacerInfo = Info.spacer;

  // generate the DrawerBox
  let drawer = this.addOD_M_mc_DrawerBox01();  

  drawer.mod_DrawerBoxOffsetDepth = this.mod_Depth - drawerInfo.PosZ
  drawer.mod_Width = drawerInfo.DimX
  drawer.mod_Height = drawerInfo.DimY
  drawer.mod_Depth = drawerInfo.DimZ
  drawer.mod_DrawerBoxHeightType = drawerInfo.HeightType
  drawer.mod_FrontId = this.mod_InnerDrawerId
  

  drawer.setOrigin(drawerInfo.PosX, drawerInfo.PosY, drawerInfo.PosZ)

    
   // generate the innerDrawerFront
  
  if (this.mod_InnerDrawerFrontRule == "ManufacturerBoardFront") {
    let innerDrawerFront = this.addOD_M_mc_InnerDrawerFront01();
  } else if (this.mod_InnerDrawerFrontRule == "SupplierFront") {
    let innerDrawerFront = this.addOD_M_mc_InnerDrawerFront02();
  };

  // generate spacers
  
  
  
  if (this.mod_ModuleName == " mf_Door") {

    if (this.mod_InnerDrawerSpacerRule == "ManufacturerBoardSpacer") {
      let innerDrawerSpacer = this.addOD_M_mc_InnerDrawerSpacer01();
    } else if (this.mod_InnerDrawerSpacerRule == "SupplierSpacer") {
      let innerDrawerSpacer = this.addOD_M_mc_InnerDrawerSpacer02();
    };
  }