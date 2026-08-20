check_BoardDimensionSettings_getDropDownValues_mod_BtmColor(attr: Checks.IBoardDimensionSettings_Attributes, selections: SelectionEntry_mod_BtmColor[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TopColor === attr.mod_Color && x.in_Grain === attr.mod_PartGrain && x.in_PartThickness === attr.mod_Thickness);
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_BtmColor === selection.value) !== undefined;
        // here we do invalid, to make sure other colors do not appear. once we start hiding attributes, maybe this can be rethought
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid });
    }

    return result;
  }

  let matches = ct_ctab_BoardDimensionSettings;
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_TopColor === attr.mod_Color);
  }
  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
  }
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThickness === attr.mod_Thickness);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_BtmColor === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}