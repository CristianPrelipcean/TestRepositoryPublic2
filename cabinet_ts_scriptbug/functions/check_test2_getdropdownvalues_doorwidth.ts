check_test2_getDropDownValues_doorWidth(attr: Checks.Itest2_Attributes): Checks.CheckDropDownRange | undefined {
    const widthConstraints = new Map<string, { min: number; max: number }>([
        ["0",  { min: 1000, max: 2000 }],
        ["32", { min: 1000, max: 1500 }],
        ["64", { min: 500,  max: 1200 }],
        ["96", { min: 1500, max: 2000 }],
    ]);

    const widthConstraint = widthConstraints.get(String(attr.handleOffset ?? ""));

    if (widthConstraint === undefined) {
        return undefined;
    }

    let { min, max } = widthConstraint;

    // clamp min width by max height-to-width ratio
    const maxHeightToWidthRatio = 2;
    if (attr.doorHeight !== undefined && attr.doorHeight > 0) {
        const minWidthByRatio = Math.ceil(attr.doorHeight / maxHeightToWidthRatio);
        min = Math.max(min, minWidthByRatio);
    }

    if (min > max) {
        return undefined;
    }

    return { min, max };
}