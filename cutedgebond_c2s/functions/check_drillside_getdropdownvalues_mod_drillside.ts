check_DrillSide_getDropDownValues_mod_DrillSide(attr: Checks.IDrillSide_Attributes, selections: SelectionEntry_mod_DrillSide[]): Checks.CheckDropDownEntry[]{
    let res: Checks.CheckDropDownEntry[] = [];

    selections.forEach(s => {
        let used = false;
        if (attr._moduleId == 'me_DrillingLine' && attr.mod_TypeElement_matrix?.PartView == 'FrontView') {
            if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillingLine' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
            if (s.value == "Top") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillingLine' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        }

        if (!used){
            res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Invalid });
        }
    });
    return res;
}