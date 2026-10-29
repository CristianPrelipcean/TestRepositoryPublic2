  if (this.getContextData()?.insertPosition) {
    this.mod_ClothingOrganizerWidthPosition = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_ClothingOrganizerHeightPosition = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes ??= [];
    this._forcedInputAttributes.push("mod_ClothingOrganizerWidthPosition");
    this._forcedInputAttributes.push("mod_ClothingOrganizerHeightPosition");
  }