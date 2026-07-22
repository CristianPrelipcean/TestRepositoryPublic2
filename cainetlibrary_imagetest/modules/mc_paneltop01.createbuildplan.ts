
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
    GlobalFunc.process_AddMaterial(partPaneltop, 'shelf', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopEdgeFrontColor, this.mod_PaneltopEdgeFrontColor, 'None', false, false);
  }
  /*
  else if (this.mod_PaneltopConstruction === 'Construction2') {
    // "Solution2"
    const horizontalFittingPanel = this.addpart_Paneltop(
      0,
      0,
      - this.mod_CeilingFillerFittingPanelDepth,
      this.mod_Width,
      this.mod_CeilingFillerFittingPanelThk,
      this.mod_CeilingFillerFittingPanelDepth
    );
    GlobalFunc.process_AddMaterial(horizontalFittingPanel, 'shelf', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopEdgeFrontColor, this.mod_PaneltopEdgeFrontColor, 'None', false, false);
    const verticalFillerPanel = this.addpart_CeilingFillerPanel(
      0,
      this.mod_FrontGapHor / 2,
      this.mod_FrontGapCarcase,
      this.mod_Width,
      this.mod_CeilingFillerHeight,
      this.mod_CeilingFillerThk
    );
    GlobalFunc.process_AddMaterial(verticalFillerPanel, 'front', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopEdgeFrontColor, this.mod_PaneltopEdgeFrontColor, 'None', false, false);
  }
  else if (this.mod_PaneltopConstruction === 'Construction3') {
    // "Solution3"
    const verticalFillerPanel = this.addpart_CeilingFillerPanel(
      0,
      0,
      -this.mod_CeilingFillerThk - this.mod_CeilingFillerRecess,
      this.mod_Width,
      this.mod_CeilingFillerHeight,
      this.mod_CeilingFillerThk
    );
    GlobalFunc.process_AddMaterial(verticalFillerPanel, 'front', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopEdgeFrontColor, this.mod_PaneltopEdgeFrontColor, 'None', false, false);
  }
  */
  else {
    logError(`mc_Paneltop01 selected construction ${this.mod_PaneltopConstruction} is not supported`);
  }