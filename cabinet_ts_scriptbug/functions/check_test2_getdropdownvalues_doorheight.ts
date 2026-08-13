check_test2_getDropDownValues_doorHeight(attr: Checks.Itest2_Attributes): Checks.CheckDropDownRange | undefined {
    const heightConstraints = new Map<string, { min: number; max: number }>([
        ["0",   { min: 1500, max: 2200 }],
        ["32",  { min: 2000, max: 2500 }],
        ["64",  { min: 2000, max: 3000 }],
        ["96",  { min: 2500, max: 3000 }],
    ]);

    const heightConstraint = heightConstraints.get(String(attr.handleOffset ?? ""));

    if (heightConstraint === undefined) {
        return undefined;
    }

    let { min, max } = heightConstraint;

    // clamp max height by max height-to-width ratio
    const maxHeightToWidthRatio = 2;
    if (attr.doorWidth !== undefined && attr.doorWidth > 0) {
        const maxHeightByRatio = Math.floor(attr.doorWidth * maxHeightToWidthRatio);
        max = Math.min(max, maxHeightByRatio);
    }

    if (min > max) {
        return undefined;
    }

    const result = { min, max };
    return result;
}