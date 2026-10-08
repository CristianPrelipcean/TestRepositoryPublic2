  if (this.getContextData()?.insertPosition) {
    this.mod_ShelfadjGroupPositionX = this.getContextData()?.insertPosition?.[0] ?? 0;
    this.mod_ShelfadjGroupPositionY = this.getContextData()?.insertPosition?.[1] ?? 0;
    this._forcedInputAttributes ??= [];
    this._forcedInputAttributes.push("mod_ShelfadjGroupPositionX");
    this._forcedInputAttributes.push("mod_ShelfadjGroupPositionY");
  }