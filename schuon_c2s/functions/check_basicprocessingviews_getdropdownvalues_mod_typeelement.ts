check_BasicProcessingViews_getDropDownValues_mod_TypeElement(attr: Checks.IBasicProcessingViews_Attributes, selections: SelectionEntry_mod_TypeElement[]): Checks.CheckDropDownEntry[]{
    const allowedViews: Record<string, string[]> = {
    "me_DrillVert:Front": ["FrontView"],
    "me_DrillVert:Back": ["FrontView"],
    "me_DrillVert:Top": ["ShelfView"],
    "me_DrillVert:Btm": ["ShelfView"],
    "me_DrillVert:Left": ["SideView"],
    "me_DrillVert:Right": ["SideView"],
    "me_DrillHor:Left": ["FrontView", "ShelfView"],
    "me_DrillHor:Right": ["FrontView", "ShelfView"],
    "me_DrillHor:Front": ["ShelfView", "SideView"],
    "me_DrillHor:Back": ["ShelfView", "SideView"],
    "me_DrillHor:Top": ["FrontView", "SideView"],
    "me_DrillHor:Btm": ["FrontView", "SideView"],
  };

  // this split is a bit redundant, but it makes the split between calculating dropdowns and solving conflicts explicit.
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const validViews = allowedViews[`${attr._moduleId}:${attr.mod_DrillSide!}`];
    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
      const isSelectionMatched = validViews.includes(selection.matrix?.PartView ?? "");
      result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
    }
    return result;
  }

  const validViews = attr.mod_DrillSide
    ? allowedViews[`${attr._moduleId}:${attr.mod_DrillSide}`]
    : undefined;

  const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
      const isSelectionMatched = !validViews || validViews.includes(selection.matrix?.PartView ?? "");
      result.push({ value: selection.value, kind: isSelectionMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
    }
    return result;
}