
  const Information = JSON.parse(this.mod_Information) 

  let DrawerFront = this.addpart_InnerDrawerFront(Information.front.PosX, Information.front.PosY, Information.front.PosZ, Information.front.DimX, Information.front.DimY, Information.front.DimZ);

  this.assignPartGroup(this.mod_InnerDrawerId, DrawerFront);
  this.assignOpenGroup(this.mod_InnerDrawerId, DrawerFront);
  
  GlobalFunc.process_AddMaterial(DrawerFront, "", this.mod_InnerDrawerFrontColor);
