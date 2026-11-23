// HOMAG Digital
// Create: February 2024
// By Joao Lisboa
// Purpose: CabinetLibrary

// Description:
// Resolves visible carcase sides and spatial side closures with the direction mask.
// Builds the existing carcase, fronts, corner filler and dockings at the calculated height.
// Does not create automatic uprights or additional wall fillers.

// Revisions:
// 2026-11-02 | Ludwig Weber | Add standalone Cornerunit context, height and direction-dependent side completion.

//======================================================================

//======================================================================
// Resolve physical height and the direction-dependent side permission
//======================================================================
const carcaseHeight = this.mod_CarcaseHeight > 0 ? this.mod_CarcaseHeight : this.mod_Height;
const StartPosCabinet = this.mod_PlacementLevels === 'OnFloor' ? this.mod_PlinthAreaHeight : 0;
const allowLeft = this.mod_CarcaseDirection === 'Right';
const allowRight = this.mod_CarcaseDirection === 'Left';
const coverageTolerance = 0.001;
interface SideCoverage {
    HeightFrom: number;
    HeightTo: number;
    DepthFrom: number;
    DepthTo: number;
}
interface SideContext {
    ContextVersion: number;
    DataComplete: boolean;
    SideCoverageComplete: boolean;
    SideCoverageLeft: SideCoverage[];
    SideCoverageRight: SideCoverage[];
    NeedsVisibleSideLeft: boolean;
    NeedsVisibleSideRight: boolean;
    HasDockingLeft: boolean;
    HasDockingRight: boolean;
    DistanceWallLeft: number;
    DistanceWallRight: number;
    DistanceWallBack: number;
    SlopedCeiling: boolean;
    SlopedCeilingDirection: 'toLeft' | 'toRight' | 'toBack' | null;
    SlopedCeilingAngle: number;
    SlopedCeilingLevel: number;
}

// Never reuse a successful decision from a previous failed calculation.
this.mod_InformationList[0] = '';

//======================================================================
// isRecord
//======================================================================
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

//======================================================================
// isCoverage
//======================================================================
function isCoverage(value: unknown): value is SideCoverage {
    if (!isRecord(value)) return false;
    return (
        ['HeightFrom', 'HeightTo', 'DepthFrom', 'DepthTo'].every(
            (key: string) => typeof value[key] === 'number' && Number.isFinite(value[key]),
        ) &&
        Number(value['HeightTo']) > Number(value['HeightFrom']) &&
        Number(value['DepthTo']) > Number(value['DepthFrom'])
    );
}

//======================================================================
// isSideContext
//======================================================================
function isSideContext(value: unknown): value is SideContext {
    if (
        !isRecord(value) ||
        value['ContextVersion'] !== 2 ||
        typeof value['DataComplete'] !== 'boolean' ||
        typeof value['SideCoverageComplete'] !== 'boolean'
    )
        return false;
    const booleans = [
        'NeedsVisibleSideLeft',
        'NeedsVisibleSideRight',
        'HasDockingLeft',
        'HasDockingRight',
        'SlopedCeiling',
    ];
    const numbers = [
        'DistanceWallLeft',
        'DistanceWallRight',
        'DistanceWallBack',
        'SlopedCeilingAngle',
        'SlopedCeilingLevel',
    ];
    const left: unknown = value['SideCoverageLeft'];
    const right: unknown = value['SideCoverageRight'];
    const direction = value['SlopedCeilingDirection'];
    return (
        booleans.every((key: string) => typeof value[key] === 'boolean') &&
        numbers.every((key: string) => typeof value[key] === 'number' && Number.isFinite(value[key])) &&
        (direction === null || direction === 'toLeft' || direction === 'toRight' || direction === 'toBack') &&
        Array.isArray(left) &&
        left.every((item: unknown) => isCoverage(item)) &&
        Array.isArray(right) &&
        right.every((item: unknown) => isCoverage(item))
    );
}

// Master-data calculations have no room. A neutral context is a valid
// standalone mode, not a reason to stop carcase, front or appliance creation.
let moduleContextInfo: SideContext = {
    ContextVersion: 2,
    DataComplete: false,
    SideCoverageComplete: false,
    SideCoverageLeft: [],
    SideCoverageRight: [],
    NeedsVisibleSideLeft: false,
    NeedsVisibleSideRight: false,
    HasDockingLeft: false,
    HasDockingRight: false,
    DistanceWallLeft: 999,
    DistanceWallRight: 999,
    DistanceWallBack: 0,
    SlopedCeiling: false,
    SlopedCeilingDirection: null,
    SlopedCeilingAngle: 0,
    SlopedCeilingLevel: 0,
};
let parsedContext: unknown;
try {
    const raw = this.mod_ModuleContextInformationList[0];
    if (raw) parsedContext = JSON.parse(raw);
} catch (error: unknown) {
    logError(
        `mr_CornerunitStraight: invalid context JSON; continuing without room information: ${error instanceof Error ? error.message : String(error)}`,
    );
}
if (isSideContext(parsedContext)) moduleContextInfo = parsedContext;
const hasModuleContextInfo = moduleContextInfo.DataComplete === true;
const hasSideCoverage = moduleContextInfo.SideCoverageComplete === true;

//======================================================================
// Resolve finish and closure needs independently
//======================================================================
const wallDistanceLeft = moduleContextInfo.DistanceWallLeft;
const wallDistanceRight = moduleContextInfo.DistanceWallRight;
const needsAutomaticSideLeft =
    hasModuleContextInfo && wallDistanceLeft > 20 && moduleContextInfo.NeedsVisibleSideLeft;
const needsAutomaticSideRight =
    hasModuleContextInfo && wallDistanceRight > 20 && moduleContextInfo.NeedsVisibleSideRight;
type VisibilityValue = 1 | 0;
interface SideInformation {
    InformationVersion: number;
    IsComplete: boolean;
    PlinthAreaVisLeft: VisibilityValue;
    PlinthAreaVisRight: VisibilityValue;
    CeilingAreaVisLeft: VisibilityValue;
    CeilingAreaVisRight: VisibilityValue;
    CarcaseVisLeft: VisibilityValue;
    CarcaseVisRight: VisibilityValue;
    CountertopVisLeft: VisibilityValue;
    CountertopVisRight: VisibilityValue;
    AutoFillerLeft: boolean;
    AutoFillerRight: boolean;
    AutoUprightLeft: boolean;
    AutoUprightRight: boolean;
    WallDistanceLeft: number;
    WallDistanceRight: number;
}

// Cover the complete closure rectangle, including combined neighbours and gaps.

