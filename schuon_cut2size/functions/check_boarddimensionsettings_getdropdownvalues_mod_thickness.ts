check_BoardDimensionSettings_getDropDownValues_mod_Thickness(attr: Checks.IBoardDimensionSettings_Attributes, selections: SelectionEntry_mod_Thickness[]): Checks.CheckDropDownEntry[] {
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TopColor === attr.mod_Color && x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain);
    for (const selection of selections) {
      const isMatched = matches.find(m => m.in_PartThickness === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid });
    }

    return result;
  }

  let matches = ct_ctab_BoardDimensionSettings;
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
    const isMatched = matches.find(m => m.in_PartThickness === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}