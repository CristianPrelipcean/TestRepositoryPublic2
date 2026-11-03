
  //===================================================
  //          PartView == FrontView
  //===================================================

  if (this.mod_TypeElement_matrix.PartView == "FrontView" && this.mod_EdgeFrontColor_matrix.Custom_Category == "Duo") {

    const EdgeFrontDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge1Color

    const EdgeFrontDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge2Color

    let Duo1 = this.addcpart_FrontDuoEdge1(0, this.mod_Width, 0, this.mod_Length, 0.1, this.mod_Thickness * 0.75);

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeFrontDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(0, this.mod_Width, this.mod_Thickness * 0.75, this.mod_Length, 0.1, this.mod_Thickness * 0.25);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeFrontDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "FrontView" && this.mod_EdgeLeftColor_matrix.Custom_Category == "Duo") {

    const EdgeLeftDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge1Color

    const EdgeLeftDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(-0.1, 0, 0, 0.1, this.mod_Width, this.mod_Thickness * 0.75 )

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeLeftDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(-0.1, 0, this.mod_Thickness * 0.75, 0.1, this.mod_Width, this.mod_Thickness * 0.25);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeLeftDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "FrontView" && this.mod_EdgeRightColor_matrix.Custom_Category == "Duo") {

    const EdgeRightDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge1Color

    const EdgeRightDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(this.mod_Length, 0, 0, 0.1, this.mod_Width, this.mod_Thickness * 0.75 )

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeRightDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Length, 0, this.mod_Thickness * 0.75, 0.1, this.mod_Width, this.mod_Thickness * 0.25);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeRightDuoEdge2Color);
  }

    if (this.mod_TypeElement_matrix.PartView == "FrontView" && this.mod_EdgeBackColor_matrix.Custom_Category == "Duo") {

    const EdgeBackDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge1Color

    const EdgeBackDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(0, -0.1, 0, this.mod_Length, 0.1, this.mod_Thickness * 0.75 )

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeBackDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(0, -0.1, this.mod_Thickness * 0.75, this.mod_Length, 0.1, this.mod_Thickness * 0.25);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeBackDuoEdge2Color);
  }

  //===================================================
  //          PartView == ShelfView
  //===================================================

  if (this.mod_TypeElement_matrix.PartView == "ShelfView" && this.mod_EdgeFrontColor_matrix.Custom_Category == "Duo") {

    const EdgeFrontDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge1Color

    const EdgeFrontDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge2Color

    let Duo1 = this.addcpart_FrontDuoEdge1(0, 0, this.mod_Width, this.mod_Length, this.mod_Thickness * 0.75, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeFrontDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(0, this.mod_Thickness * 0.75, this.mod_Width, this.mod_Length, this.mod_Thickness * 0.25, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeFrontDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "ShelfView" && this.mod_EdgeLeftColor_matrix.Custom_Category == "Duo") {

    const EdgeLeftDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge1Color

    const EdgeLeftDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(-0.1, 0, 0, 0.1, this.mod_Thickness * 0.75, this.mod_Width)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeLeftDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(-0.1, this.mod_Thickness * 0.75, 0, 0.1, this.mod_Thickness * 0.25, this.mod_Width);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeLeftDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "ShelfView" && this.mod_EdgeRightColor_matrix.Custom_Category == "Duo") {

    const EdgeRightDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge1Color

    const EdgeRightDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(this.mod_Length, 0, 0, 0.1, this.mod_Thickness * 0.75, this.mod_Width)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeRightDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Length, this.mod_Thickness * 0.75, 0, 0.1, this.mod_Thickness * 0.25, this.mod_Width);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeRightDuoEdge2Color);
  }

    if (this.mod_TypeElement_matrix.PartView == "ShelfView" && this.mod_EdgeBackColor_matrix.Custom_Category == "Duo") {

    const EdgeBackDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge1Color

    const EdgeBackDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(0, 0, -0.1, this.mod_Length, this.mod_Thickness * 0.75, 0.1)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeBackDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(0, this.mod_Thickness * 0.75, -0.1, this.mod_Length, this.mod_Thickness * 0.25, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeBackDuoEdge2Color);
  }

//===================================================
  //          PartView == SideView
  //===================================================

  if (this.mod_TypeElement_matrix.PartView == "SideView" && this.mod_EdgeFrontColor_matrix.Custom_Category == "Duo") {

    const EdgeFrontDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge1Color

    const EdgeFrontDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeFrontColor).DuoEdge2Color

    let Duo1 = this.addcpart_FrontDuoEdge1(0, 0, this.mod_Width, this.mod_Thickness * 0.75, this.mod_Width, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeFrontDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Thickness * 0.75, 0, this.mod_Width, this.mod_Thickness * 0.25, this.mod_Width, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeFrontDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "SideView" && this.mod_EdgeLeftColor_matrix.Custom_Category == "Duo") {

    const EdgeLeftDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge1Color

    const EdgeLeftDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeLeftColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(0, this.mod_Length, 0, this.mod_Thickness * 0.75, 0.1, this.mod_Width)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeLeftDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Thickness * 0.75, this.mod_Length, 0, this.mod_Thickness * 0.25, 0.1, this.mod_Width);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeLeftDuoEdge2Color);
  }

  if (this.mod_TypeElement_matrix.PartView == "SideView" && this.mod_EdgeRightColor_matrix.Custom_Category == "Duo") {

    const EdgeRightDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge1Color

    const EdgeRightDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeRightColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(0, -0.1, 0, this.mod_Thickness * 0.75, 0.1, this.mod_Width)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeRightDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Thickness * 0.75, -0.1, 0, this.mod_Thickness * 0.25, 0.1, this.mod_Width);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeRightDuoEdge2Color);
  }

    if (this.mod_TypeElement_matrix.PartView == "SideView" && this.mod_EdgeBackColor_matrix.Custom_Category == "Duo") {

    const EdgeBackDuoEdge1Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge1Color

    const EdgeBackDuoEdge2Color = GlobalFunc.cfind_DuoEdgesMapping(this.mod_EdgeBackColor).DuoEdge2Color
    
    let Duo1 = this.addcpart_FrontDuoEdge1(0, 0, -0.1, this.mod_Thickness * 0.75, this.mod_Width, 0.1)

    GlobalFunc.process_AddMaterial(this, Duo1, 'Processing', 'None', EdgeBackDuoEdge1Color);

    let Duo2 = this.addcpart_FrontDuoEdge2(this.mod_Thickness * 0.75, 0, -0.1, this.mod_Thickness * 0.25, this.mod_Width, 0.1);

    GlobalFunc.process_AddMaterial(this, Duo2, 'Processing', 'None', EdgeBackDuoEdge2Color);
  }
