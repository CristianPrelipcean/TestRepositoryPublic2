check_TypeBoardDimensions_getDropDownValues_mod_Length(attr: Checks.ITypeBoardDimensions_Attributes): Checks.CheckDropDownRange | undefined{
  if (GlobalFunc.allPropertiesDefined(attr))
  {
    const matches = ct_ctab_BoardDimensionSettings
      .filter(x => x.in_TypeElement === attr.mod_TypeElement && x.in_Program === attr.mod_Program && x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain && x.in_PartThk === attr.mod_Thickness);
    const minLength = Math.max(...matches.map(m => m.LengthMin));
    const maxLength = Math.min(...matches.map(m => m.LengthMax));

    const step = attr.mod_TypeElement === "CornerFillers" ? 0.5 : 1;

    return { min: minLength, max: maxLength, step };
  }

  let matches = ct_ctab_BoardDimensionSettings;
  if (attr.mod_Program !== undefined) {
        matches = matches.filter(x => x.in_Program === attr.mod_Program);
    }
    if (attr.mod_TypeElement !== undefined) {
        matches = matches.filter(x => x.in_TypeElement === attr.mod_TypeElement);
    }
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_TopColor === attr.mod_Color);
  }
  if (attr.mod_BtmColor !== undefined) {
    matches = matches.filter(x => x.in_BtmColor === attr.mod_BtmColor);
  }
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThk === attr.mod_Thickness);
  }
  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
  }

  const minLength = Math.min(...matches.map(m => m.LengthMin));
  const maxLength = Math.max(...matches.map(m => m.LengthMax));

  const step = attr.mod_TypeElement === "CornerFillers" ? 0.5 : 1;

  return { min: minLength, max: maxLength, step };
}