//======================================================================
// isFullyCovered
//======================================================================
function isFullyCovered(
    coverage: readonly SideCoverage[],
    heightFrom: number,
    heightTo: number,
    depthTo: number,
): boolean {
    const heights = [heightFrom, heightTo];
    for (const item of coverage) {
        if (item.HeightFrom > heightFrom && item.HeightFrom < heightTo) heights.push(item.HeightFrom);
        if (item.HeightTo > heightFrom && item.HeightTo < heightTo) heights.push(item.HeightTo);
    }
    heights.sort((a: number, b: number) => a - b);
    const probes: number[] = heightTo - heightFrom <= coverageTolerance ? [(heightFrom + heightTo) / 2] : [];
    for (let index = 1; index < heights.length; index++) {
        const previous = heights[index - 1];
        const current = heights[index];
        if (previous !== undefined && current !== undefined && current - previous > coverageTolerance) {
            probes.push((previous + current) / 2);
        }
    }
    return (
        probes.length > 0 &&
        probes.every((probe: number) => {
            const intervals = coverage
                .filter(
                    (item: SideCoverage) =>
                        item.HeightFrom <= probe + coverageTolerance &&
                        item.HeightTo >= probe - coverageTolerance,
                )
                .sort((a: SideCoverage, b: SideCoverage) => a.DepthFrom - b.DepthFrom);
            let coveredTo = 0;
            for (const interval of intervals) {
                if (interval.DepthTo <= coveredTo) continue;
                if (interval.DepthFrom > coveredTo + coverageTolerance) return false;
                coveredTo = Math.max(coveredTo, interval.DepthTo);
                if (coveredTo >= depthTo - coverageTolerance) return true;
            }
            return false;
        })
    );
}

//======================================================================
// resolveVisibility
//======================================================================
function resolveVisibility(
    selection: string | undefined,
    automaticValue: boolean,
): VisibilityValue | undefined {
    switch (selection) {
        case 'Automatic':
            return automaticValue ? 1 : 0;
        case 'Visible':
            return 1;
        case 'NotVisible':
            return 0;
        default:
            logError(`mr_CornerunitStraight: unknown visibility selection '${String(selection)}'.`);
            return undefined;
    }
}

//======================================================================
// buildSideInformation
//======================================================================
const buildSideInformation = (carcaseHeight: number): SideInformation | undefined => {
    const ceilingHeight = this.mod_CreateCeilingFiller ? this.mod_CarcaseCeilingDistance : 0;
    if (
        !Number.isFinite(StartPosCabinet) ||
        StartPosCabinet < 0 ||
        typeof ceilingHeight !== 'number' ||
        !Number.isFinite(ceilingHeight) ||
        ceilingHeight < 0 ||
        !Number.isFinite(this.mod_Depth) ||
        this.mod_Depth <= 0
    ) {
        logError('mr_CornerunitStraight: invalid dimensions for side coverage.');
        return undefined;
    }
    const carcaseTop = StartPosCabinet + carcaseHeight;
    const left = hasSideCoverage ? moduleContextInfo.SideCoverageLeft : [];
    const right = hasSideCoverage ? moduleContextInfo.SideCoverageRight : [];
    // Only actual neighbours suppress automatic closures; the Cornerunit creates no wall fillers.
    const plinthLeft = !(
        moduleContextInfo.HasDockingLeft && isFullyCovered(left, 0, StartPosCabinet, this.mod_Depth)
    );
    const plinthRight = !(
        moduleContextInfo.HasDockingRight && isFullyCovered(right, 0, StartPosCabinet, this.mod_Depth)
    );
    const ceilingLeft = !(
        moduleContextInfo.HasDockingLeft &&
        isFullyCovered(left, carcaseTop, carcaseTop + ceilingHeight, this.mod_Depth)
    );
    const ceilingRight = !(
        moduleContextInfo.HasDockingRight &&
        isFullyCovered(right, carcaseTop, carcaseTop + ceilingHeight, this.mod_Depth)
    );
    const countertopLeft = !(
        moduleContextInfo.HasDockingLeft && isFullyCovered(left, carcaseTop, carcaseTop, this.mod_Depth)
    );
    const countertopRight = !(
        moduleContextInfo.HasDockingRight && isFullyCovered(right, carcaseTop, carcaseTop, this.mod_Depth)
    );

    const carcaseVisLeft = resolveVisibility(this.mod_CarcaseVisLeftSelection, needsAutomaticSideLeft);
    const carcaseVisRight = resolveVisibility(this.mod_CarcaseVisRightSelection, needsAutomaticSideRight);
    const plinthVisLeft = resolveVisibility(this.mod_PlinthAreaVisLeftSelection, plinthLeft);
    const plinthVisRight = resolveVisibility(this.mod_PlinthAreaVisRightSelection, plinthRight);
    const ceilingVisLeft = resolveVisibility(this.mod_CeilingAreaVisLeftSelection, ceilingLeft);
    const ceilingVisRight = resolveVisibility(this.mod_CeilingAreaVisRightSelection, ceilingRight);
    if (
        carcaseVisLeft === undefined ||
        carcaseVisRight === undefined ||
        plinthVisLeft === undefined ||
        plinthVisRight === undefined ||
        ceilingVisLeft === undefined ||
        ceilingVisRight === undefined
    )
        return undefined;

    return {
        InformationVersion: 2,
        IsComplete: true,
        PlinthAreaVisLeft: allowLeft ? plinthVisLeft : 0,
        PlinthAreaVisRight: allowRight ? plinthVisRight : 0,
        CeilingAreaVisLeft: allowLeft ? ceilingVisLeft : 0,
        CeilingAreaVisRight: allowRight ? ceilingVisRight : 0,
        CarcaseVisLeft: allowLeft ? carcaseVisLeft : 0,
        CarcaseVisRight: allowRight ? carcaseVisRight : 0,
        CountertopVisLeft: allowLeft ? (countertopLeft ? 1 : 0) : 0,
        CountertopVisRight: allowRight ? (countertopRight ? 1 : 0) : 0,
        AutoFillerLeft: false,
        AutoFillerRight: false,
        AutoUprightLeft: false,
        AutoUprightRight: false,
        WallDistanceLeft: wallDistanceLeft,
        WallDistanceRight: wallDistanceRight,
    };
};

//======================================================================
// Publish the current decisions before constructing children
//======================================================================
const sideInformation = buildSideInformation(carcaseHeight);
if (!sideInformation) return;
this.mod_InformationList[0] = JSON.stringify(sideInformation);

//======================================================================
// Create the existing carcase
//======================================================================
let carc = this.addOD_M_mc_Storageunit01(0);

// Calculation of the carcase width and starting Position (Endless cabinets)
//--------------------------------------------------------------------------------------------------------

//======================================================================
// GetSideAdjustment
//======================================================================
function GetSideAdjustment(type: string, thickness: number): number {
    switch (type) {
        case 'OutSp':
        case 'NoSpAtOutSpOversized':
            return 0;
        case 'NoSpAtOutSp':
            return thickness;
        case 'NoSpAtMiSp':
        case 'MiSp':
            return thickness / 2;
        default:
            return 0;
    }
}

