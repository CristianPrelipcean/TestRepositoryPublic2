check_BasicProcessingViews_getDropDownValues_mod_TypeElement(attr: Checks.IBasicProcessingViews_Attributes, selections: SelectionEntry_mod_TypeElement[]): Checks.CheckDropDownEntry[]{
       let res: Checks.CheckDropDownEntry[] = [];

    selections.forEach(s => {
        let used = false;
        if (attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Front' || attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Back' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Left' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Right' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Top' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Btm') {
            s.matrix?.PartView == "FrontView"
                if (res.some(p => p.value !== s.value)) {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
        }
        else if (attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Top' || attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Btm' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Left' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Right' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Front' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Back') {
            s.matrix?.PartView == "ShelfView"
                if (res.some(p => p.value !== s.value)) {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
        }
        else if (attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Left' || attr._moduleId == 'me_DrillVert' && attr.mod_DrillSide == 'Right' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Front' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Back' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Top' || attr._moduleId == 'me_DrillHor' && attr.mod_DrillSide == 'Btm') {
            s.matrix?.PartView == "SideView"
                if (res.some(p => p.value !== s.value)) {
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