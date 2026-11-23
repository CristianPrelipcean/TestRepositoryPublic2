  this._forcedInputAttributes ??= [];

  if (this.getContextData()?.insertPosition) {
    this.mod_ClothingOrganizerWidthPosition = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_ClothingOrganizerHeightPosition = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes.push("mod_ClothingOrganizerWidthPosition");
    this._forcedInputAttributes.push("mod_ClothingOrganizerHeightPosition");
  }

  //--------------- Get the positionZ of hardware -----------------------------------
  // NOTE JL: Previously to having the descriptor attribute in the SalesConfigurator this was not here and it was completly controlled in the process_ClothingOrganizer
  const positionSettings = GlobalFunc.find_ClothingOrganizerDepthPosition(this.mod_ClothingOrganizerType!, this.mod_ClothingOrganizerDesign!);
  this.mod_ClothingOrganizerDepthPosition = positionSettings.DescriptorDepthPosition ?? "";
  this._forcedInputAttributes.push("mod_ClothingOrganizerDepthPosition");