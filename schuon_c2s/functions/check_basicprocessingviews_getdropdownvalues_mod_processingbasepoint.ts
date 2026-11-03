check_BasicProcessingViews_getDropDownValues_mod_ProcessingBasePoint(attr: Checks.IBasicProcessingViews_Attributes, selections: SelectionEntry_mod_ProcessingBasePoint[]): Checks.CheckDropDownEntry[]{
    let res: Checks.CheckDropDownEntry[] = [];
    if (GlobalFunc.allPropertiesDefined(attr)) {
        selections.forEach(s => {
            let used = false;
            if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' ) {
                if (s.value == "LeftBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "LeftTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "RightBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }else if (s.value == "RightTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
            } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView') {
                if (s.value == "LeftBtm") {
                    const isNormal = attr.mod_DrillSide === 'Left' || attr.mod_DrillSide === 'Btm';
                    res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                    used = true;
                } else if (s.value == "LeftTop") {
                    const isNormal = attr.mod_DrillSide === 'Left' || attr.mod_DrillSide === 'Top';
                    res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                    used = true;
                } else if (s.value == "RightBtm") {
                    const isNormal = attr.mod_DrillSide === 'Right' || attr.mod_DrillSide === 'Btm';
                    res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                    used = true;
                } else if (s.value == "RightTop") {
                    const isNormal = attr.mod_DrillSide === 'Right' || attr.mod_DrillSide === 'Top';
                    res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                    used = true;
                }
            } else if (attr._moduleId == 'me_DrilVert' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
                if (s.value == "LeftBack") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "LeftFront") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "RightBack") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }else if (s.value == "RightFront") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
            } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
                if (s.value == "LeftBack") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "LeftFront") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "RightBack") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "RightFront") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
            } else if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
                if (s.value == "FrontBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "FrontTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "BackBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }else if (s.value == "BackTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
            } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
                if (s.value == "FrontTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "FrontBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "BackTop") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                } else if (s.value == "BackBtm") {
                    res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                    used = true;
                }
            } 

            if (!used){
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Invalid });
            }
        });
    }

    selections.forEach(s => {
        let used = false;
        if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'FrontView' ) {
            if (s.value == "LeftBtm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "LeftTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "RightBtm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }else if (s.value == "RightTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'FrontView') {
            if (s.value == "LeftBtm") {
                const isNormal = attr.mod_DrillSide === 'Left' || attr.mod_DrillSide === 'Btm';
                res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                used = true;
            } else if (s.value == "LeftTop") {
                const isNormal = attr.mod_DrillSide === 'Left' || attr.mod_DrillSide === 'Top';
                res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                used = true;
            } else if (s.value == "RightBtm") {
                const isNormal = attr.mod_DrillSide === 'Right' || attr.mod_DrillSide === 'Btm';
                res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                used = true;
            } else if (s.value == "RightTop") {
                const isNormal = attr.mod_DrillSide === 'Right' || attr.mod_DrillSide === 'Top';
                res.push({ value: s.value, kind: isNormal? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrilVert' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
            if (s.value == "LeftBack") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "LeftFront") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "RightBack") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }else if (s.value == "RightFront") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'ShelfView') {
            if (s.value == "LeftBack") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "LeftFront") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "RightBack") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "RightFront") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillVert' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
            if (s.value == "FrontBtm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "FrontTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "BackBtm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }else if (s.value == "BackTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            }
        } else if (attr._moduleId == 'me_DrillHor' && attr.mod_TypeElement_matrix?.PartView == 'SideView') {
            if (s.value == "FrontTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "FrontBtm") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "BackTop") {
                res.push({ value: s.value, kind: Checks.CheckDropDownEntryKind.Normal });
                used = true;
            } else if (s.value == "BackBtm") {
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