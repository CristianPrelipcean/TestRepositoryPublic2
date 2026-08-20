check_BoardDimensionSettings_getDropDownValues_mod_Color(attr: Checks.IBoardDimensionSettings_Attributes, selections: SelectionEntry_mod_Color[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain && x.in_PartThickness === attr.mod_Thickness);
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_TopColor === selection.value) !== undefined;
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
    }

    return result;
  }

  let matches = ct_ctab_BoardDimensionSettings;
  if (attr.mod_BtmColor !== undefined) {
    matches = matches.filter(x => x.in_BtmColor === attr.mod_BtmColor);
  }
  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
  }
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThickness === attr.mod_Thickness);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_TopColor === selection.value) !== undefined;
    // this is used for solving. the only reason to mark something as invalid is to not be shown as a suggestion.
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}