//======================================================================
// GetCarcaseMovement
//======================================================================
function GetCarcaseMovement(leftType: string, leftThk: number): number {
    switch (leftType) {
        case 'MiSp':
        case 'NoSpAtMiSp':
            return -leftThk / 2;
        case 'NoSpAtOutSp':
            return -leftThk;
        default:
            return 0;
    }
}

//======================================================================
// CalculateCarcaseWidth
//======================================================================
function CalculateCarcaseWidth(
    leftType: string,
    rightType: string,
    width: number,
    leftThk: number,
    rightThk: number,
    direction: string,
): number {
    const leftAdjustment = direction === 'Right' ? GetSideAdjustment(leftType, leftThk) : 0;
    const rightAdjustment = direction === 'Left' ? GetSideAdjustment(rightType, rightThk) : 0;

    return width + leftAdjustment + rightAdjustment;
}

// Set the values to the relevant attributes of the carcase
//--------------------------------------------------------------------------------------------------------

let CarcaseMovement =
    this.mod_CarcaseDirection === 'Right'
        ? GetCarcaseMovement(this.mod_SidepanelleftType, this.mod_SidepanelleftThk)
        : 0;

carc.mod_CarcaseWidth = CalculateCarcaseWidth(
    this.mod_SidepanelleftType,
    this.mod_SidepanelrightType,
    this.mod_Width,
    this.mod_SidepanelleftThk,
    this.mod_SidepanelrightThk,
    this.mod_CarcaseDirection,
);
carc.mod_CarcaseMovement = CarcaseMovement;
carc.mod_CarcaseDepth = this.mod_Depth;
carc.mod_CarcaseHeight = carcaseHeight;
carc.mod_CarcaseDirection = this.mod_CarcaseDirection;
carc.mod_CarcaseId = 'Carcase_01';
carc.mod_CarcaseVisLeft = sideInformation.CarcaseVisLeft === 1;
carc.mod_CarcaseVisRight = sideInformation.CarcaseVisRight === 1;
if (this.mod_CarcaseDirection === 'Right') {
    if (this.mod_SidepanelrightType != 'OutSp')
        logWarning(
            'CornerunitStraight in carcase direction Right can not change the type of the sidepanel right. It will keep the value OutSp!',
        );
    carc.mod_SidepanelleftType = this.mod_SidepanelleftType;
} else {
    if (this.mod_SidepanelleftType != 'OutSp')
        logWarning(
            'CornerunitStraight in carcase direction Left can not change the type of the sidepanel left. It will keep the value OutSp!',
        );
    carc.mod_SidepanelrightType = this.mod_SidepanelrightType;
}

// Set origin of the carcase
//--------------------------------------------------------------------------------------------------------

carc.setOrigin(CarcaseMovement, StartPosCabinet, 0);

// Save origin in Attribute
carc.mod_Originpos.push(CarcaseMovement);
carc.mod_Originpos.push(StartPosCabinet);
carc.mod_Originpos.push(0);

//======================================================================
//          Define Depth Reduction depending on Sidepanelmiddle
// It's used as Front Overdimension in fixed shelves and reduces the space depth in all fronts
//======================================================================
let spaceDepthReduction: number = 0;
if (this.mod_CornerunitStraightConstruction_matrix.IncludeMiddleSideShort == true) {
    spaceDepthReduction = this.g.basic_SidepanelmiddleShortWidth + this.g.basic_OffsetFrontVertDivider;
} else if (this.mod_CornerunitStraightConstruction_matrix.IncludePanelblind == true) {
    spaceDepthReduction = this.mod_PanelblindThk + this.g.basic_OffsetFrontVertDivider;
} else {
    spaceDepthReduction = 0;
}

//======================================================================
//          Cycle through the childs and manage the front elements
//======================================================================

// Define variables
let GlobalCount: number = 0;
let CountDoor: number = 0;
let CountDrawer: number = 0;
let CountFixedfront: number = 0;
let CountFiller: number = 0;
let LastFrontElem: number = 0;
let LastFrontHeight: number = 0;
let CountFingerGrip: number = 0;
let tmpGapMid: number = 0;
let FingerGripLine: number = 0;
let FingergripBottom = false;
let StartPos = this.mod_FrontPosStart + StartPosCabinet;
let tmpLastStartPos: number[] = []; //Stores the position of each front
tmpLastStartPos[0] = 0;
let tmpLastGap: number[] = []; //Stores the gap between each fronts (either normal gap or fingergrip gap)
tmpLastGap[0] = 0;
let tmpLastFrontFingergrip: boolean[] = [false]; // Stores if the front has fingergrip
tmpLastFrontFingergrip[0] = false;
// It makes no sense to fetch this before the mf_CornerFillerFront is sealed [JP]
// let FillerWidthLeft = 0;
// let FillerWidthRight = 0;

// Initialize fingergrip information for the carcase
carc.mod_FingergripTop = false;
carc.mod_FingergripQtyMiddle = 0;
carc.mod_FingergripPos1 = 0;
carc.mod_FingergripPos2 = 0;
carc.mod_FingergripPos3 = 0;
carc.mod_FingergripPos4 = 0;
carc.mod_FingergripPos5 = 0;

//Initialize Backwall constriuction and Backwall position
carc.mod_CarcaseBackwallConstructionList[1] = this.mod_CarcaseBackwallConstruction!;
carc.mod_BackwallPosList[1] = this.mod_BackwallPos!;

//Initialize variables for Dividers
let VertDividerType: string[] = [];
let VertDividerFrontWidth: number[] = [];
let VertDividerFrontName: string[] = [];

