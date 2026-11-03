

  let drillVert = this.m.filter(p => p instanceof OD_M_me_DrillVert);
  drillVert.forEach(p => {
    p.setOrigin(0, 0, this.cmod_EndPanelLegLength - this.mod_Thickness);
  })

  // Add module

  this.addOD_M_cmc_EndPanel01(0);

  // POS Data
  this._posData.set('depth', this.cmod_EndPanelLegLength);
  this._posData.set('width', this.mod_Length);
  this._posData.set('height', this.mod_Width);
  this._posData.set('color', this.mod_Color);
  