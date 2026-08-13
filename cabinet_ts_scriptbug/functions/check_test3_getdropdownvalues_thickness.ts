check_test3_getDropDownValues_thickness(attr: Checks.Itest3_Attributes): Checks.CheckDropDownRange | undefined{
    const widthConstraints = new Map<string, { min: number; max: number }>([
    ["16", { min: 500,  max: 1200 }],
    ["18", { min: 1000, max: 1500 }],
    ["19", { min: 1000, max: 2000 }],
    ["25", { min: 1500, max: 2000 }],
]);

const widthConstraint = widthConstraints.get(String(attr.thickness ?? ""));

if (widthConstraint === undefined) {
    return undefined;
}

let { min, max } = widthConstraint;

// clamp min width by max height-to-thickness ratio
const maxHeightToThicknessRatio = 2;
if (attr.doorHeight !== undefined && attr.doorHeight > 0) {
    const minWidthByRatio = Math.ceil(attr.doorHeight / maxHeightToThicknessRatio);
    min = Math.max(min, minWidthByRatio);
}

if (min > max) {
    return undefined;
}

return { min, max };
}