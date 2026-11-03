process_BondingDecider(topColor: string,  bottomColor: string, targetThickness: number): boolean {

  // If different colors -> bonding
  if (topColor !== bottomColor) {
    return true;
  }

  // If there is no matching board mapping for (topColor + targetThickness) -> bonding
  const hasMapping = ct_tab_BoardMapping.some(m => m.in_Color === topColor && m.in_ThkMin <= targetThickness && m.in_ThkMax >= targetThickness);
  return !hasMapping ;
}