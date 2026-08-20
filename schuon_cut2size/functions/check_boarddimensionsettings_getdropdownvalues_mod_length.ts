check_BoardDimensionSettings_getDropDownValues_mod_Length(attr: Checks.IBoardDimensionSettings_Attributes): Checks.CheckDropDownRange | undefined{
  if (GlobalFunc.allPropertiesDefined(attr))
  {
    const matches = ct_ctab_BoardDimensionSettings
      .filter(x => x.in_TopColor === attr.mod_Color && x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain && x.in_PartThickness === attr.mod_Thickness);
    const minLength = Math.max(...matches.map(m => m.LengthMin));
    const maxLength = Math.min(...matches.map(m => m.LengthMax));
    return { min: minLength, max: maxLength, step: 1 };
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

  const minLength = Math.min(...matches.map(m => m.LengthMin));
  const maxLength = Math.max(...matches.map(m => m.LengthMax));
  return { min: minLength, max: maxLength, step: 1 };
}