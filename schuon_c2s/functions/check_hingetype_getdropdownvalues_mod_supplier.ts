check_HingeType_getDropDownValues_mod_Supplier(attr: Checks.IHingeType_Attributes, selections: SelectionEntry_mod_Supplier[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_tab_HingeMapping.filter(x => x.in_Supplier === attr.mod_Supplier && x.in_HingeProgram === attr.mod_HingeProgram && x.in_MountingType === attr.mod_MountingType);
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_Supplier === selection.value) !== undefined;
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
    }

    return result;
  }

  let matches = ct_tab_HingeMapping;
  if (attr.mod_HingeProgram !== undefined) {
    matches = matches.filter(x => x.in_HingeProgram === attr.mod_HingeProgram);
  }
  if (attr.mod_MountingType !== undefined) {
    matches = matches.filter(x => x.in_MountingType === attr.mod_MountingType);
  }
  /*
  if (attr.mod_Supplier !== undefined) {
    matches = matches.filter(x => x.in_Supplier === attr.mod_Supplier);
  }
  */
  

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_Supplier === selection.value) !== undefined;
    // this is used for solving. the only reason to mark something as invalid is to not be shown as a suggestion.
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}