// Cycle
this.m.forEach((p) => {
    //======================================================================
    // Manage the sink
    //======================================================================

    if (p instanceof OD_M_mf_Sink) {
        // Movement in height
        p.setOrigin(
            this.mod_Width / 2,
            StartPosCabinet + carcaseHeight + this.mod_CountertopThk,
            this.mod_Depth + this.g.basic_CountertopOverhangFront,
        );

        // Seal the sink
        let sealedSink = p.seal();

        // Read sink data (to provide it for the drawings via the contour)
        if (sealedSink.mod_CountertopInfo.length > 0 && sealedSink.mod_CountertopInfo[0] != null) {
            this.mod_CountertopInfo.push(sealedSink.mod_CountertopInfo[0]);
        }
    } else {
        //======================================================================
        // Manage generic dimensions and gaps for all front elements
        //======================================================================
        if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Fixedfront) {
            // Create Carcase ID and Attributes
            GlobalCount++;
            p.mod_CarcaseId = 'Carcase_01';
            p.mod_CarcaseDepth = this.mod_Depth;
            p.mod_CarcaseWidth = this.mod_Width;
            p.mod_FrontWidth = this.mod_CornerunitFrontWidth;
            p.mod_CarcaseHeight = carcaseHeight;
            p.mod_FrontPosStart = StartPos - StartPosCabinet;

            // setOrigin
            if (this.mod_CarcaseDirection == 'Left') {
                p.setOrigin(this.mod_Width - this.mod_CornerunitFrontWidth, StartPos, this.mod_Depth);
                p.mod_Originpos[0] = this.mod_Width - this.mod_CornerunitFrontWidth;
            } else {
                p.setOrigin(0, StartPos, this.mod_Depth);
                p.mod_Originpos[0] = 0;
            }

            p.mod_Originpos[1] = StartPos;
            p.mod_Originpos[2] = this.mod_Depth;

            // Check first and last front element
            if (StartPos + p.mod_FrontHeightSelection! >= carcaseHeight + StartPosCabinet) {
                LastFrontElem = 1;
            }

            // Error if front element start over the carcase top end
            if (StartPos >= carcaseHeight + StartPosCabinet) {
                let ErrorMessage = GlobalFunc.find_ErrorList('Error 22019', 1);
                logError(ErrorMessage.Message(''));
            }

            // Calculation of front height and set information to carcase regarding fingergrip
            if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
                carc.mod_FingergripTop = true;
                p.mod_FrontHeight =
                    carcaseHeight -
                    (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!);
                LastFrontHeight = carcaseHeight - (StartPos - StartPosCabinet);
                StartPos = carcaseHeight;
                tmpLastStartPos.push(StartPos - StartPosCabinet);
                tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
                if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) {
                    p.mod_FingergripBtmType = carc.mod_FingergripType!;
                } else {
                    p.mod_FingergripBtmType = 'NoFingergrip';
                }
                tmpLastFrontFingergrip.push(true);
                p.mod_FingergripTopType = carc.mod_FingergripType!;
            } else if (LastFrontElem == 1 && p.mod_FingergripTop == false) {
                p.mod_FrontHeight = carcaseHeight - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
                LastFrontHeight = carcaseHeight - (StartPos - StartPosCabinet);
                StartPos = carcaseHeight;
                tmpLastStartPos.push(StartPos - StartPosCabinet);
                tmpLastGap.push(this.mod_FrontGapHorTop);
                if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) {
                    p.mod_FingergripBtmType = carc.mod_FingergripType!;
                } else {
                    p.mod_FingergripBtmType = 'NoFingergrip';
                }
                tmpLastFrontFingergrip.push(false);
                p.mod_FingergripTopType = 'NoFingergrip';
            } else {
                if (p.mod_FingergripTop == true) {
                    tmpGapMid =
                        this.mod_FingergripType_matrix.CShapeHeight! -
                        (this.mod_FingergripType_matrix.CShapeOverlapBelow! +
                            this.mod_FingergripType_matrix.CShapeOverlapAbove!);
                    p.mod_FrontHeight = p.mod_FrontHeightSelection! - tmpGapMid;
                    StartPos +=
                        p.mod_FrontHeightSelection! -
                        tmpGapMid -
                        this.mod_FingergripType_matrix.CShapeOverlapBelow! +
                        this.mod_FingergripType_matrix.CShapeHeight! -
                        this.mod_FingergripType_matrix.CShapeOverlapAbove!;

                    FingerGripLine =
                        StartPos +
                        this.mod_FingergripType_matrix.CShapeOverlapAbove! -
                        (StartPosCabinet + this.mod_FingergripType_matrix.CShapeHeight! / 2);
                    CountFingerGrip++;

                    switch (CountFingerGrip) {
                        case 1:
                            carc.mod_FingergripPos1 = FingerGripLine;
                            break;
                        case 2:
                            carc.mod_FingergripPos2 = FingerGripLine;
                            break;
                        case 3:
                            carc.mod_FingergripPos3 = FingerGripLine;
                            break;
                        case 4:
                            carc.mod_FingergripPos4 = FingerGripLine;
                            break;
                        case 5:
                            carc.mod_FingergripPos5 = FingerGripLine;
                            break;
                        default:
                            let ErrorMessage = GlobalFunc.find_ErrorList('Error 22020', 1);
                            logError(ErrorMessage.Message(''));
                            break;
                    }
                    tmpLastStartPos.push(StartPos - StartPosCabinet);
                    tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
                    if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) {
                        p.mod_FingergripBtmType = carc.mod_FingergripType!;
                    } else {
                        p.mod_FingergripBtmType = 'NoFingergrip';
                    }
                    tmpLastFrontFingergrip.push(true);
                    p.mod_FingergripTopType = carc.mod_FingergripType!;
                } else {
                    StartPos += p.mod_FrontHeightSelection!;
                    p.mod_FrontHeight = p.mod_FrontHeightSelection! - this.mod_FrontGapHor;
                    tmpLastStartPos.push(StartPos - StartPosCabinet);
                    tmpLastGap.push(this.mod_FrontGapHor / 2);
                    if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) {
                        p.mod_FingergripBtmType = carc.mod_FingergripType!;
                    } else {
                        p.mod_FingergripBtmType = 'NoFingergrip';
                    }
                    tmpLastFrontFingergrip.push(false);
                    p.mod_FingergripTopType = 'NoFingergrip';
                }
            }
        }

        //======================================================================
        // Provide the data of the last front to the carcase
        //======================================================================

        if (LastFrontElem == 1) {
            // Height of the last front element
            carc.mod_LastFrontHeight = LastFrontHeight;

            // FrontName
            if (p instanceof OD_M_mf_Door) {
                carc.mod_LastFrontName = 'door';
            } else if (p instanceof OD_M_mf_Drawer) {
                carc.mod_LastFrontName = 'drawer';
            } else if (p instanceof OD_M_mf_RackArea) {
                carc.mod_LastFrontName = 'rackarea';
            } else if (p instanceof OD_M_mf_Fixedfront) {
                carc.mod_LastFrontName = 'fixedfront';
            }
        }

        //======================================================================
        // Manage the global oversize
        //======================================================================

        if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Fixedfront) {
            // First front element
            //--------------------------------------------------------------------------------------------------------
            if (GlobalCount === 1) {
                // Flag for first front element
                p.mod_FirstFront = true;

                // Apply global oversize if front element has no oversize defined
                if (this.mod_GlobalFrontOversizeBtm > 0 && p.mod_FrontOversizeBtm === 0) {
                    p.mod_FrontOversizeBtm = this.mod_GlobalFrontOversizeBtm;
                }
            } else {
                p.mod_FirstFront = false;
                p.mod_FrontOversizeBtm = 0;
            }

            // Last front element
            //--------------------------------------------------------------------------------------------------------
            if (LastFrontElem === 1) {
                // Flag for last front element
                p.mod_LastFront = true;

                // Apply global oversize if front element has no oversize defined
                if (this.mod_GlobalFrontOversizeTop > 0 && p.mod_FrontOversizeTop === 0) {
                    p.mod_FrontOversizeTop = this.mod_GlobalFrontOversizeTop;
                }
            } else {
                p.mod_LastFront = false;
                p.mod_FrontOversizeTop = 0;
            }

            // Oversize to the side
            //--------------------------------------------------------------------------------------------------------
            if (this.mod_GlobalFrontOversizeLeft > 0 && p.mod_FrontOversizeLeft === 0) {
                p.mod_FrontOversizeLeft = this.mod_GlobalFrontOversizeLeft;
            }
            if (this.mod_GlobalFrontOversizeRight > 0 && p.mod_FrontOversizeRight === 0) {
                p.mod_FrontOversizeRight = this.mod_GlobalFrontOversizeRight;
            }
        }

        //======================================================================
        // Manage the fixed shelves
        //======================================================================

        if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Fixedfront) {
            // Interface to provide the data for the carcase
            //--------------------------------------------------------------------------------------------------------

            interface ShelfFixedInfo {
                PosY: number; // Height position of the fixed shelf
                Fingergrip: boolean; // Fingergrip in front of the fixed shelf
                Position: string; // Position of the fixed shelf related to the fingergrip
                FingergripType: string; // Version of fingergrip to get the dimensions
                Backside: string; // Attribute for "Contact" or "ThrougBw"
                Part: string; // Shelffixed or Rail
            }

            // Function to create ShelfFixedInfo
            //--------------------------------------------------------------------------------------------------------

            //======================================================================
            // createShelfFixedInfo
            //======================================================================
            function createShelfFixedInfo(p: any, m: any): ShelfFixedInfo {
                return {
                    PosY: tmpLastStartPos[GlobalCount - 1] - tmpLastGap[GlobalCount - 1],
                    Fingergrip: tmpLastFrontFingergrip[GlobalCount - 1] || false,
                    Position: p.mod_ShelffixedPos || 'None',
                    FingergripType: m.mod_FingergripType || 'None',
                    Backside: p.mod_ShelffixedType || 'None',
                    Part: 'part_Shelffixed',
                };
            }

            // Check the different situations
            //--------------------------------------------------------------------------------------------------------

            let insertFixedShelf = false;

            // If it's the first front element, we don't need a fixed shelf
            if (GlobalCount === 1) {
                p.mod_ShelffixedBtm = false;
            }
            // If it's not the first front element and fixed shelf has been selected
            else if (GlobalCount > 1 && p.mod_ShelffixedBtm) {
                insertFixedShelf = true;
            }

            // Stringify the object and push it to the list attribute
            //--------------------------------------------------------------------------------------------------------

            if (insertFixedShelf) {
                carc.mod_ShelffixedInfoList.push(JSON.stringify(createShelfFixedInfo(p, this)));
            }

            //======================================================================
            // Collect the data of the fronts to supply it to the carcase
            //======================================================================

            // Interface to provide the data for the carcase
            //--------------------------------------------------------------------------------------------------------

            interface FrontInfo {
                FrontCategory: string; // Identificator of sepecial fronts
                StartingPosition: number; // Starting position of the front
                FrontHeight: number; // Height of the front set from the UserExit
                RealFrontHeight: number; // Calculated front height without gaps
                BackwallConstruction: string; // Backwall construction selected on the front
                BackwallPosition: number; // Backwall position selected on the front
                FixedshelfBottom: boolean; // Fixed shelf selected on the front
                FingergripBottom: boolean; // Fingergrip on bottom (true / false)
                FingergripTop: boolean; // Fingergrip on top (true / false)
                FringergripType: string; // Type of fingergrip (dimensions)
            }

            // Create the object
            //--------------------------------------------------------------------------------------------------------

            let frontInfo: FrontInfo = {
                FrontCategory: 'Standard',
                StartingPosition: p.mod_FrontPosStart!,
                FrontHeight: p.mod_FrontHeightSelection!,
                RealFrontHeight: p.mod_FrontHeight!,
                BackwallConstruction: p.mod_CarcaseBackwallConstruction!,
                BackwallPosition: p.mod_BackwallPos!,
                FixedshelfBottom: p.mod_ShelffixedBtm!,
                FingergripBottom: FingergripBottom,
                FingergripTop: !!p.mod_FingergripTop,
                FringergripType: this.mod_FingergripType,
            };

            // Save the fingergrip for the next front
            FingergripBottom = !!p.mod_FingergripTop;

            // Stringify the object and push it to the list attribute
            //--------------------------------------------------------------------------------------------------------
            carc.mod_FrontAreaInfoList.push(JSON.stringify(frontInfo));
        }

        //======================================================================
        // Create Front ID
        //======================================================================

        if (p instanceof OD_M_mf_Door) {
            CountDoor++;
            p.mod_FrontId = 'Door_' + CountDoor;
        }
        if (p instanceof OD_M_mf_Drawer) {
            CountDrawer++;
            p.mod_FrontId = 'Drawer_' + CountDrawer;
        }
        if (p instanceof OD_M_mf_Fixedfront) {
            CountFixedfront++;
            p.mod_FrontId = 'Fixedfront_' + CountFixedfront;
        }
        /*
			if (p instanceof OD_M_mf_Fliplift) { CountFlipLift++; p.mod_FrontId = 'Fliplift_' + CountFlipLift; }						
			if (p instanceof OD_M_mf_Oven) { CountOven++; p.mod_FrontId = 'Oven_' + CountOven; }
			if (p instanceof OD_M_mf_Fridge) { CountFridge++; p.mod_FrontId = 'Door_' + CountFridge; }
			if (p instanceof OD_M_mf_RackArea) { CountRackArea++; p.mod_FrontId = 'RackArea_' + CountRackArea; }
			*/

        //======================================================================
        // Error Checking
        //======================================================================
        if (
            p instanceof OD_M_mf_Drawer &&
            p.mod_DrawerType == 'Double' &&
            p.mod_VertDividerType! != 'MiddleSide' &&
            p.mod_VertDividerType! != 'MiddleSideShort'
        ) {
            let ErrorMessage = GlobalFunc.find_ErrorList('Error 22029', 1);
            logError(ErrorMessage.Message(''));
        } else if (p instanceof OD_M_mf_Door && p.mod_VertDividerType_matrix?.IncludeDivider! == true) {
            let ErrorMessage = GlobalFunc.find_ErrorList('Error 22030', 1);
            logError(ErrorMessage.Message(''));
        } else if (
            p instanceof OD_M_mf_Door &&
            (p.mod_DoorDirection! == 'LeftLeft' || p.mod_DoorDirection! == 'RightRight')
        ) {
            let ErrorMessage = GlobalFunc.find_ErrorList('Error 22031', 1);
            logError(ErrorMessage.Message(''));
        }

        //======================================================================
        // Manage the Vert Dividers
        //======================================================================

        if (p instanceof OD_M_mf_Door) {
            p.mod_CarcaseDirectionInfo = this.mod_CarcaseDirection!;

            // Get the Information about the doors
            let doorInfo = GlobalFunc.process_Door(p);
            p.mod_DoorDirection = doorInfo.RealDoorDirection;
            p.mod_DoorType = doorInfo.RealDoorType;
            p.mod_Information = JSON.stringify(doorInfo);

            // Set the values of the attributes (will be provided to the carcase)
            VertDividerType[GlobalCount] = doorInfo.VertDivider;
            if (this.mod_CarcaseDirection == 'Right') {
                VertDividerFrontWidth[GlobalCount] = doorInfo.FrontWidthList[0];
            } else // this.mod_CarcaseDirection == 'Left'
            {
                VertDividerFrontWidth[GlobalCount] =
                    this.mod_Width - this.mod_CornerunitFrontWidth + doorInfo.FrontWidthList[0];
            }
            VertDividerFrontName[GlobalCount] = p.mod_ModuleName!;
        } else {
            VertDividerType[GlobalCount] = 'NoVertDivider';
        }
    }
});

