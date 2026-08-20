check_BasicProcessingViews_getDropDownValues_mod_DrillSide(attr: Checks.IBasicProcessingViews_Attributes, selections: SelectionEntry_mod_DrillSide[]): Checks.CheckDropDownEntry[]{
    let res: Checks.CheckDropDownEntry[] = [];

    selections.forEach(s => {
        let used = false;
        if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'FrontView') {
            if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' && attr.mod_ProcessingBasePoint == 'LeftBtm' ) {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' && attr.mod_ProcessingBasePoint == 'LeftTop') {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Top") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' && attr.mod_ProcessingBasePoint == 'RightBtm') {
            if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' && attr.mod_ProcessingBasePoint == 'RightTop') {
            if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Top") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        }else if (attr._moduleId == 'me_DrilVert' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
            if (s.value == "Top") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        }else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView' && attr.mod_ProcessingBasePoint == 'LeftBack' ) {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView' && attr.mod_ProcessingBasePoint == 'LeftFront') {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView' && attr.mod_ProcessingBasePoint == 'RightBack') {
            if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView' && attr.mod_ProcessingBasePoint == 'RightFront') {
            if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
            if (s.value == "Left") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Right") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        }else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView' && attr.mod_ProcessingBasePoint == 'FrontBtm' ) {
            if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView' && attr.mod_ProcessingBasePoint == 'FrontTop') {
            if (s.value == "Front") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Top") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView' && attr.mod_ProcessingBasePoint == 'BackBtm') {
            if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Btm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView' && attr.mod_ProcessingBasePoint == 'BackTop') {
            if (s.value == "Back") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "Top") {
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