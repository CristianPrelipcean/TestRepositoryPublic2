check_test3_getDropDownValues_doorHeight(attr: Checks.Itest3_Attributes): Checks.CheckDropDownRange | undefined{
 const heightConstraints = new Map<string, { min: number; max: number }>([
        ["wood",      { min: 2000, max: 3000 }],
        ["steel",     { min: 2000, max: 2500 }],
        ["glass",     { min: 1500, max: 2200 }],
        ["aluminium", { min: 2500, max: 3000 }],
    ]);

    const heightConstraint = heightConstraints.get(attr.doorMaterial ?? "");

    if (heightConstraint === undefined) {
        return undefined;
    }

    return { min: heightConstraint.min, max: heightConstraint.max };}