//======================================================================
//          Stringify the Divider Information and pass it to the mc_Storageunit (will be used to insert the VertDivider in the mc_Storageunit)
//======================================================================
let VertDividerInfo: any = {
    Type: VertDividerType,
    FrontWidth: VertDividerFrontWidth,
    FrontName: VertDividerFrontName,
    PosX: undefined,
    DimX: undefined,
    FreeSpaceWidth: undefined,
    FreeSpaceWidthStartPos: undefined,
};

let strJson = JSON.stringify(VertDividerInfo);
carc.mod_VertDividerInfoList.push(strJson);

//======================================================================
// Manage the fingergrip
//======================================================================

carc.mod_FingergripQtyMiddle = CountFingerGrip;

//======================================================================
// Manage the filler
//======================================================================
// Cycle
this.m.forEach((f) => {
    // Manage generic dimensions and gaps for all front elements
    //======================================================================

    if (f instanceof OD_M_mf_CornerFillerFront) {
        CountFiller++;

        const fillerHeightFingergripReduction = carc.mod_FingergripTop
            ? (this.mod_FingergripType_matrix.LShapeGapAbove ?? 0)
            : 0;

        f.mod_CarcaseId = 'Carcase_01';
        f.mod_CarcaseDepth = this.mod_Depth;
        f.mod_CarcaseWidth = this.mod_Width;
        f.mod_CarcaseHeight = carcaseHeight;
        f.mod_FrontPosStart = this.mod_FrontPosStart + StartPosCabinet;
        f.mod_HeightLeft =
            carcaseHeight -
            this.mod_FrontGapHorTop -
            this.mod_FrontPosStart -
            fillerHeightFingergripReduction;
        f.mod_HeightRight =
            carcaseHeight -
            this.mod_FrontGapHorTop -
            this.mod_FrontPosStart -
            fillerHeightFingergripReduction;
        f.mod_CarcaseDirection = this.mod_CarcaseDirection;
        f.mod_CornerunitFrontWidth = this.mod_CornerunitFrontWidth;
        f.mod_FrontId = CountFiller.toString();

        f.setOrigin(0, this.mod_FrontPosStart + StartPosCabinet, 0);
        f.mod_Originpos[0] = 0;
        f.mod_Originpos[1] = this.mod_FrontPosStart + StartPosCabinet;
        f.mod_Originpos[2] = 0;
    }
});

