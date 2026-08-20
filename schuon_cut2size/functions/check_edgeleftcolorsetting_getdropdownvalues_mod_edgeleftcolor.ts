check_EdgeLeftColorSetting_getDropDownValues_mod_EdgeLeftColor(attr: Checks.IEdgeLeftColorSetting_Attributes, selections: SelectionEntry_mod_EdgeLeftColor[]): Checks.CheckDropDownEntry[]{

  if (GlobalFunc.allPropertiesDefined(attr)) {
    const matches = ct_ctab_EdgeColorSettings
      .filter(x => x.in_BoardColor === attr.mod_Color && x.in_Edgebanding === attr.mod_EdgeLeftClass);
    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
      const isSelectionMatched = matches.find(m => m.EdgeColor === selection.value) !== undefined;
        // here I set invalid instead of conflicting. 
        result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid, showAsNormal: true });
    }

    return result;
  }

  let matches = ct_ctab_EdgeColorSettings;
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_BoardColor === attr.mod_Color);
  }
  if (attr.mod_EdgeLeftClass !== undefined) {
    matches = matches.filter(x => x.in_Edgebanding === attr.mod_EdgeLeftClass);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
      const isSelectionMatched = matches.find(m => m.EdgeColor === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }

  return result;
}