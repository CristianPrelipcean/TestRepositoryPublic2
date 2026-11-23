// HOMAG Digital
// Create: October 2022
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Resolves carcase finish, side additions and side closures independently.
// Evaluates dockings, coverage and locally generated fillers.
// Creates the carcase and side additions and processes fronts, appliances and the plinth area.

// Revisions:
// 2026-11-04 | Ludwig Weber | Keep the optional column fallback local in the read-only completion phase.
// 2026-11-04 | Ludwig Weber | Translate diagnostic stages and explanatory messages into English.
// 2026-11-04 | Ludwig Weber | Remove inactive debug placeholders; preserve optional column fallback.
// 2026-11-03 | Ludwig Weber | Integrate r10 column-wrap feature while preserving current live behaviour.
// July 2024 | Henning Wiesbrock | Add mf_RackArea and function process_RackAreaOversizeCarcase.
// April 2025 | Ludwig Weber | Add endless cabinets, sloped-ceiling automatism, oven, hob and fridge management.
// 2026-11-02 | Ludwig Weber | Nobilia step 1: decoupled carcase finish from spatial side completion.
// 2026-11-02 | Ludwig Weber | Standardized script headers, block comments and English wording.
// 2026-11-02 | Ludwig Weber | Restore the original fixed-shelf helper parameter types outside the side-completion scope.
// 2026-11-02 | Ludwig Weber | Retain the existing live hood-insert construction outside the side-completion scope.
// 2026-11-02 | Ludwig Weber | Calculate master-data cabinets without requiring room information.

//======================================================================

