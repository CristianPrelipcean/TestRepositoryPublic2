  if (this.mod_CeilingFillerConstruction === 'Construction1') {
    // "Solution2"
    const horizontalFittingPanel = this.addpart_CeilingFillerPanel(
      0,
      0,
      - this.mod_CeilingFillerFittingPanelDepth,
      this.mod_Width,
      this.mod_CeilingFillerFittingPanelThk,
      this.mod_CeilingFillerFittingPanelDepth
    );
    GlobalFunc.process_AddMaterial(horizontalFittingPanel, 'shelf', this.mod_CeilingFillerColor, this.mod_CeilingFillerColor, this.mod_CeilingFillerEdgeFrontColor, this.mod_CeilingFillerEdgeFrontColor, 'None', false, false);
    const verticalFillerPanel = this.addpart_CeilingFillerPanel(
      0,
      this.mod_FrontGapHor / 2,
      this.mod_FrontGapCarcase,
      this.mod_Width,
      this.mod_CeilingFillerHeight,
      this.mod_CeilingFillerThk
    );
    GlobalFunc.process_AddMaterial(verticalFillerPanel, 'front', this.mod_CeilingFillerColor, this.mod_CeilingFillerColor, this.mod_CeilingFillerEdgeFrontColor, this.mod_CeilingFillerEdgeFrontColor, 'None', false, false);
  }
  else if (this.mod_CeilingFillerConstruction === 'Construction2') {
    // "Solution3"
    const verticalFillerPanel = this.addpart_CeilingFillerPanel(
      0,
      0,
      -this.mod_CeilingFillerThk - this.mod_CeilingFillerRecess,
      this.mod_Width,
      this.mod_CeilingFillerHeight,
      this.mod_CeilingFillerThk
    );
    GlobalFunc.process_AddMaterial(verticalFillerPanel, 'front', this.mod_CeilingFillerColor, this.mod_CeilingFillerColor, this.mod_CeilingFillerEdgeFrontColor, this.mod_CeilingFillerEdgeFrontColor, 'None', false, false);
  }
  else {
    logError(`mc_CeilingFiller01 selected construction ${this.mod_CeilingFillerConstruction} is not supported`);
  }