//======================================================================
// Seal mc_Storageunit and get attribute with FreeSpace
//======================================================================

let sealedCarc = carc.seal();
let sealedCarc_CarcaseSpaceDimension = JSON.parse(sealedCarc.mod_CarcaseSpaceDimension[0]);
let i = 0;

// Cycle for the child modules
this.m.forEach((p) => {
    if (p instanceof OD_M_mf_Door) {
        // Set the attribute for the free space regarding each front
        let CarcaseSpaceDimension: any = {
            FullWidthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullWidthFreeSpace,
            FullHeightFreeSpace: sealedCarc_CarcaseSpaceDimension.FullHeightFreeSpace,
            FullDepthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullDepthFreeSpace,
            FullWidthStartPos: sealedCarc_CarcaseSpaceDimension.FullWidthStartPos,
            FullHeightStartPos: sealedCarc_CarcaseSpaceDimension.FullHeightStartPos,
            FullDepthStartPos: sealedCarc_CarcaseSpaceDimension.FullDepthStartPos,
            WidthFreeSpace: sealedCarc_CarcaseSpaceDimension.WidthFreeSpace[i],
            HeightFreeSpace: sealedCarc_CarcaseSpaceDimension.HeightFreeSpace[i],
            DepthFreeSpace: sealedCarc_CarcaseSpaceDimension.DepthFreeSpace[i] - spaceDepthReduction,
            WidthFreeStartPos: sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i],
            HeightFreeStartPos: sealedCarc_CarcaseSpaceDimension.HeightFreeStartPos[i] + StartPosCabinet,
            DepthFreeStartPos: sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos[i],
        };
        let strJson = JSON.stringify(CarcaseSpaceDimension);
        p.mod_CarcaseSpaceDimension.push(strJson);

        // Sequence of the fronts
        i++;
    } else if (p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Fixedfront) {
        // Recalculate the free space
        let startPosWidth = sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i];
        let freespaceWidth =
            this.mod_CornerunitFrontWidth - sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i] * 2;

        // Set the attribute for the free space regarding each front
        let CarcaseSpaceDimension: any = {
            FullWidthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullWidthFreeSpace,
            FullHeightFreeSpace: sealedCarc_CarcaseSpaceDimension.FullHeightFreeSpace,
            FullDepthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullDepthFreeSpace,
            FullWidthStartPos: sealedCarc_CarcaseSpaceDimension.FullWidthStartPos,
            FullHeightStartPos: sealedCarc_CarcaseSpaceDimension.FullHeightStartPos,
            FullDepthStartPos: sealedCarc_CarcaseSpaceDimension.FullDepthStartPos,

            WidthFreeSpace: freespaceWidth,
            WidthFreeStartPos: startPosWidth,

            HeightFreeSpace: sealedCarc_CarcaseSpaceDimension.HeightFreeSpace[i],
            HeightFreeStartPos: sealedCarc_CarcaseSpaceDimension.HeightFreeStartPos[i] + StartPosCabinet,

            DepthFreeSpace: sealedCarc_CarcaseSpaceDimension.DepthFreeSpace[i],
            DepthFreeStartPos: sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos[i],
        };
        let strJson = JSON.stringify(CarcaseSpaceDimension);
        p.mod_CarcaseSpaceDimension.push(strJson);

        // Sequence of the fronts
        i++;
    }
});

//======================================================================
//          Add the mc_CornerunitStraight to the root-module
//======================================================================

// Add the module
let corner1 = this.addOD_M_mc_CornerunitStraight01(1);