//======================================================================
// Prepare rack area
//======================================================================
let columnDiagnosticStage: string = 'Start';
try {
    const standardColumnContext = (): any => ({ Version: 1, IsComplete: true, HasIntersection: false, Errors: [] as string[] });
    let columnRaw: any = standardColumnContext();
    try {
        const parsed = JSON.parse(this.mod_ColumnContext || '{}');
        if (parsed?.Version === 1 && parsed.IsComplete === true) columnRaw = parsed;
    } catch {
        // Malformed optional context must not stop standard cabinet construction.
    }
    const disableColumn = (): void => {
        columnRaw = standardColumnContext();
        // This phase exposes mod_ColumnContext as read-only; the fallback stays local.
    };
    if (columnRaw.HasIntersection && (
        this.mod_CreateCountertop || this.mod_CreatePaneltop || this.mod_CreateBacksplash ||
        this.mod_CreateCeilingFiller || this.mod_CreateFingergrip ||
        this.mod_SidepanelleftType !== 'OutSp' || this.mod_SidepanelrightType !== 'OutSp' ||
        this.mod_CarcaseShelftopConstruction !== 'ShelfTop' ||
        this.mod_CarcaseShelfbtmConstruction !== 'ShelfBtm'
    )) disableColumn();
    let RackAreaOversize = GlobalFunc.process_RackAreaOversizeCarcase(this);

    //======================================================================
    // Add the carcase to the root-module
    //======================================================================
    // The carcase is created after the context and side decisions are validated.
    const carcaseId = 'Carcase_01';

    // StartPosition of Cabinet
    const StartPosCabinet = this.mod_PlacementLevels === 'OnFloor' ? this.mod_PlinthAreaHeight : 0;

    //======================================================================
    // Dimensioning variables (room and sloped ceiling)
    //======================================================================
    let angle = 0;
    let wallAngle = 0;
    let backHeight = 0;
    let wallBackheight = 0;
    let height = this.mod_CarcaseHeight > 0 ? this.mod_CarcaseHeight : this.mod_Height;
    let topDepth = this.mod_TopDepth;

    //======================================================================
    // Read and validate module context information
    //======================================================================
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
            numbers.every(
                (key: string) => typeof value[key] === 'number' && Number.isFinite(value[key]),
            ) &&
            (direction === null ||
                direction === 'toLeft' ||
                direction === 'toRight' ||
                direction === 'toBack') &&
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
            `mr_StorageunitSingle: invalid context JSON; continuing without room information: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
    if (isSideContext(parsedContext)) moduleContextInfo = parsedContext;
    const hasModuleContextInfo = moduleContextInfo.DataComplete === true;
    const hasSideCoverage = moduleContextInfo.SideCoverageComplete === true;

    //======================================================================
    // Apply sloped ceiling information from module context
    //======================================================================
    if (
        hasModuleContextInfo &&
        moduleContextInfo.SlopedCeiling &&
        moduleContextInfo.SlopedCeilingDirection === 'toBack'
    ) {
        wallAngle = moduleContextInfo.SlopedCeilingAngle;
        wallBackheight = moduleContextInfo.SlopedCeilingLevel;
    }

    //======================================================================
    // Determine automatic filler situation
    //======================================================================
    const minWallDistance = 20;
    const maxWallDistance = 290;
    const coverageTolerance = 0.001;
    const wallDistanceLeft = moduleContextInfo.DistanceWallLeft;
    const wallDistanceRight = moduleContextInfo.DistanceWallRight;

    // Spatial side solutions do not depend on the finish selection anymore.
    const autoFillerLeft =
        hasModuleContextInfo &&
        !moduleContextInfo.HasDockingLeft &&
        wallDistanceLeft >= minWallDistance &&
        wallDistanceLeft <= maxWallDistance;
    const autoFillerRight =
        hasModuleContextInfo &&
        !moduleContextInfo.HasDockingRight &&
        wallDistanceRight >= minWallDistance &&
        wallDistanceRight <= maxWallDistance;
    const needsAutomaticSideLeft =
        hasModuleContextInfo &&
        !autoFillerLeft &&
        wallDistanceLeft > minWallDistance &&
        moduleContextInfo.NeedsVisibleSideLeft;
    const needsAutomaticSideRight =
        hasModuleContextInfo &&
        !autoFillerRight &&
        wallDistanceRight > minWallDistance &&
        moduleContextInfo.NeedsVisibleSideRight;
    const autoUprightLeft =
        this.mod_CarcaseVisLeftAutomaticType === 'AddUpright' && needsAutomaticSideLeft;
    const autoUprightRight =
        this.mod_CarcaseVisRightAutomaticType === 'AddUpright' && needsAutomaticSideRight;
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
    // Covers every point of the closure rectangle, including combined neighbours.
    // A gap in height or depth must not be hidden by another unrelated interval.
    // A zero-height target represents a countertop/paneltop boundary plane.

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
        const probes: number[] =
            heightTo - heightFrom <= coverageTolerance ? [(heightFrom + heightTo) / 2] : [];
        for (let index = 1; index < heights.length; index++) {
            const previous = heights[index - 1];
            const current = heights[index];
            if (
                previous !== undefined &&
                current !== undefined &&
                current - previous > coverageTolerance
            ) {
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
                logError(`mr_StorageunitSingle: unknown visibility selection '${String(selection)}'.`);
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
            logError('mr_StorageunitSingle: invalid dimensions for side coverage.');
            return undefined;
        }
        const carcaseTop = StartPosCabinet + carcaseHeight;
        const left = hasSideCoverage ? moduleContextInfo.SideCoverageLeft : [];
        const right = hasSideCoverage ? moduleContextInfo.SideCoverageRight : [];

        // The existing local filler is not docked. Treat it as a temporary closure
        // as agreed; this exception disappears when group-owned fillers are docked.
        const plinthLeft =
            !autoFillerLeft &&
            !(
                moduleContextInfo.HasDockingLeft &&
                isFullyCovered(left, 0, StartPosCabinet, this.mod_Depth)
            );
        const plinthRight =
            !autoFillerRight &&
            !(
                moduleContextInfo.HasDockingRight &&
                isFullyCovered(right, 0, StartPosCabinet, this.mod_Depth)
            );
        const ceilingLeft =
            !autoFillerLeft &&
            !(
                moduleContextInfo.HasDockingLeft &&
                isFullyCovered(left, carcaseTop, carcaseTop + ceilingHeight, this.mod_Depth)
            );
        const ceilingRight =
            !autoFillerRight &&
            !(
                moduleContextInfo.HasDockingRight &&
                isFullyCovered(right, carcaseTop, carcaseTop + ceilingHeight, this.mod_Depth)
            );
        const countertopLeft =
            !autoFillerLeft &&
            !(
                moduleContextInfo.HasDockingLeft &&
                isFullyCovered(left, carcaseTop, carcaseTop, this.mod_Depth)
            );
        const countertopRight =
            !autoFillerRight &&
            !(
                moduleContextInfo.HasDockingRight &&
                isFullyCovered(right, carcaseTop, carcaseTop, this.mod_Depth)
            );
        const carcaseVisLeft = resolveVisibility(
            this.mod_CarcaseVisLeftSelection,
            needsAutomaticSideLeft && !autoUprightLeft,
        );
        const carcaseVisRight = resolveVisibility(
            this.mod_CarcaseVisRightSelection,
            needsAutomaticSideRight && !autoUprightRight,
        );
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
            PlinthAreaVisLeft: plinthVisLeft,
            PlinthAreaVisRight: plinthVisRight,
            CeilingAreaVisLeft: ceilingVisLeft,
            CeilingAreaVisRight: ceilingVisRight,
            CarcaseVisLeft: carcaseVisLeft,
            CarcaseVisRight: carcaseVisRight,
            CountertopVisLeft: countertopLeft ? 1 : 0,
            CountertopVisRight: countertopRight ? 1 : 0,
            AutoFillerLeft: autoFillerLeft,
            AutoFillerRight: autoFillerRight,
            AutoUprightLeft: autoUprightLeft,
            AutoUprightRight: autoUprightRight,
            WallDistanceLeft: wallDistanceLeft,
            WallDistanceRight: wallDistanceRight,
        };
    };

    //======================================================================
    // Prepare carcase construction overrides
    //======================================================================
    const carcaseOverrides: Partial<
        Pick<
            OD_M_mc_Storageunit01,
            | 'mod_CarcaseConnectionLeftBtm'
            | 'mod_CarcaseConnectionLeftTop'
            | 'mod_CarcaseConnectionRightBtm'
            | 'mod_CarcaseConnectionRightTop'
            | 'mod_CarcaseShelftopConstruction'
        >
    > = {};

    //======================================================================
    // Calculate the dimension logic for sloped ceiling
    //======================================================================
    // Use the Wall data
    if (this.mod_SlopedCeilingDimensionLogic_matrix.UseWallData) {
        //Calculate the maximum height
        if (this.mod_SlopedCeilingDimensionLogic_matrix.Height == 'Max') {
            angle = wallAngle;
            backHeight = wallBackheight - StartPosCabinet - this.g.basic_SlopedCeilingHeightReduction;
        }

        // Calculate the height based on the user height definition (only if it touches the sloped ceiling)
        else if (
            this.mod_SlopedCeilingDimensionLogic_matrix.Height == 'User' &&
            StartPosCabinet + this.mod_Height > wallBackheight
        ) {
            angle = wallAngle;
            backHeight = wallBackheight - StartPosCabinet - this.g.basic_SlopedCeilingHeightReduction;
        } else {
            angle = 0;
            backHeight = this.mod_BackHeight - StartPosCabinet;
        }
    }

    // Data completely defined by user
    else {
        angle = this.mod_SlopeAngle;
        backHeight = this.mod_BackHeight - StartPosCabinet;
    }

    // It's a SlopedCeiling Cabinet
    if (angle != 0) {
        // Calculate height and top depth using maximum height possible
        let maxheight = GlobalFunc.find_CarcaseSlopedCeilingDimension(
            this.mod_SlopedCeilingConstruction,
            'BasedInTopDepth',
        ).Height(this, backHeight, angle);
        let maxheightTopDepth = GlobalFunc.find_CarcaseSlopedCeilingDimension(
            this.mod_SlopedCeilingConstruction,
            'BasedInTopDepth',
        ).TopDepth(this, backHeight, angle);

        // Calculate the Height
        height = GlobalFunc.find_CarcaseSlopedCeilingDimension(
            this.mod_SlopedCeilingConstruction,
            this.mod_SlopedCeilingDimensionLogic_matrix.DimensionLogic,
        ).Height(this, backHeight, angle);

        // Calculate the Top Depth
        topDepth = GlobalFunc.find_CarcaseSlopedCeilingDimension(
            this.mod_SlopedCeilingConstruction,
            this.mod_SlopedCeilingDimensionLogic_matrix.DimensionLogic,
        ).TopDepth(this, backHeight, angle);

        // If the height is bigger than the maximum height, we limit the cabinet to the maximum height
        if (height > maxheight) {
            height = maxheight;
            topDepth = maxheightTopDepth;
        }
        height != this.mod_CarcaseHeight
            ? logError(
                  'Automatic adjustment: Carcase height is now ' +
                      height +
                      ' instead of ' +
                      this.mod_CarcaseHeight,
              )
            : '';
        topDepth != this.mod_TopDepth
            ? logError(
                  'Automatic adjustment: Top depth is now ' +
                      topDepth +
                      ' instead of ' +
                      this.mod_TopDepth,
              )
            : '';

        // Read Settings table
        const slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(
            this.mod_SlopedCeilingConstruction!,
        );

        // Adjust CarcaseConnectionLeftBtm
        if (slopedCeilingSettings.CarcaseConnectionLeftBtm != this.mod_CarcaseConnectionLeftBtm) {
            logError(
                'Automatic adjustment: Carcase connection LeftBtm is now ' +
                    slopedCeilingSettings.CarcaseConnectionLeftBtm +
                    ' instead of ' +
                    this.mod_CarcaseConnectionLeftBtm,
            );
            carcaseOverrides.mod_CarcaseConnectionLeftBtm =
                slopedCeilingSettings.CarcaseConnectionLeftBtm;
        }

        // Adjust CarcaseConnectionLeftTop
        if (slopedCeilingSettings.CarcaseConnectionLeftTop != this.mod_CarcaseConnectionLeftTop) {
            logError(
                'Automatic adjustment: Carcase connection LeftTop is now ' +
                    slopedCeilingSettings.CarcaseConnectionLeftTop +
                    ' instead of ' +
                    this.mod_CarcaseConnectionLeftTop,
            );
            carcaseOverrides.mod_CarcaseConnectionLeftTop =
                slopedCeilingSettings.CarcaseConnectionLeftTop;
        }

        // Adjust CarcaseConnectionRightBtm
        if (slopedCeilingSettings.CarcaseConnectionRightBtm != this.mod_CarcaseConnectionRightBtm) {
            logError(
                'Automatic adjustment: Carcase connection RightBtm is now ' +
                    slopedCeilingSettings.CarcaseConnectionRightBtm +
                    ' instead of ' +
                    this.mod_CarcaseConnectionRightBtm,
            );
            carcaseOverrides.mod_CarcaseConnectionRightBtm =
                slopedCeilingSettings.CarcaseConnectionRightBtm;
        }

        // Adjust CarcaseConnectionRightTop
        if (slopedCeilingSettings.CarcaseConnectionRightTop != this.mod_CarcaseConnectionRightTop) {
            logError(
                'Automatic adjustment: Carcase connection RightTop is now ' +
                    slopedCeilingSettings.CarcaseConnectionRightTop +
                    ' instead of ' +
                    this.mod_CarcaseConnectionRightTop,
            );
            carcaseOverrides.mod_CarcaseConnectionRightTop =
                slopedCeilingSettings.CarcaseConnectionRightTop;
        }

        // Adjust CarcaseShelftopConstruction
        if (slopedCeilingSettings.CarcaseShelftopConstruction != this.mod_CarcaseShelftopConstruction) {
            logError(
                'Automatic adjustment: Carcase Shelf top construction is now ' +
                    slopedCeilingSettings.CarcaseShelftopConstruction +
                    ' instead of ' +
                    this.mod_CarcaseShelftopConstruction,
            );
            carcaseOverrides.mod_CarcaseShelftopConstruction =
                slopedCeilingSettings.CarcaseShelftopConstruction;
        }
    }

    // Dimensions above may adjust a sloped carcase. Evaluate the final closure
    // heights here, before generating any carcase or automatic side parts.
    if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(topDepth) || topDepth <= 0) {
        logError('mr_StorageunitSingle: invalid final carcase dimensions.');
        return;
    }
    const storageunitInfo = buildSideInformation(height);
    if (!storageunitInfo) return;
    this.mod_InformationList[0] = JSON.stringify(storageunitInfo);
    const carc = this.addOD_M_mc_Storageunit01(0);
    if (carcaseOverrides.mod_CarcaseConnectionLeftBtm !== undefined)
        carc.mod_CarcaseConnectionLeftBtm = carcaseOverrides.mod_CarcaseConnectionLeftBtm;
    if (carcaseOverrides.mod_CarcaseConnectionLeftTop !== undefined)
        carc.mod_CarcaseConnectionLeftTop = carcaseOverrides.mod_CarcaseConnectionLeftTop;
    if (carcaseOverrides.mod_CarcaseConnectionRightBtm !== undefined)
        carc.mod_CarcaseConnectionRightBtm = carcaseOverrides.mod_CarcaseConnectionRightBtm;
    if (carcaseOverrides.mod_CarcaseConnectionRightTop !== undefined)
        carc.mod_CarcaseConnectionRightTop = carcaseOverrides.mod_CarcaseConnectionRightTop;
    if (carcaseOverrides.mod_CarcaseShelftopConstruction !== undefined)
        carc.mod_CarcaseShelftopConstruction = carcaseOverrides.mod_CarcaseShelftopConstruction;

    //======================================================================
    // Add automatic fillers
    //======================================================================

    //======================================================================
    // createAutoFiller
    //======================================================================
    const createAutoFiller = (direction: 'Left' | 'Right', width: number, originX: number) => {
        const filler = this.addOD_M_mc_FillerStraight01(1);
        filler.mod_FrontPosStart = this.mod_FrontPosStart;
        filler.mod_Height = height - this.mod_FrontGapHorTop;
        filler.mod_Direction = direction;
        filler.mod_FillerType = 'LShape';
        filler.mod_TypeElement = 'Filler';
        filler.mod_Width = width;
        filler.mod_CarcaseId = carcaseId;
        filler.setOrigin(originX, StartPosCabinet, 0);
    };
    if (autoFillerLeft) createAutoFiller('Left', wallDistanceLeft, -wallDistanceLeft);
    if (autoFillerRight) createAutoFiller('Right', wallDistanceRight, this.mod_Width);

    //======================================================================
    // Add automatic uprights
    //======================================================================
    const wallDistanceBack =
        moduleContextInfo.DistanceWallBack >= 0 && moduleContextInfo.DistanceWallBack < 290
            ? moduleContextInfo.DistanceWallBack
            : 0;

    //======================================================================
    // createAutoUpright
    //======================================================================
    const createAutoUpright = (direction: 'Left' | 'Right', originX: number) => {
        const upright = this.addOD_M_mc_Upright01(1);
        upright.mod_Height = height + this.mod_GlobalFrontOversizeBtm + this.mod_GlobalFrontOversizeTop;
        upright.mod_Depth = this.mod_Depth + 22 + wallDistanceBack;
        upright.mod_UprightConstruction = 'CarcaseHeight';
        upright.mod_UprightColor = this.mod_FrontColor;
        upright.mod_UprightFloorProfileColor = 'DemoStainlessSteel';
        upright.mod_UprightOverdimensionBtm = 0;
        upright.mod_UprightOverdimensionTop = 0;
        upright.mod_UprightOverhang = 22;
        upright.mod_UprightProgram = this.mod_FrontProgram;
        upright.mod_UprightSide = direction;
        upright.mod_TypeElement = 'Upright';
        upright.setOrigin(originX, StartPosCabinet - this.mod_GlobalFrontOversizeBtm, -wallDistanceBack);
    };
    if (autoUprightLeft) createAutoUpright('Left', -this.mod_UprightThk);
    if (autoUprightRight) createAutoUpright('Right', this.mod_Width);

    //======================================================================
    // Calculation of the carcase width and starting Position (Endless cabinets)
    //======================================================================

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
    ): number {
        const leftAdjustment = GetSideAdjustment(leftType, leftThk);
        const rightAdjustment = GetSideAdjustment(rightType, rightThk);
        return width + leftAdjustment + rightAdjustment;
    }

    // Set the values to the relevant attributes of the carcase
    //--------------------------------------------------------------------------------------------------------
    //let StartPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
    let CarcaseMovement = GetCarcaseMovement(this.mod_SidepanelleftType, this.mod_SidepanelleftThk);
    carc.mod_CarcaseWidth = CalculateCarcaseWidth(
        this.mod_SidepanelleftType,
        this.mod_SidepanelrightType,
        this.mod_Width,
        this.mod_SidepanelleftThk,
        this.mod_SidepanelrightThk,
    );
    carc.mod_CarcaseMovement = CarcaseMovement;

    columnDiagnosticStage = '2 Calculate position class and geometry';
    let columnInfo: any = {
        Class: 'None',
        PlanningDepth: this.mod_Depth + RackAreaOversize,
        EffectiveDepth: this.mod_Depth + RackAreaOversize,
        RearOffset: 0,
    };
    if (columnRaw.HasIntersection && (angle !== 0 || RackAreaOversize !== 0)) disableColumn();
    this.mod_ColumnWrapInfo[0] = '';
    carc.mod_ColumnWrapInfo[0] = '';
    carc.mod_CarcaseDepth = columnInfo.PlanningDepth;
    this.mod_ColumnShelfOrigin.length = 0;
    this.mod_ColumnShelfOrigin.push(-CarcaseMovement, -StartPosCabinet, -columnInfo.RearOffset);
    carc.mod_CarcaseHeight = height;
    carc.mod_TopDepth = topDepth;
    carc.mod_SlopeAngle = angle;
    carc.mod_BackHeight = backHeight;
    carc.mod_SidepanelleftType = this.mod_SidepanelleftType;
    carc.mod_SidepanelrightType = this.mod_SidepanelrightType;
    carc.mod_CarcaseId = carcaseId;
    carc.mod_CarcaseVisLeft = storageunitInfo.CarcaseVisLeft === 1;
    carc.mod_CarcaseVisRight = storageunitInfo.CarcaseVisRight === 1;

    //======================================================================
    // Cycle through the children and manage the front elements
    //======================================================================
    let GlobalCount: number = 0;
    let LastFrontElem: number = 0;
    let LastFrontHeight: number = 0;
    let CountFingerGrip: number = 0;
    let FingergripBottom = false;
    let tmpGapMid: number = 0;
    let FingerGripLine: number = 0;
    let StartPos = this.mod_FrontPosStart + StartPosCabinet;
    let tmpLastStartPos: number[] = []; //Stores the position of each front
    tmpLastStartPos[0] = 0;
    let tmpLastGap: number[] = []; //Stores the gap between each fronts (either normal gap or fingergrip gap)
    tmpLastGap[0] = 0;
    let tmpLastFrontFingergrip: boolean[] = [false]; // Stores if the front has fingergrip
    tmpLastFrontFingergrip[0] = false;

    // Initialize fingergrip information for the carcase
    carc.mod_FingergripTop = false;
    carc.mod_FingergripQtyMiddle = 0;
    carc.mod_FingergripPos1 = 0;
    carc.mod_FingergripPos2 = 0;
    carc.mod_FingergripPos3 = 0;
    carc.mod_FingergripPos4 = 0;
    carc.mod_FingergripPos5 = 0;

    //Initialize Backwall construction and Backwall position
    carc.mod_CarcaseBackwallConstructionList[1] = this.mod_CarcaseBackwallConstruction!;
    carc.mod_BackwallPosList[1] = this.mod_BackwallPos!;

    //Initialize variables for Dividers
    let VertDividerType: string[] = [];
    let VertDividerFrontWidth: number[] = [];
    let VertDividerFrontName: string[] = [];

    // Define variable to change Shelffixed when Drawer above RackArea
    let FixedShelf: string = this.g.basic_RackAreaShelftopConstruction;

    //======================================================================
    // Create Front ID and Count total quantities
    //======================================================================
    const typeCounters = {
        Drawer: 0,
        Pullout: 0,
        PantryPullout: 0,
        Door: 0,
        Fliplift: 0,
        Fixedfront: 0,
        Oven: 0,
        Fridge: 0,
        RackArea: 0,
    };
    this.m.forEach((p) => {
        if (p instanceof OD_M_mf_Door) {
            p.mod_FrontId = 'Door_' + ++typeCounters.Door;
        } else if (p instanceof OD_M_mf_Fliplift) {
            p.mod_FrontId = 'Fliplift_' + ++typeCounters.Fliplift;
        } else if (p instanceof OD_M_mf_Drawer) {
            p.mod_FrontId = 'Drawer_' + ++typeCounters.Drawer;
        } else if (p instanceof OD_M_mf_Pullout) {
            p.mod_FrontId = 'Pullout_' + ++typeCounters.Pullout;
        } else if (p instanceof OD_M_mf_PantryPullout) {
            p.mod_FrontId = 'PantryPullout_' + ++typeCounters.PantryPullout;
        } else if (p instanceof OD_M_mf_Fixedfront) {
            p.mod_FrontId = 'Fixedfront_' + ++typeCounters.Fixedfront;
        } else if (p instanceof OD_M_mf_Oven) {
            p.mod_FrontId = 'Oven_' + ++typeCounters.Oven;
        } else if (p instanceof OD_M_mf_Fridge) {
            p.mod_FrontId = 'Door_' + ++typeCounters.Fridge;
        } else if (p instanceof OD_M_mf_RackArea) {
            p.mod_FrontId = 'RackArea_' + ++typeCounters.RackArea;
        }
    });
    const FrontClasses = [
        OD_M_mf_Door,
        OD_M_mf_Fliplift,
        OD_M_mf_Drawer,
        OD_M_mf_Pullout,
        OD_M_mf_PantryPullout,
        OD_M_mf_Oven,
        OD_M_mf_Fridge,
        OD_M_mf_RackArea,
        OD_M_mf_Fixedfront,
    ];

    // Calculate opening depth of the drawers
    const DrawerOpenDepth = (this.mod_Depth - 100) / typeCounters.Drawer;
    let DrawerOpeningDepth = DrawerOpenDepth * typeCounters.Drawer;
    this.m.forEach((p, i, arr) => {
        const prev = arr[i - 1];
        const next = arr[i + 1];
        const prevM = prev && FrontClasses.some((cls) => prev instanceof cls) ? prev : undefined;
        const nextM = next && FrontClasses.some((cls) => next instanceof cls) ? next : undefined;

        //======================================================================
        // Manage the hob
        //======================================================================
        if (p instanceof OD_M_mf_Hob) {
            // Movement in height
            p.setOrigin(
                this.mod_Width / 2,
                StartPosCabinet + this.mod_Height + this.mod_CountertopThk,
                this.mod_Depth + this.g.basic_CountertopOverhangFront,
            );
            GlobalFunc.process_StorageunitColumnPass(
                this,
                p,
                this.mod_Width / 2,
                StartPosCabinet + this.mod_Height + this.mod_CountertopThk,
                this.mod_Depth + this.g.basic_CountertopOverhangFront,
            );

            // Seal the hob
            let sealedHob = p.seal();

            // Height of the blocked area for the hob
            let hobHeightBlockedSpace = sealedHob.mod_HobInfo[0] - this.mod_CountertopThk;
            carc.mod_HobHeightBlockedSpace = hobHeightBlockedSpace;

            // Read the hob data (to provide it for the drawings via the contour)
            if (sealedHob.mod_CountertopInfo.length > 0 && sealedHob.mod_CountertopInfo[0] != null) {
                this.mod_CountertopInfo.push(sealedHob.mod_CountertopInfo[0]);
            }
        }

        //======================================================================
        // Manage the sink
        //======================================================================
        if (p instanceof OD_M_mf_Sink) {
            // Movement in height
            p.setOrigin(
                this.mod_Width / 2,
                StartPosCabinet + this.mod_Height + this.mod_CountertopThk,
                this.mod_Depth + this.g.basic_CountertopOverhangFront,
            );
            GlobalFunc.process_StorageunitColumnPass(
                this,
                p,

                this.mod_Width / 2,
                StartPosCabinet + this.mod_Height + this.mod_CountertopThk,
                this.mod_Depth + this.g.basic_CountertopOverhangFront,
            );

            // Seal the sink
            let sealedSink = p.seal();

            // Read sink data (to provide it for the drawings via the contour)
            if (sealedSink.mod_CountertopInfo.length > 0 && sealedSink.mod_CountertopInfo[0] != null) {
                this.mod_CountertopInfo.push(sealedSink.mod_CountertopInfo[0]);
            }
        }

        //======================================================================
        // Manage generic dimensions and gaps for all front elements
        //======================================================================
        if (p instanceof OD_M_mf_Oven) {
            tmpLastStartPos.push(StartPos - StartPosCabinet);
            tmpLastGap.push(this.mod_FrontGapHor / 2);
        }
        if (
            p instanceof OD_M_mf_Door ||
            p instanceof OD_M_mf_Fliplift ||
            p instanceof OD_M_mf_Drawer ||
            p instanceof OD_M_mf_Pullout ||
            p instanceof OD_M_mf_PantryPullout ||
            p instanceof OD_M_mf_Fridge ||
            p instanceof OD_M_mf_RackArea ||
            p instanceof OD_M_mf_Fixedfront
        ) {
            // Create Carcase ID and Attributes
            GlobalCount++;
            p.mod_CarcaseId = carcaseId;
            p.mod_CarcaseDepth = this.mod_Depth;
            p.mod_CarcaseWidth = this.mod_Width;
            p.mod_CarcaseHeight = height;
            p.mod_FrontPosStart = StartPos - StartPosCabinet;

            // Set the opening distance for the drawer
            if (
                p instanceof OD_M_mf_Drawer ||
                p instanceof OD_M_mf_Pullout ||
                p instanceof OD_M_mf_PantryPullout
            ) {
                p.mod_DrawerOpeningDistance = DrawerOpeningDepth;
                DrawerOpeningDepth -= DrawerOpenDepth;
            }
            p.setOrigin(0, StartPos, this.mod_Depth);
            GlobalFunc.process_StorageunitColumnPass(this, p, 0, StartPos, this.mod_Depth);
            p.mod_Originpos[0] = 0;
            p.mod_Originpos[1] = StartPos;
            p.mod_Originpos[2] = this.mod_Depth;

            // Check first and last front element
            if (StartPos + p.mod_FrontHeightSelection! >= height + StartPosCabinet) {
                LastFrontElem = 1;
            }

            // Error if front element start over the carcase top end
            if (StartPos >= height + StartPosCabinet) {
                let ErrorMessage = GlobalFunc.find_ErrorList('Error 22019', 1);
                logError(ErrorMessage.Message(''));
            }

            // Calculation of front height and set information to carcase regarding fingergrip
            if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
                carc.mod_FingergripTop = true;
                p.mod_FrontHeight =
                    height -
                    (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!);
                LastFrontHeight = height - (StartPos - StartPosCabinet);
                StartPos = height;
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
                p.mod_FrontHeight = height - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
                LastFrontHeight = height - (StartPos - StartPosCabinet);
                StartPos = height;
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
                    p.mod_FrontHeight! = p.mod_FrontHeightSelection! - tmpGapMid;
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

            //======================================================================
            // Provide the data of the last front to the carcase
            //======================================================================
            if (LastFrontElem == 1) {
                // Height of the last front element
                carc.mod_LastFrontHeight = LastFrontHeight;

                // FrontName
                if (p instanceof OD_M_mf_Door) {
                    carc.mod_LastFrontName = 'door';
                } else if (p instanceof OD_M_mf_Fliplift) {
                    carc.mod_LastFrontName = 'fliplift';
                } else if (
                    p instanceof OD_M_mf_Drawer ||
                    p instanceof OD_M_mf_Pullout ||
                    p instanceof OD_M_mf_PantryPullout
                ) {
                    carc.mod_LastFrontName = 'drawer';
                } else if (p instanceof OD_M_mf_Fridge) {
                    carc.mod_LastFrontName = 'fridge';
                } else if (p instanceof OD_M_mf_RackArea) {
                    carc.mod_LastFrontName = 'rackarea';
                } else if (p instanceof OD_M_mf_Fixedfront) {
                    carc.mod_LastFrontName = 'fixedfront';
                }
            }

            //======================================================================
            // Manage the global oversize
            //======================================================================
            if (
                p instanceof OD_M_mf_Door ||
                p instanceof OD_M_mf_Fliplift ||
                p instanceof OD_M_mf_Drawer ||
                p instanceof OD_M_mf_Pullout ||
                p instanceof OD_M_mf_PantryPullout ||
                p instanceof OD_M_mf_Fridge ||
                p instanceof OD_M_mf_Fixedfront
            ) {
                // First front element
                //--------------------------------------------------------------------------------------------------------
                if (GlobalCount === 1) {
                    // Flag for first front element
                    p.mod_FirstFront = true;
                    p.mod_HeightPosInsertion = this.mod_HeightPosInsertion;

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
            // Manage Front Width and Construction
            //======================================================================
            if (
                p instanceof OD_M_mf_Door ||
                p instanceof OD_M_mf_Fliplift ||
                p instanceof OD_M_mf_Pullout
            ) {
                p.mod_FrontWidth = this.mod_Width;
                if (this.mod_CarcaseFrontConstruction_matrix.Left == 'Inlayed') {
                    p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelleftThk;
                }
                if (this.mod_CarcaseFrontConstruction_matrix.Right == 'Inlayed') {
                    p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelrightThk;
                }
            }
        }

        //======================================================================
        // Manage the Hood
        //======================================================================
        if (p instanceof OD_M_mf_Door) {
            p.m.forEach((h, i, arrH) => {
                if (h instanceof OD_M_me_HoodInsert) {
                    let hoodinsert = GlobalFunc.process_HoodInsert(
                        h.mod_HoodSupplier ?? '',
                        h.mod_HoodId ?? '',
                        h.mod_HoodIntegrationType ?? '',
                        h.mod_HoodConstructionType ?? '',
                        this.mod_Width,
                        this.mod_Height,
                        this.mod_Depth,
                    );
                    if (hoodinsert && hoodinsert.DatasetComplete) {
                        hoodinsert.RearOffset = this.mod_BackwallPos;
                        hoodinsert.AdjShelfDesign = h.parent.mod_ShelfadjDesign ?? '';
                        hoodinsert.AdjShelfDrillType = h.parent.mod_ShelfadjDrillType ?? '';

                        carc.mod_HoodInsertion = true;
                        carc.mod_HoodInformation = JSON.stringify(hoodinsert);
                        h.mod_HoodInformation = JSON.stringify(hoodinsert);
                    }
                }
            });
        }

        //======================================================================
        // Manage the oven
        //======================================================================
        if (p instanceof OD_M_mf_Oven) {
            // Create Carcase ID and Attributes
            GlobalCount++;
            p.mod_CarcaseId = carcaseId;
            p.mod_CarcaseDepth = this.mod_Depth;
            p.mod_CarcaseWidth = this.mod_Width;
            p.mod_CarcaseHeight = height;
            StartPos -= GlobalCount > 1 ? this.mod_FrontGapHor : 0;
            p.setOrigin(0, StartPos, this.mod_Depth);
            GlobalFunc.process_StorageunitColumnPass(this, p, 0, StartPos, this.mod_Depth);

            p.mod_FrontPosStart = StartPos - StartPosCabinet;
            p.mod_Originpos[0] = 0;
            p.mod_Originpos[1] = StartPos;
            p.mod_Originpos[2] = this.mod_Depth;
        }

        //======================================================================
        // Manage the fixed shelves
        //======================================================================
        if (
            p instanceof OD_M_mf_Door ||
            p instanceof OD_M_mf_Fliplift ||
            p instanceof OD_M_mf_Drawer ||
            p instanceof OD_M_mf_Pullout ||
            p instanceof OD_M_mf_PantryPullout ||
            p instanceof OD_M_mf_Oven ||
            p instanceof OD_M_mf_Fridge ||
            p instanceof OD_M_mf_RackArea ||
            p instanceof OD_M_mf_Fixedfront
        ) {
            // Interface to provide the data for the carcase
            //--------------------------------------------------------------------------------------------------------
            interface ShelfFixedInfo {
                PosY: number; // Height position of the fixed shelf
                Fingergrip: boolean; // Fingergrip in front of the fixed shelf
                Position: string; // Position of the fixed shelf related to the fingergrip and front gap
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
            if (GlobalCount === 1 && !(p instanceof OD_M_mf_Oven) && !(p instanceof OD_M_mf_Fridge)) {
                p.mod_ShelffixedBtm = false;
            }

            // If there is a Oven before, we don't need a fixed shelf -> it is set from the oven
            else if (prevM instanceof OD_M_mf_Oven && !(p instanceof OD_M_mf_Oven)) {
                p.mod_ShelffixedBtm = false;
            }

            // If there is a Fridge before, we don't need a fixed shelf -> it is set from the oven or fridge
            else if (prevM instanceof OD_M_mf_Fridge && !(p instanceof OD_M_mf_Oven)) {
                p.mod_ShelffixedBtm = false;
            }

            // If it is the oven and not the first front element
            else if (p instanceof OD_M_mf_Oven) {
                const ovenData = GlobalFunc.process_Oven(this, p, carc, StartPos, StartPosCabinet);
                StartPos = ovenData.nextFront;
                p.mod_Information = ovenData.ovenData;
            }

            // If it is the fridge
            //--------------------------------------------------------------------------------------------------------
            else if (p instanceof OD_M_mf_Fridge) {
                const ovenOnTop = nextM instanceof OD_M_mf_Oven;
                GlobalFunc.process_Fridge(p, carc, GlobalCount, LastFrontElem, ovenOnTop);
            }

            // If it's not the first front element and fixed shelf has been selected
            else if (GlobalCount > 1 && p.mod_ShelffixedBtm && !(p instanceof OD_M_mf_Oven)) {
                insertFixedShelf = true;
            }

            // If there is a RackArea before a Drawer and the fixed shelf should be inserted automatically
            else if (
                p instanceof OD_M_mf_Drawer &&
                prevM instanceof OD_M_mf_RackArea &&
                FixedShelf === 'Automatic'
            ) {
                insertFixedShelf = true;
                p.mod_ShelffixedBtm = true;
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

            // If it is the oven
            //--------------------------------------------------------------------------------------------------------
            if (p instanceof OD_M_mf_Oven) {
                // done in the process_Oven
            }

            // If it is the fridge
            //--------------------------------------------------------------------------------------------------------
            else if (p instanceof OD_M_mf_Fridge) {
                // done in the process_Fridge
                // Get the Information about the doors
                const doorInfo = GlobalFunc.process_Door(p);
                p.mod_DoorDirection = doorInfo.RealDoorDirection;
                p.mod_DoorType = doorInfo.RealDoorType;
                p.mod_Information = JSON.stringify(doorInfo);
            }

            // All the other fronts
            //--------------------------------------------------------------------------------------------------------
            else {
                // Create the object
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

                // Stringify the object and push it to the list attribute
                //--------------------------------------------------------------------------------------------------------
                carc.mod_FrontAreaInfoList.push(JSON.stringify(frontInfo));

                // Save the fingergrip for the next front
                FingergripBottom = !!p.mod_FingergripTop;
            }
        }

        //======================================================================
        // Manage the Vert Dividers
        //======================================================================
        if (p instanceof OD_M_mf_Door) {
            // Get the Information about the doors
            let doorInfo = GlobalFunc.process_Door(p);
            p.mod_DoorDirection = doorInfo.RealDoorDirection;
            p.mod_DoorType = doorInfo.RealDoorType;
            p.mod_Information = JSON.stringify(doorInfo);

            // Set the values of the attributes (will be provided to the carcase)
            VertDividerType[GlobalCount] = doorInfo.VertDivider;
            VertDividerFrontWidth[GlobalCount] = doorInfo.FrontWidthList[0];
            VertDividerFrontName[GlobalCount] = p.mod_ModuleName!;
        } else {
            VertDividerType[GlobalCount] = 'NoVertDivider';
        }

        //======================================================================
        // Manage ModuleName and RackArea
        //======================================================================
        if (p instanceof OD_M_mf_RackArea) {
            FixedShelf = p.mod_RackAreaShelftopConstruction!;
        }
    });

    //======================================================================
    // Stringify the Divider Information and pass it to the mc_Storageunit (will be used to insert the VertDivider in the mc_Storageunit)
    //======================================================================
    let VertDividerInfo = {
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
    columnDiagnosticStage = '3 Calculate carcase (seal)';
    columnDiagnosticStage = 'Plan final column adaptation';
    const standardColumnInfo = {
        Version: 1, IsComplete: true, IsFinalPlan: true, Errors: [] as string[],
        Class: 'None', PlanningDepth: columnInfo.PlanningDepth,
        EffectiveDepth: columnInfo.PlanningDepth, RearOffset: 0,
    };
    try {
        const planned = GlobalFunc.process_StorageunitColumnPlan(
            this, carc, columnRaw, carc.mod_CarcaseWidth, columnInfo.PlanningDepth, CarcaseMovement,
        );
        columnInfo = planned?.IsComplete === true ? planned : standardColumnInfo;
    } catch {
        columnInfo = standardColumnInfo;
    }
    if (columnInfo.Class === 'None') disableColumn();
    this.mod_ColumnWrapInfo[0] = columnInfo.Class === 'None' ? '' : JSON.stringify(columnInfo);
    carc.mod_ColumnWrapInfo[0] = this.mod_ColumnWrapInfo[0];
    carc.mod_CarcaseDepth = columnInfo.EffectiveDepth;
    carc.setOrigin(CarcaseMovement, StartPosCabinet, columnInfo.RearOffset);
    carc.mod_Originpos.length = 0;
    carc.mod_Originpos.push(CarcaseMovement, StartPosCabinet, columnInfo.RearOffset);
    this.mod_ColumnShelfOrigin.length = 0;
    this.mod_ColumnShelfOrigin.push(-CarcaseMovement, -StartPosCabinet, -columnInfo.RearOffset);
    columnDiagnosticStage = 'Create carcase from final plan';

    //======================================================================
    // Seal mc_Storageunit and get attribute with FreeSpace
    //======================================================================
    let sealedCarc = carc.seal();
    columnDiagnosticStage = '4 Carcase calculated, transfer interior dimensions';
    let sealedCarc_CarcaseSpaceDimension = JSON.parse(sealedCarc.mod_CarcaseSpaceDimension[0]);
    let sealedCarc_VertDividerInfoList = JSON.parse(sealedCarc.mod_VertDividerInfoList[0]);
    let sealedCarc_CarcasePartInfo = JSON.parse(sealedCarc.mod_CarcasePartInfo[0]);
    this.mod_ColumnWrapInfo[0] = sealedCarc.mod_ColumnWrapInfo[0] || '';
    if (columnInfo.RearOffset > 0) {
        sealedCarc_CarcaseSpaceDimension.FullDepthStartPos += columnInfo.RearOffset;
        sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos =
            sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos.map(
                (v: number) => v + columnInfo.RearOffset,
            );
        sealedCarc_CarcasePartInfo.HorizontalPartsPosZ =
            sealedCarc_CarcasePartInfo.HorizontalPartsPosZ.map((v: number) => v + columnInfo.RearOffset);
        sealedCarc_CarcasePartInfo.VerticalPartsPosZ = sealedCarc_CarcasePartInfo.VerticalPartsPosZ.map(
            (row: number[] | null) => (row ? row.map((v: number) => v + columnInfo.RearOffset) : row),
        );
    }

    let BtmShelfPosDepth = sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[1];
    let BtmShelfPos = sealedCarc_CarcasePartInfo.HorizontalPartsPosY[1];
    let i = 0;

    // Cycle for the child modules
    this.m.forEach((p) => {
        if (
            p instanceof OD_M_mf_Door ||
            p instanceof OD_M_mf_Fliplift ||
            p instanceof OD_M_mf_Drawer ||
            p instanceof OD_M_mf_Pullout ||
            p instanceof OD_M_mf_PantryPullout ||
            p instanceof OD_M_mf_Fridge ||
            p instanceof OD_M_mf_RackArea ||
            p instanceof OD_M_mf_Fixedfront ||
            p instanceof OD_M_mf_Oven
        ) {
            // Set the attribute for the free space (CarcaseSpaceDimension) regarding each front
            let CarcaseSpaceDimension = {
                ColumnWrap: this.mod_ColumnWrapInfo[0],

                FullWidthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullWidthFreeSpace,
                FullHeightFreeSpace: sealedCarc_CarcaseSpaceDimension.FullHeightFreeSpace,
                FullDepthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullDepthFreeSpace,
                FullWidthStartPos: sealedCarc_CarcaseSpaceDimension.FullWidthStartPos,
                FullHeightStartPos: sealedCarc_CarcaseSpaceDimension.FullHeightStartPos,
                FullDepthStartPos: sealedCarc_CarcaseSpaceDimension.FullDepthStartPos,
                WidthFreeSpace: sealedCarc_CarcaseSpaceDimension.WidthFreeSpace[i],
                HeightFreeSpace: sealedCarc_CarcaseSpaceDimension.HeightFreeSpace[i],
                DepthFreeSpace: sealedCarc_CarcaseSpaceDimension.DepthFreeSpace[i],
                WidthFreeStartPos: sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i],
                HeightFreeStartPos:
                    sealedCarc_CarcaseSpaceDimension.HeightFreeStartPos[i] + StartPosCabinet,
                DepthFreeStartPos: sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos[i],
            };
            let strJson = JSON.stringify(CarcaseSpaceDimension);
            p.mod_CarcaseSpaceDimension.push(strJson);
            p.mod_ColumnWrapInfo[0] = this.mod_ColumnWrapInfo[0];
            GlobalFunc.process_StorageunitColumnPass(
                this,
                p,
                p.mod_Originpos[0] ?? 0,
                p.mod_Originpos[1] ?? StartPosCabinet,
                p.mod_Originpos[2] ?? this.mod_Depth,
            );

            // Sequence of the fronts
            i++;

            // Set the attribute for the VertDividerInfoList info (mod_VertDividerInfoList) regarding each front (will be used for the adjustable shelves)
            if (p instanceof OD_M_mf_Door) {
                let VertDividerInfoList = {
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

            // Provide the CarcasePartInfo regarding each front
            if (
                p instanceof OD_M_mf_Door ||
                p instanceof OD_M_mf_Fridge ||
                p instanceof OD_M_mf_Fliplift
            ) {
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
                    HorizontalPartsFrontAngle.push(
                        sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i + 1],
                    );
                }

                // Set the attribute CarcasePartInfo regarding each front
                let CarcasePartInfo = {
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
            }
        } else if (p instanceof OD_M_mf_Oven) {
            i++;
        }
    });

    //======================================================================
    // Add the PlinthArea to the root-module
    //======================================================================
    const plinth = this.addOD_M_mc_PlinthArea01(1);

    // Set the values to the relevant attributes of the carcase
    //--------------------------------------------------------------------------------------------------------
    plinth.mod_CarcaseDepth = this.mod_Depth - BtmShelfPosDepth;
    plinth.mod_CarcaseWidth = this.mod_Width;
    plinth.mod_CarcaseId = carcaseId;
    plinth.setOrigin(0, BtmShelfPos, BtmShelfPosDepth);

    // Seal the plinth area to retrieve the leg positions
    const sealedPlinth = plinth.seal();
    this.mod_PlinthAreaPositionInfo.push(sealedPlinth.mod_PlinthAreaPositionInfo[0]);

    //======================================================================
    // Create vector / docking
    //======================================================================
    const TopEndCabinet = StartPosCabinet + height;
    let dockPosLeft = 0;
    let dockPosRight = this.mod_Width;
    if (autoUprightLeft) dockPosLeft = -this.mod_UprightThk;
    if (autoUprightRight) dockPosRight = this.mod_Width + this.mod_UprightThk;

    // Left side
    this.addDockingInfo(
        Dock.LeftBottom,
        new Vector3(dockPosLeft, 0, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosLeft, 0, this.mod_Depth),
    );
    this.addDockingInfo(
        Dock.LeftTop,
        new Vector3(dockPosLeft, TopEndCabinet, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosLeft, TopEndCabinet, this.mod_Depth),
    );

    // Right side
    this.addDockingInfo(
        Dock.RightBottom,
        new Vector3(dockPosRight, 0, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosRight, 0, this.mod_Depth),
    );
    this.addDockingInfo(
        Dock.RightTop,
        new Vector3(dockPosRight, TopEndCabinet, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosRight, TopEndCabinet, this.mod_Depth),
    );

    // Back side
    this.addDockingInfo(
        Dock.BackBottom,
        new Vector3(dockPosLeft, 0, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosRight, 0, -this.mod_CarcaseDistanceWall),
    );
    this.addDockingInfo(
        Dock.BackTop,
        new Vector3(dockPosLeft, TopEndCabinet, -this.mod_CarcaseDistanceWall),
        new Vector3(dockPosRight, TopEndCabinet, -this.mod_CarcaseDistanceWall),
    );

    //======================================================================
    // Call the UserExit of this module
    //======================================================================
    const retInfo = GlobalFunc.ue_StorageunitSingle(this);
} catch (columnError: unknown) {
    logError(
        'mr_StorageunitSingle.AfterDataCompletionScript | ' +
            columnDiagnosticStage +
            ' | ' +
            (columnError instanceof Error ? columnError.message : String(columnError)),
    );
    // Never hide the invalid construction behind an apparently successful standard cabinet.
    throw columnError;
}
