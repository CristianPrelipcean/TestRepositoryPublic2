check_BoardDimensionSettings_getDropDownValues_mod_Width(attr: Checks.IBoardDimensionSettings_Attributes): Checks.CheckDropDownRange | undefined{
  if (GlobalFunc.allPropertiesDefined(attr))
  {
    const matches = ct_ctab_BoardDimensionSettings
      .filter(x => x.in_TopColor === attr.mod_Color && x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain && x.in_PartThickness === attr.mod_Thickness);
    const minWidth = Math.max(...matches.map(m => m.WidthMin));
    const maxWidth = Math.min(...matches.map(m => m.WidthMax));
    return { min: minWidth, max: maxWidth, step: 1 };
  }

  let matches = ct_ctab_BoardDimensionSettings;
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_TopColor === attr.mod_Color);
  }
  if (attr.mod_BtmColor !== undefined) {
    matches = matches.filter(x => x.in_BtmColor === attr.mod_BtmColor);
  }
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThickness === attr.mod_Thickness);
  }
  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
  }

  const minWidth = Math.min(...matches.map(m => m.WidthMin));
  const maxWidth = Math.max(...matches.map(m => m.WidthMax));
  return { min: minWidth, max: maxWidth, step: 1 };
}