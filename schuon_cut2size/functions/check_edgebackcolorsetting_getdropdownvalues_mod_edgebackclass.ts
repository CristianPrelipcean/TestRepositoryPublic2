check_EdgeBackColorSetting_getDropDownValues_mod_EdgeBackClass(attr: Checks.IEdgeBackColorSetting_Attributes, selections: SelectionEntry_mod_EdgeBackClass[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const matches = ct_ctab_EdgeColorSettings.filter(x => x.in_BoardColor === attr.mod_Color && x.EdgeColor === attr.mod_EdgeBackColor);
    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
      const isSelectionMatched = matches.find(m => m.in_Edgebanding === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal:true });
    }
    return result;
  }

  let matches = ct_ctab_EdgeColorSettings;
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_BoardColor === attr.mod_Color);
  }
  // if (attr.mod_EdgeBackColor !== undefined) {
  //   matches = matches.filter(x => x.EdgeColor === attr.mod_EdgeBackColor);
  // }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isSelectionMatched = matches.find(m => m.in_Edgebanding === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }

  return result;
}