// Set the values to the relevant attributes of the carcase
corner1.mod_CarcaseDepth = this.mod_Depth;
corner1.mod_CarcaseWidth = this.mod_Width;
corner1.mod_CarcaseHeight = carcaseHeight;
corner1.mod_CarcaseSpaceDimension.push(sealedCarc.mod_CarcaseSpaceDimension[0]);
corner1.mod_CornerunitFrontWidth = this.mod_CornerunitFrontWidth;
corner1.mod_FingergripTop = false;
corner1.mod_FingergripQtyMiddle = 0;
corner1.mod_FingergripPos1 = 0;
corner1.mod_FingergripPos2 = 0;
corner1.mod_FingergripPos3 = 0;
corner1.mod_FingergripPos4 = 0;
corner1.mod_FingergripPos5 = 0;
if (carc.mod_FingergripTop) {
    corner1.mod_FingergripTop = true;
    corner1.mod_FingergripType = carc.mod_FingergripType;
} else {
    corner1.mod_FingergripTop = false;
}

// Create ID for the carcase
corner1.mod_CarcaseId = 'Carcase_01';

// Set origin of the carcase
corner1.setOrigin(0, StartPosCabinet, 0);

//======================================================================
// Seal mc_CornerunitStraight and get attribute mod_CornerunitInfo
//======================================================================

let sealedCornerCabinet = corner1.seal();
let sealedCornerCabinet_CornerunitInfo = JSON.parse(sealedCornerCabinet.mod_CornerunitInfo[0]);
let sealedCarc_VertDividerInfoList = JSON.parse(sealedCarc.mod_VertDividerInfoList[0]);
let sealedCarc_CarcasePartInfo = JSON.parse(sealedCarc.mod_CarcasePartInfo[0]);
let BtmShelfPosDepth = sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[1];
let BtmShelfPos = sealedCarc_CarcasePartInfo.HorizontalPartsPosY[1];
i = 0;

// Cycle for the child modules (Door)
this.m.forEach((p) => {
    if (p instanceof OD_M_mf_Door) {
        i++;

        //--------------------------------------------------------------------------------------------------------

        // Get the information regarding the HorizontalParts in an Array
        let HorizontalPartsType: string[] = [];
        HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i]);
        let HorizontalPartsPosY: number[] = [];
        HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i]);
        let HorizontalPartsPosZ: number[] = [];
        HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i]);
        let HorizontalPartsDimY: number[] = [];
        HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i]);
        let HorizontalPartsDimZ: number[] = [];
        HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i]);
        let HorizontalPartsFrontAngle: number[] = [];
        HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i]);

        if (
            this.mod_CarcaseShelftopConstruction != 'RailTopBackHorizontal' &&
            this.mod_CarcaseShelftopConstruction != 'RailTopBackVertical'
        ) {
            // Only push the top part if it exists
            HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i + 1]);
            HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i + 1]);
            HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i + 1]);
            HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i + 1]);
            HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i + 1]);
            HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i + 1]);
        }

        // Insert the VertDivider or the PanelBlind in the VerticalPartsInfo
        if (this.mod_CornerunitStraightConstruction == 'Construction03') {
            if (this.mod_CarcaseDirection == 'Left') {
                this.m.forEach((f) => {
                    if (f instanceof OD_M_mf_CornerFillerFront) {
                        sealedCarc_CarcasePartInfo.VerticalPartsType[i].splice(1, 0, 'FillerR');
                        sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].splice(
                            1,
                            0,
                            this.mod_Width! -
                                this.mod_CornerunitFrontWidth! -
                                f.mod_WidthRight! -
                                f.mod_FrontGapVert! / 2,
                        );
                        sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].splice(
                            1,
                            0,
                            this.mod_Width! -
                                this.mod_CornerunitFrontWidth! -
                                f.mod_WidthRight! -
                                f.mod_FrontGapVert! / 2,
                        ); // PENDING TO FIX FORMULA
                        sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].splice(1, 0, f.mod_WidthRight!);
                        sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i].splice(1, 0, f.mod_WidthRight!); // PENDING TO FIX FORMULA
                        sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].splice(1, 0, 180);
                    }
                });
            } else {
                this.m.forEach((f) => {
                    if (f instanceof OD_M_mf_CornerFillerFront) {
                        sealedCarc_CarcasePartInfo.VerticalPartsType[i].splice(1, 0, 'FillerL');
                        sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].splice(
                            1,
                            0,
                            this.mod_CornerunitFrontWidth! + f.mod_FrontGapVert! / 2,
                        );
                        sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].splice(
                            1,
                            0,
                            this.mod_CornerunitFrontWidth! + f.mod_FrontGapVert! / 2,
                        ); // PENDING TO FIX FORMULA
                        sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].splice(1, 0, f.mod_WidthLeft!);
                        sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i].splice(1, 0, f.mod_WidthLeft!); // PENDING TO FIX FORMULA
                        sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].splice(1, 0, 180);
                    }
                });
            }
        } else {
            sealedCarc_CarcasePartInfo.VerticalPartsType[i].splice(1, 0, 'MiddleSideShort');
            sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortPosX,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortPosZ,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortThk,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i].splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortDimZ,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].splice(1, 0, 90);
        }

        // Adjust the VerticalPartsInfo to reflect only the parts arround the front (Remove the vertical parts that will not affect the Front)
        if (this.mod_CarcaseDirection == 'Left') {
            // If the Carcase Direction is Left remove the SidePanelLeft
            sealedCarc_CarcasePartInfo.VerticalPartsType[i].splice(0, 1);
            sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].splice(0, 1);
            sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].splice(0, 1);
            sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].splice(0, 1);
            sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i].splice(0, 1);
            sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].splice(0, 1);
        } else {
            // If the Carcase Direction is Right remove the SidePanelRight (last part in the array)
            sealedCarc_CarcasePartInfo.VerticalPartsType[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsType[i].length - 1,
                1,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].length - 1,
                1,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].length - 1,
                1,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].length - 1,
                1,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsDimX[i].length - 1,
                1,
            );
            sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].splice(
                sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i].length - 1,
                1,
            );
        }

        // Set the attribute CarcasePartInfo regarding each front
        let CarcasePartInfo: any = {
            HorizontalPartsType: HorizontalPartsType,
            HorizontalPartsPosY: HorizontalPartsPosY,
            HorizontalPartsPosZ: HorizontalPartsPosZ,
            HorizontalPartsDimY: HorizontalPartsDimY,
            HorizontalPartsDimZ: HorizontalPartsDimZ,
            HorizontalPartsFrontAngle: HorizontalPartsFrontAngle,
            VerticalPartsType: sealedCarc_CarcasePartInfo.VerticalPartsType[i],
            VerticalPartsPosX: sealedCarc_CarcasePartInfo.VerticalPartsPosX[i],
            VerticalPartsPosZ: sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i],
            VerticalPartsDimX: sealedCarc_CarcasePartInfo.VerticalPartsDimX[i],
            VerticalPartsDimZ: sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i],
            VerticalPartsFrontAngle: sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i],
        };

        let CarcasePartInfoJson = JSON.stringify(CarcasePartInfo);
        p.mod_CarcasePartInfo.push(CarcasePartInfoJson);

        // Set the attribute for the VertDividerInfoList info (mod_VertDividerInfoList) regarding each front (will be used for the adjustable shelves)
        if (this.mod_CornerunitStraightConstruction != 'Construction03') {
            sealedCarc_VertDividerInfoList.Type.splice(1, 0, 'MiddleSideShort');
            sealedCarc_VertDividerInfoList.PosX.splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortPosX,
            );
            sealedCarc_VertDividerInfoList.DimX.splice(
                1,
                0,
                sealedCornerCabinet_CornerunitInfo.MiddleSideShortThk,
            );
        }

        let VertDividerInfoList: any = {
            Type: sealedCarc_VertDividerInfoList.Type[i],
            FrontWidth: sealedCarc_VertDividerInfoList.FrontWidth[i],
            FrontName: sealedCarc_VertDividerInfoList.FrontName[i],
            PosX: sealedCarc_VertDividerInfoList.PosX[i],
            DimX: sealedCarc_VertDividerInfoList.DimX[i],
            FreeSpaceWidth: sealedCarc_VertDividerInfoList.FreeSpaceWidth[i],
            FreeSpaceWidthStartPos: sealedCarc_VertDividerInfoList.FreeSpaceWidthStartPos[i],
        };

        let VertDividerInfoListJson = JSON.stringify(VertDividerInfoList);
        p.mod_VertDividerInfoList.push(VertDividerInfoListJson);
    }
});

