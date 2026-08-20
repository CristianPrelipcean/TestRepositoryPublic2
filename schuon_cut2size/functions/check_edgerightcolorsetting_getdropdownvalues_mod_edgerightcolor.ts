check_EdgeRightColorSetting_getDropDownValues_mod_EdgeRightColor(attr: Checks.IEdgeRightColorSetting_Attributes, selections: SelectionEntry_mod_EdgeRightColor[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const matches = ct_ctab_EdgeColorSettings
      .filter(x => x.in_BoardColor === attr.mod_Color && x.in_Edgebanding === attr.mod_EdgeRightClass);
    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
        const isSelectionMatched = matches.find(m => m.EdgeColor === selection.value) !== undefined;
        result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid, showAsNormal: true });
    }

    return result;
  }

  let matches = ct_ctab_EdgeColorSettings;
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_BoardColor === attr.mod_Color);
  }
  if (attr.mod_EdgeRightClass !== undefined) {
    matches = matches.filter(x => x.in_Edgebanding === attr.mod_EdgeRightClass);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
      const isSelectionMatched = matches.find(m => m.EdgeColor === selection.value) !== undefined;
      // the options that do not match the color should not appear at all.
      result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }

  return result;
}