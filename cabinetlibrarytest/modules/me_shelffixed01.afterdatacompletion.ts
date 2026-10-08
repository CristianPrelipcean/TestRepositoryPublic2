  // Add the module
  let fixedShelf = this.addOD_M_mc_StorageunitShelffixed01();

  // Set the attributes  
  fixedShelf.mod_Width = this.mod_Width;
  fixedShelf.mod_Depth = this.mod_Depth;

  // Set origin
  fixedShelf.setOrigin(0, this.mod_ShelffixedPosY, 0);