check_HingeType_getDropDownValues_mod_HingeDrillingDistance(attr: Checks.IHingeType_Attributes): Checks.CheckDropDownRange | undefined{
  if (GlobalFunc.allPropertiesDefined(attr))
  {
    const matches = ct_tab_HingeMapping
      .filter(x => x.in_Supplier === attr.mod_Supplier && x.in_HingeProgram === attr.mod_HingeProgram && x.in_MountingType === attr.mod_MountingType);
    const minWidth = Math.max(...matches.map(m => m.HingeDrillingDistanceMin));
    const maxWidth = Math.min(...matches.map(m => m.HingeDrillingDistanceMax));
    return { min: minWidth, max: maxWidth, step: 1 };
  }

  let matches = ct_tab_HingeMapping;
  if (attr.mod_Supplier !== undefined) {
    matches = matches.filter(x => x.in_Supplier === attr.mod_Supplier);
  }
  if (attr.mod_HingeProgram !== undefined) {
    matches = matches.filter(x => x.in_HingeProgram === attr.mod_HingeProgram);
  }
  if (attr.mod_MountingType !== undefined) {
    matches = matches.filter(x => x.in_MountingType === attr.mod_MountingType);
  }

  const minWidth = Math.min(...matches.map(m => m.HingeDrillingDistanceMin));
  const maxWidth = Math.max(...matches.map(m => m.HingeDrillingDistanceMax));
  return { min: minWidth, max: maxWidth, step: 1 };
}