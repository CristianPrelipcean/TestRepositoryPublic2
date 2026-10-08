
  if (this.getContextData()?.insertPosition) {
    this.mod_VertDividerPosition = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_VertDividerPositionY = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes ??= [];
    this._forcedInputAttributes.push("mod_VertDividerPosition");
    this._forcedInputAttributes.push("mod_VertDividerPositionY");
  }