//======================================================================
//          Add the PlinthArea to the root-module
//======================================================================

// Add the module
if (this.mod_PlacementLevels === 'OnFloor' && this.mod_PlinthAreaDesign_matrix.PlinthAreaType == 'Leg') {
    let plinth = this.addOD_M_mc_PlinthArea01(1);

    // Set the values to the relevant attributes of the carcase
    plinth.mod_CarcaseDepth = this.mod_Depth - BtmShelfPosDepth;
    plinth.mod_CarcaseWidth = this.mod_Width;
    plinth.mod_CarcaseId = 'Carcase_01';

    plinth.setOrigin(0, BtmShelfPos, BtmShelfPosDepth);

    // Seal the plinth area to retrieve the leg positions
    let sealedPlinth = plinth.seal();
    this.mod_PlinthAreaPositionInfo.push(sealedPlinth.mod_PlinthAreaPositionInfo[0]);
}

//======================================================================
//          Create vector / docking
//======================================================================

let TopEndCabinet = StartPosCabinet + carcaseHeight;
const sealedCornerunitFiller = (
    this.m.find((m) => m instanceof OD_M_mf_CornerFillerFront) as OD_M_mf_CornerFillerFront
)?.seal();
let FillerWidthLeft = sealedCornerunitFiller?.mod_WidthLeft ?? 0;
let FillerWidthRight = sealedCornerunitFiller?.mod_WidthRight ?? 0;

// Version blind panel left
//--------------------------------------------------------------------------------------------------------
if (this.mod_CarcaseDirection == 'Left') {
    // Calculations
    let ZeroX =
        this.mod_Width -
        this.mod_CornerunitFrontWidth -
        FillerWidthRight -
        this.mod_Depth -
        this.mod_CarcaseDistanceWall;
    let ZeroZ = -this.mod_CarcaseDistanceWall;
    let LeftZ = this.mod_Depth + FillerWidthLeft;
    let FrontX = this.mod_Depth + ZeroX + this.mod_CarcaseDistanceWall;

    // Left side
    this.addDockingInfo(Dock.LeftBackBottom, new Vector3(ZeroX, 0, ZeroZ), new Vector3(ZeroX, 0, LeftZ));
    this.addDockingInfo(
        Dock.LeftBackTop,
        new Vector3(ZeroX, TopEndCabinet, ZeroZ),
        new Vector3(ZeroX, TopEndCabinet, LeftZ),
    );

    // Right side
    this.addDockingInfo(
        Dock.RightBottom,
        new Vector3(this.mod_Width, 0, ZeroZ),
        new Vector3(this.mod_Width, 0, this.mod_Depth),
    );
    this.addDockingInfo(
        Dock.RightTop,
        new Vector3(this.mod_Width, TopEndCabinet, ZeroZ),
        new Vector3(this.mod_Width, TopEndCabinet, this.mod_Depth),
    );

    // Back side
    this.addDockingInfo(
        Dock.RightBackBottom,
        new Vector3(ZeroX, 0, ZeroZ),
        new Vector3(this.mod_Width, 0, ZeroZ),
    );
    this.addDockingInfo(
        Dock.RightBackTop,
        new Vector3(ZeroX, TopEndCabinet, ZeroZ),
        new Vector3(this.mod_Width, TopEndCabinet, ZeroZ),
    );

    // Front side
    this.addDockingInfo(Dock.LeftBottom, new Vector3(ZeroX, 0, LeftZ), new Vector3(FrontX, 0, LeftZ));
    this.addDockingInfo(
        Dock.LeftTop,
        new Vector3(ZeroX, TopEndCabinet, LeftZ),
        new Vector3(FrontX, TopEndCabinet, LeftZ),
    );
}

// Version blind panel right
//--------------------------------------------------------------------------------------------------------
else {
    // Calculations
    let EndX =
        this.mod_CornerunitFrontWidth + FillerWidthLeft + this.mod_Depth + this.mod_CarcaseDistanceWall;
    let ZeroZ = -this.mod_CarcaseDistanceWall;
    let RightZ = this.mod_Depth + FillerWidthRight;
    let FrontX = this.mod_CornerunitFrontWidth + FillerWidthLeft;

    // Left side
    this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, ZeroZ), new Vector3(0, 0, this.mod_Depth));
    this.addDockingInfo(
        Dock.LeftTop,
        new Vector3(0, TopEndCabinet, ZeroZ),
        new Vector3(0, TopEndCabinet, this.mod_Depth),
    );

    // Right side
    this.addDockingInfo(Dock.RightBackBottom, new Vector3(EndX, 0, ZeroZ), new Vector3(EndX, 0, RightZ));
    this.addDockingInfo(
        Dock.RightBackTop,
        new Vector3(EndX, TopEndCabinet, ZeroZ),
        new Vector3(EndX, TopEndCabinet, RightZ),
    );

    // Back side
    this.addDockingInfo(Dock.LeftBackBottom, new Vector3(EndX, 0, ZeroZ), new Vector3(0, 0, ZeroZ));
    this.addDockingInfo(
        Dock.LeftBackTop,
        new Vector3(EndX, TopEndCabinet, ZeroZ),
        new Vector3(0, TopEndCabinet, ZeroZ),
    );

    // Front side
    this.addDockingInfo(Dock.RightBottom, new Vector3(EndX, 0, RightZ), new Vector3(FrontX, 0, RightZ));
    this.addDockingInfo(
        Dock.RightTop,
        new Vector3(EndX, TopEndCabinet, RightZ),
        new Vector3(FrontX, TopEndCabinet, RightZ),
    );
}

//======================================================================
//          Call the UserExit of this module
//======================================================================

let retInfo = GlobalFunc.ue_CornerunitStraight(this);
