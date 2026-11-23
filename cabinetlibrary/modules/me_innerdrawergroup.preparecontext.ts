  if (this.getContextData()?.insertPosition) {
    this.mod_InnerDrawerWidthPosition = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_InnerDrawerHeightPosition = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes ??= [];
    this._forcedInputAttributes.push("mod_InnerDrawerWidthPosition");
    this._forcedInputAttributes.push("mod_InnerDrawerHeightPosition");
  }