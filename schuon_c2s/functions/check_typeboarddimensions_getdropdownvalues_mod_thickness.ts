check_TypeBoardDimensions_getDropDownValues_mod_Thickness(attr: Checks.ITypeBoardDimensions_Attributes, selections: SelectionEntry_mod_Thickness[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];

    const thicknessMatches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TopColor === attr.mod_Color && x.in_Grain === attr.mod_PartGrain);
      const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TypeElement === attr.mod_TypeElement && x.in_Program === attr.mod_Program && x.in_TopColor === attr.mod_Color && x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain);
    for (const selection of selections) {

      /*
      const isthicknessMatches = thicknessMatches.find(m => m.in_PartThk === (selection.value)) !== undefined;
      if (!isthicknessMatches) {
        result.push({ value: selection.value, kind: Checks.CheckDropDownEntryKind.Invalid });
        continue
      }
      */
      const isMatched = matches.find(m => m.in_PartThk === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid });
    }

    return result;
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
    if (attr.mod_PartGrain !== undefined) {
        matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
    }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_PartThk === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}