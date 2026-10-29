  if (this.getContextData()?.insertPosition) {
    this.mod_ShelffixedPosX = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_ShelffixedPosY = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes ??= [];
    this._forcedInputAttributes.push("mod_ShelffixedPosX");
    this._forcedInputAttributes.push("mod_ShelffixedPosY");
  }