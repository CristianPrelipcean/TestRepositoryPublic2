check_HingeType_getDropDownValues_mod_MountingType(attr: Checks.IHingeType_Attributes, selections: SelectionEntry_mod_MountingType[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];

    const supplierMatches = ct_tab_HingeMapping.filter(x => x.in_Supplier === attr.mod_Supplier);
    const matches = ct_tab_HingeMapping.filter(x => x.in_Supplier === attr.mod_Supplier && x.in_HingeProgram === attr.mod_HingeProgram);
    for (const selection of selections) {
      const isSupplierMatched = supplierMatches.find(m => m.in_MountingType === selection.value) !== undefined;
      if (!isSupplierMatched)
      {
        result.push({ value: selection.value, kind: Checks.CheckDropDownEntryKind.Invalid });
        continue;
      }
      // if I reach this stage, it means that the supplier is matched. I am considering now if the in_HingeProgram is conflicting
      const isMatched = matches.find(m => m.in_MountingType === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true});
    }
    return result;
  }

  let matches = ct_tab_HingeMapping;
  if (attr.mod_HingeProgram !== undefined) {
    matches = matches.filter(x => x.in_HingeProgram === attr.mod_HingeProgram);
  }

  if (attr.mod_Supplier !== undefined) {
    matches = matches.filter(x => x.in_Supplier === attr.mod_Supplier);
  }
  
  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_MountingType === selection.value) !== undefined;
    // this is used for solving. the only reason to mark something as invalid is to not be shown as a suggestion.
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}