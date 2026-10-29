
  // By Jiri Polcar

  if (this.mod_PaneltopConstruction === 'Construction1') {
    // "Solution1"
    const partPaneltop = this.addpart_Paneltop(
      0,
      0,
      -this.mod_Depth,
      this.mod_Width,
      this.mod_PaneltopThk,
      this.mod_Depth
    );
    GlobalFunc.process_AddMaterialGeneratedParts(partPaneltop, 'horizontalPanel', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopEdgeFrontColor, this.mod_PaneltopEdgeFrontColor, false, false);
  }
  else {
    logError(`mc_Paneltop01 selected construction ${this.mod_PaneltopConstruction} is not supported`);
  }