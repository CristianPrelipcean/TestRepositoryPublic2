check_test3_getDropDownValues_thickness(attr: Checks.Itest3_Attributes): Checks.CheckDropDownRange | undefined{

 const thicknessConstraints = new Map<string, { min: number; max: number }>([
        ["wood",      { min: 16, max: 19 }],
        ["steel",     { min: 16, max: 22 }],
        ["glass",     { min: 6,  max: 16 }],
        ["aluminium", { min: 19, max: 25 }],
    ]);

    const thicknessConstraint = thicknessConstraints.get(attr.doorMaterial ?? "");

    if (thicknessConstraint === undefined) {
        return undefined;
    }

    const { min, max } = thicknessConstraint;

    return { min, max };

}
