
// UShape
  if (this.cmod_EndPanelType == "UShape") {
    this.addpart_PartPlaceholder(this.mod_Thickness, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length - (2 * this.mod_Thickness), this.mod_Width, this.mod_Thickness)
  }

// LShapeLeft
  if (this.cmod_EndPanelType == "LShapeLeft") {
    this.addpart_PartPlaceholder(this.mod_Thickness, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length - this.mod_Thickness, this.mod_Width, this.mod_Thickness)
  }

// LShapeRight
if (this.cmod_EndPanelType == "LShapeRight") {
    this.addpart_PartPlaceholder(0, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length - this.mod_Thickness, this.mod_Width, this.mod_Thickness)
  }
