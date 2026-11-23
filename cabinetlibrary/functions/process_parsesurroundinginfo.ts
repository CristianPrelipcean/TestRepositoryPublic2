process_ParseSuroundingInfo(raw: string | undefined): {
    InformationVersion: number;
    IsComplete: boolean;
    PlinthAreaVisLeft: 1 | 0;
    PlinthAreaVisRight: 1 | 0;
    CeilingAreaVisLeft: 1 | 0;
    CeilingAreaVisRight: 1 | 0;
    CarcaseVisLeft: 1 | 0;
    CarcaseVisRight: 1 | 0;
    CountertopVisLeft: 1 | 0;
    CountertopVisRight: 1 | 0;
    AutoFillerLeft: boolean;
    AutoFillerRight: boolean;
    WallDistanceLeft: number;
    WallDistanceRight: number;
}// HOMAG Digital
// Create: Not documented (legacy)
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Validates the calculated finish and side completion information in mod_InformationList[0].
// Returns separate carcase and countertop values with an explicit completeness status.
// The callable name remains process_ParseSuroundingInfo.

// Revisions:
// 2026-11-02 | Ludwig Weber | Nobilia step 1: decoupled carcase finish from spatial side completion.
// 2026-11-02 | Ludwig Weber | Standardized script headers, block comments and English wording.

//======================================================================

//======================================================================
// process_ParseSuroundingInfo
//======================================================================
{
    //======================================================================
    // Initialize result
    //======================================================================
    const result = {
        InformationVersion: 2,
        IsComplete: false,
        PlinthAreaVisLeft: 0 as 1 | 0,
        PlinthAreaVisRight: 0 as 1 | 0,
        CeilingAreaVisLeft: 0 as 1 | 0,
        CeilingAreaVisRight: 0 as 1 | 0,
        CarcaseVisLeft: 0 as 1 | 0,
        CarcaseVisRight: 0 as 1 | 0,
        CountertopVisLeft: 0 as 1 | 0,
        CountertopVisRight: 0 as 1 | 0,
        AutoFillerLeft: false,
        AutoFillerRight: false,
        WallDistanceLeft: 999,
        WallDistanceRight: 999,
    };

    //======================================================================
    // Validate JSON payload
    //======================================================================
    let parsed: unknown;
    try {
        if (!raw) {
            logError('mod_InformationList[0] is empty.');
            return result;
        }
        parsed = JSON.parse(raw);
    } catch (error: unknown) {
        logError(`Invalid storageunitInfo JSON: ${error instanceof Error ? error.message : String(error)}`);
        return result;
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        logError('storageunitInfo must be an object.');
        return result;
    }
    const value = parsed as Record<string, unknown>;
    if (value['InformationVersion'] !== 2 || value['IsComplete'] !== true) {
        logError('storageunitInfo requires complete version 2 data.');
        return result;
    }

    //======================================================================
    // isVisibility
    //======================================================================
    function isVisibility(item: unknown): item is 1 | 0 {
        return item === 0 || item === 1;
    }

    //======================================================================
    // Read side completion values
    //======================================================================
    const plinthLeft = value['PlinthAreaVisLeft'];
    const plinthRight = value['PlinthAreaVisRight'];
    const ceilingLeft = value['CeilingAreaVisLeft'];
    const ceilingRight = value['CeilingAreaVisRight'];
    const carcaseLeft = value['CarcaseVisLeft'];
    const carcaseRight = value['CarcaseVisRight'];
    const countertopLeft = value['CountertopVisLeft'];
    const countertopRight = value['CountertopVisRight'];
    const fillerLeft = value['AutoFillerLeft'];
    const fillerRight = value['AutoFillerRight'];
    const wallLeft = value['WallDistanceLeft'];
    const wallRight = value['WallDistanceRight'];
    if (
        !isVisibility(plinthLeft) ||
        !isVisibility(plinthRight) ||
        !isVisibility(ceilingLeft) ||
        !isVisibility(ceilingRight) ||
        !isVisibility(carcaseLeft) ||
        !isVisibility(carcaseRight) ||
        !isVisibility(countertopLeft) ||
        !isVisibility(countertopRight) ||
        typeof fillerLeft !== 'boolean' ||
        typeof fillerRight !== 'boolean' ||
        typeof wallLeft !== 'number' ||
        !Number.isFinite(wallLeft) ||
        typeof wallRight !== 'number' ||
        !Number.isFinite(wallRight)
    ) {
        logError('storageunitInfo contains invalid side completion values.');
        return result;
    }
    return {
        InformationVersion: 2,
        IsComplete: true,
        PlinthAreaVisLeft: plinthLeft,
        PlinthAreaVisRight: plinthRight,
        CeilingAreaVisLeft: ceilingLeft,
        CeilingAreaVisRight: ceilingRight,
        CarcaseVisLeft: carcaseLeft,
        CarcaseVisRight: carcaseRight,
        CountertopVisLeft: countertopLeft,
        CountertopVisRight: countertopRight,
        AutoFillerLeft: fillerLeft,
        AutoFillerRight: fillerRight,
        WallDistanceLeft: wallLeft,
        WallDistanceRight: wallRight,
    };
}
