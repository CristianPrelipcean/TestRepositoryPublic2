check_BoardDimensionSettings_getDropDownValues_mod_PartGrain(attr: Checks.IBoardDimensionSettings_Attributes, selections: SelectionEntry_mod_PartGrain[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TopColor === attr.mod_Color && x.in_BtmColor === attr.mod_BtmColor && x.in_PartThickness === attr.mod_Thickness);
    for (const selection of selections) {
        const selectionMatches = matches.filter(m => m.in_Grain === selection.value);
        // there are actually no conflicts, then it's normal
        // there are some conflicts caused by length, for example, the entry should mark this as conflicting, appear as normal
        // there are conflicts caused by other causes, then it's invalid
        let kind = Checks.CheckDropDownEntryKind.Normal;
        if (selectionMatches.length === 0) {
          kind = Checks.CheckDropDownEntryKind.Invalid;
        }
        else {
          const dimensionMatches = selectionMatches.filter(m => m.LengthMin <= attr.mod_Length! && attr.mod_Length! <= m.LengthMax &&
            m.WidthMin <= attr.mod_Width! && attr.mod_Width! <= m.WidthMax);
            if (dimensionMatches.length === 0) {
              kind = Checks.CheckDropDownEntryKind.Conflicting;
            }
        }
        result.push({ value: selection.value, kind, showAsNormal: true });
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
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThickness === attr.mod_Thickness);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_Grain === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}
