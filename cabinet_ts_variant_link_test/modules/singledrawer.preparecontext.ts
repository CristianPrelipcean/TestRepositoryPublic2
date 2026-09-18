const ctx = this.getContextData();
if (ctx && ctx.insertPosition) {
  this.startPos = ctx.insertPosition[1];
  this._forcedInputAttributes = ['startPos'];
}