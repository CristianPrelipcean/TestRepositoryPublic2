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

let { min, max } = heightConstraint;

// clamp max height by max height-to-thickness ratio
const maxHeightToThicknessRatio = 2;
if (attr.thickness !== undefined && attr.thickness > 0) {
    const maxHeightByRatio = Math.floor(attr.thickness * maxHeightToThicknessRatio);
    max = Math.min(max, maxHeightByRatio);
}

if (min > max) {
    return undefined;
}

return { min, max };}