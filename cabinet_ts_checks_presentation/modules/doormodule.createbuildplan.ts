  const xMargin = 200;
  const yMargin = 200;
  const depth = 100;
  const windowOffset = -15;

  const materialMap = new Map<string, string>([
    // ['wood', 'ikea:IKEA_Tingsryd_wood_effect_black'],
    ['wood', 'room_designer:oak'],
    ['glass', 'fantoni_1:8A'],
    ['steel', 'usm:metallHandle'],
    ['aluminium', 'usm:RAL2004'],
  ]);

  const doorMaterialId = materialMap.get(this.doorMaterial)!;
  const doorKnobMaterialId = materialMap.get(this.doorHandleMaterial)!;

  const doorBoardPart = this.adddoorBoard(0, 0, 0, this.doorWidth, this.doorHeight, 100);
  doorBoardPart.addFaceMaterial(doorMaterialId);
  if (this.doorMaterial_matrix.Custom_WindowSupport) {
    const extrudedPart = this.adddoorBoard(xMargin, yMargin, windowOffset, this.doorWidth - 2 * xMargin, this.doorHeight - 2 * yMargin, depth - 2 * windowOffset);
    extrudedPart.extrude(`<svg><rect x="${0}" y="${0}" width="${this.doorWidth - 2 * xMargin}" height="${this.doorHeight - 2 * yMargin}" /></svg>`,'z')
    const doorWindowPart = this.adddoorWindow(xMargin, yMargin, windowOffset, this.doorWidth - 2 * xMargin, this.doorHeight - 2 * yMargin, depth - 2 * windowOffset);
    doorWindowPart.addFaceMaterial('fantoni_1:8A');
  }

  const knobSize = 50;
  const doorKnobPart = this.adddoorKnob(this.doorWidth - xMargin / 2, this.doorHeight / 2 - knobSize, 0, knobSize, knobSize, -knobSize);
  doorKnobPart.addFaceMaterial(doorKnobMaterialId);