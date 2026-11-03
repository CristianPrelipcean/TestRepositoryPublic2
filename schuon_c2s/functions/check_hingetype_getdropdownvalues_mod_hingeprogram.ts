check_HingeType_getDropDownValues_mod_HingeProgram(attr: Checks.IHingeType_Attributes, selections: SelectionEntry_mod_HingeProgram[]): Checks.CheckDropDownEntry[]{
if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_tab_HingeMapping.filter(x => x.in_Supplier === attr.mod_Supplier && x.in_MountingType === attr.mod_MountingType);
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_HingeProgram === selection.value) !== undefined;
        // here we do invalid, to make sure other colors do not appear. once we start hiding attributes, maybe this can be rethought
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Invalid });
    }

    return result;
  }

  let matches = ct_tab_HingeMapping;
  if (attr.mod_Supplier !== undefined) {
    matches = matches.filter(x => x.in_Supplier === attr.mod_Supplier);
  }

  if (attr.mod_MountingType !== undefined) {
    matches = matches.filter(x => x.in_MountingType === attr.mod_MountingType);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_HingeProgram === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}