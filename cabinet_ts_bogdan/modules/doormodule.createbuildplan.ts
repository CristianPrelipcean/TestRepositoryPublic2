  const xMargin = 200;
  const yMargin = 200;
  const depth = 100;
  const windowOffset = 10;

  this.adddoorBoard(0, 0, 0, this.doorWidth, this.doorHeight, depth);
  if (this.doorMaterial_matrix.Custom_WindowSupport) {
    this.adddoorWindow(xMargin, yMargin, windowOffset, this.doorWidth - 2 * xMargin, this.doorHeight - 2 * yMargin, depth - 2 * windowOffset);
  }

  const knobSize = 50;
  this.adddoorKnob(this.doorWidth - xMargin / 2, this.doorHeight / 2 - knobSize, 0, knobSize, knobSize, -knobSize);