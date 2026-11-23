process_GetModuleContextInformation(sourceModule: any): {
    ContextVersion: number;
    SideCoverageComplete: boolean;
    SideCoverageLeft: {
        HeightFrom: number;
        HeightTo: number;
        DepthFrom: number;
        DepthTo: number;
    }[];
    SideCoverageRight: {
        HeightFrom: number;
        HeightTo: number;
        DepthFrom: number;
        DepthTo: number;
    }[];
    NeedsVisibleSideLeft: boolean;
    NeedsVisibleSideRight: boolean;
    ReturnPlinthLeft: boolean;
    ReturnPlinthRight: boolean;
    ReturnCeilingFillerLeft: boolean;
    ReturnCeilingFillerRight: boolean;
    DistanceWallLeft: number;
    DistanceWallRight: number;
    DistanceWallBack: number;
    DistanceCeiling: number;
    FirstElement: boolean;
    LastElement: boolean;
    HasDockingLeft: boolean;
    HasDockingRight: boolean;
    HeightPosition: number;
    SlopedCeiling: boolean;
    SlopedCeilingDirection: 'toLeft' | 'toRight' | 'toBack' | null;
    SlopedCeilingAngle: number;
    SlopedCeilingLevel: number;
    DataComplete: boolean;
}// HOMAG Digital
// Create: Not documented (legacy)
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Reads room contours, wall distances, sloped ceilings and docked neighbours.
// Provides existing context evaluations and additional normalized neighbour envelopes.
// Neighbour envelope coordinates are in millimetres relative to the examined article origin.

// Revisions:
// 2026-11-02 | Ludwig Weber | Accept the shared context API for standalone Cornerunit preparation.
// 2026-11-02 | Ludwig Weber | Nobilia step 1: decoupled carcase finish from spatial side completion.
// 2026-11-02 | Ludwig Weber | Standardized script headers, block comments and English wording.
// 2026-11-02 | Ludwig Weber | Accept the shared context API instead of requiring a complete OD module (TS2740).
// 2026-11-02 | Ludwig Weber | Rename the input parameter to sourceModule and retain the any type confirmed in HI.

//======================================================================

//======================================================================
// process_GetModuleContextInformation
//======================================================================

//======================================================================
// process_GetModuleContextInformation
//======================================================================
{
    // Create the default return object
    interface ArticlePosition {
        x?: number;
        y?: number;
        z?: number;
        rotationY?: number;
    }
    interface RoomSegment {
        x: number;
        y: number;
        angle?: number;
    }
    interface RoomContour {
        level: number;
        segments: RoomSegment[];
    }
    interface ArticleDimension {
        x: number;
        y: number;
        z: number;
        ry: number;
    }
    interface ContextModule {
        _articlePos?: ArticlePosition;
        _contextData?: {
            dockedRoots?: {
                ownDockingVector: Dock;
                dockedRoots?: {
                    id: string;
                }[];
            }[];
        };
        getAttributes(): {
            get(name: string): unknown;
        };
    }
    interface SideCoverage {
        HeightFrom: number;
        HeightTo: number;
        DepthFrom: number;
        DepthTo: number;
    }

    // Coordinates in mm, relative to this article's origin and local depth axis.
    const sideCoverageLeft: SideCoverage[] = [];
    const sideCoverageRight: SideCoverage[] = [];
    let sideCoverageComplete = true;
    const result = {
        ContextVersion: 2,
        SideCoverageLeft: sideCoverageLeft,
        SideCoverageRight: sideCoverageRight,
        SideCoverageComplete: false,
        NeedsVisibleSideLeft: true,
        NeedsVisibleSideRight: true,
        ReturnPlinthLeft: true,
        ReturnPlinthRight: true,
        ReturnCeilingFillerLeft: true,
        ReturnCeilingFillerRight: true,
        DistanceWallLeft: 0,
        DistanceWallRight: 0,
        DistanceWallBack: 0,
        DistanceCeiling: 0,
        FirstElement: false,
        LastElement: false,
        HasDockingLeft: false,
        HasDockingRight: false,
        HeightPosition: 0,
        SlopedCeiling: false,
        SlopedCeilingDirection: null as 'toLeft' | 'toRight' | 'toBack' | null,
        SlopedCeilingAngle: 0,
        SlopedCeilingLevel: 0,
        DataComplete: false,
    };
    // Guard
    if (
        !sourceModule ||
        typeof sourceModule.getContextModule !== 'function' ||
        typeof sourceModule.getRoomContours !== 'function' ||
        typeof sourceModule.getArticlePos !== 'function'
    ) {
        return result;
    }
    // Read all required data from the module
    const EPS = 0.001;
    const WALL_DISTANCE_MAX = 300;
    const moduleContext = sourceModule.getContextModule(sourceModule._id);
    const surroundingContours = sourceModule.getRoomContours() ?? [];
    const articlePos = sourceModule.getArticlePos();
    const articleDimension = {
        x: sourceModule.mod_Width ?? 0,
        y: sourceModule.mod_Height ?? 0,
        z: sourceModule.mod_Depth ?? 0,
        ry: moduleContext?._articlePos?.rotationY ?? 0,
    };
    // Analyze room contours, wall distances and ceiling information
    const surroundingInfo = analyzeSurroundings(surroundingContours, articlePos, articleDimension);
    result.DistanceWallLeft = surroundingInfo.distanceWallLeft;
    result.DistanceWallRight = surroundingInfo.distanceWallRight;
    result.DistanceWallBack = surroundingInfo.distanceWallBack;
    result.DistanceCeiling = surroundingInfo.distanceCeiling;
    result.HeightPosition = surroundingInfo.heightPosition;
    result.SlopedCeiling = surroundingInfo.slopedCeiling;
    const inSlopedCeilingArea = surroundingInfo.slopedCeiling;
    result.SlopedCeilingDirection = surroundingInfo.slopedCeilingDirection;
    result.SlopedCeilingAngle = surroundingInfo.slopedCeilingAngle;
    result.SlopedCeilingLevel = surroundingInfo.slopedCeilingLevel;
    // Analyze neighboring modules and dockings
    const dockingInfo = analyzeDocking(
        sourceModule,
        moduleContext,
        articleDimension.y,
        articleDimension.z,
        articleDimension.ry,
    );
    result.NeedsVisibleSideLeft = dockingInfo.needsVisibleSideLeft;
    result.NeedsVisibleSideRight = dockingInfo.needsVisibleSideRight;

    // In case of sloped ceiling, we need to override the visible sides based on the docking information
    if (inSlopedCeilingArea) {
        result.NeedsVisibleSideLeft = !dockingInfo.hasDockingLeft;
        result.NeedsVisibleSideRight = !dockingInfo.hasDockingRight;
    }
    result.ReturnPlinthLeft = dockingInfo.returnPlinthLeft;
    result.ReturnPlinthRight = dockingInfo.returnPlinthRight;
    result.ReturnCeilingFillerLeft = dockingInfo.returnCeilingFillerLeft;
    result.ReturnCeilingFillerRight = dockingInfo.returnCeilingFillerRight;
    result.HasDockingLeft = dockingInfo.hasDockingLeft;
    result.HasDockingRight = dockingInfo.hasDockingRight;
    // Determine first and last element
    result.FirstElement = surroundingInfo.firstElement && !dockingInfo.hasDockingLeft;
    result.LastElement = surroundingInfo.lastElement && !dockingInfo.hasDockingRight;
    // Data set completed
    result.SideCoverageComplete = sideCoverageComplete && dockingInfo.dataComplete;
    result.DataComplete = dockingInfo.dataComplete && surroundingInfo.dataComplete;
    return result;
    // Helper functions
    // Analyze Docking
    // Analyzes all neighboring modules and determines
    // visible sides, plinth returns and ceiling fillers.
    // Envelope of an actually docked article in this article's coordinate system.
    // Rectangular, orthogonal articles are supported, matching the existing room
    // interpretation. Unknown geometry invalidates the coverage decision.
    // getSideCoverage

    //======================================================================
    // getSideCoverage
    //======================================================================
    function getSideCoverage(
        own: ArticlePosition | undefined,
        neighbour: ArticlePosition | undefined,
        attributes: {
            get(name: string): unknown;
        },
        ownRotation: number,
    ): SideCoverage | undefined {
        if (!own || !neighbour) return undefined;
        const width = attributes.get('mod_Width');
        const depth = attributes.get('mod_Depth');
        const height = attributes.get('mod_Height');
        const coordinates = [own.x, own.y, own.z, neighbour.x, neighbour.y, neighbour.z];
        if (
            !coordinates.every(
                (value: number | undefined) => typeof value === 'number' && Number.isFinite(value),
            ) ||
            typeof width !== 'number' ||
            !Number.isFinite(width) ||
            width <= 0 ||
            typeof depth !== 'number' ||
            !Number.isFinite(depth) ||
            depth <= 0 ||
            typeof height !== 'number' ||
            !Number.isFinite(height) ||
            height <= 0
        )
            return undefined;
        const neighbourRotation = neighbour.rotationY ?? 0;
        if (
            !Number.isFinite(ownRotation) ||
            !Number.isFinite(neighbourRotation) ||
            Math.abs(ownRotation / 90 - Math.round(ownRotation / 90)) > EPS ||
            Math.abs(neighbourRotation / 90 - Math.round(neighbourRotation / 90)) > EPS
        )
            return undefined;

        // The existing HI helpers use +X as depth at rotationY = 90 degrees.
        const ownAngle = (ownRotation * Math.PI) / 180;
        const neighbourAngle = (neighbourRotation * Math.PI) / 180;
        const depthX = Math.sin(ownAngle);
        const depthZ = Math.cos(ownAngle);
        const deltaX = (neighbour.x ?? 0) - (own.x ?? 0);
        const deltaZ = (neighbour.z ?? 0) - (own.z ?? 0);
        const originDepth = deltaX * depthX + deltaZ * depthZ;
        const widthProjection =
            (Math.cos(neighbourAngle) * depthX - Math.sin(neighbourAngle) * depthZ) * width;
        const depthProjection =
            (Math.sin(neighbourAngle) * depthX + Math.cos(neighbourAngle) * depthZ) * depth;
        const projected = [
            originDepth,
            originDepth + widthProjection,
            originDepth + depthProjection,
            originDepth + widthProjection + depthProjection,
        ];

        // mod_Height can represent either carcase or total article height.
        // Prefer an available calculated carcase height, then reconstruct its top
        // using the same floor placement rule as mr_StorageunitSingle.
        const calculatedHeight = attributes.get('mod_CarcaseHeight');
        const plinth = attributes.get('mod_PlinthAreaHeight');
        const insertion =
            attributes.get('mod_PlacementLevels') === 'OnFloor' &&
            typeof plinth === 'number' &&
            Number.isFinite(plinth)
                ? plinth
                : 0;
        let totalHeight = height;
        if (
            typeof calculatedHeight === 'number' &&
            Number.isFinite(calculatedHeight) &&
            calculatedHeight > 0
        ) {
            totalHeight = insertion + calculatedHeight;

            // Include the configured upper closure rather than assuming that
            // the carcase itself reaches the ceiling or covers a countertop edge.
            for (const [enabledId, thicknessId] of [
                ['mod_CreateCountertop', 'mod_CountertopThk'],
                ['mod_CreatePaneltop', 'mod_CountertopThk'],
                ['mod_CreateCeilingFiller', 'mod_CarcaseCeilingDistance'],
            ]) {
                if (enabledId && thicknessId && attributes.get(enabledId) === true) {
                    const extra = attributes.get(thicknessId);
                    if (typeof extra !== 'number' || !Number.isFinite(extra) || extra < 0) return undefined;
                    totalHeight += extra;
                }
            }
        }
        const heightFrom = (neighbour.y ?? 0) - (own.y ?? 0);
        return {
            HeightFrom: heightFrom,
            HeightTo: heightFrom + totalHeight,
            DepthFrom: Math.min(...projected),
            DepthTo: Math.max(...projected),
        };
    }
    // analyzeDocking

    //======================================================================
    // analyzeDocking
    //======================================================================
    function analyzeDocking(
        sourceModule: Pick<
            OD_M_mr_StorageunitSingle,
            | '_id'
            | 'mod_Width'
            | 'mod_Height'
            | 'mod_Depth'
            | 'getContextModule'
            | 'getRoomContours'
            | 'getArticlePos'
        >,
        moduleContext: ContextModule | undefined,
        myHeight: number,
        myDepth: number,
        myRotationY: number,
    ): {
        hasDockingLeft: boolean;
        hasDockingRight: boolean;
        returnPlinthLeft: boolean;
        returnPlinthRight: boolean;
        returnCeilingFillerLeft: boolean;
        returnCeilingFillerRight: boolean;
        needsVisibleSideLeft: boolean;
        needsVisibleSideRight: boolean;
        dataComplete: boolean;
    } {
        const coveredLeft: {
            from: number;
            to: number;
        }[] = [];
        const coveredRight: {
            from: number;
            to: number;
        }[] = [];
        const leftNeighborPositions: (ArticlePosition | undefined)[] = [];
        const rightNeighborPositions: (ArticlePosition | undefined)[] = [];
        const leftNeighborDepths: number[] = [];
        const rightNeighborDepths: number[] = [];
        const leftNeighborRotationYs: number[] = [];
        const rightNeighborRotationYs: number[] = [];
        let dockLeftTop = false;
        let dockRightTop = false;
        let dockLeftBtm = false;
        let dockRightBtm = false;
        let returnPlinthLeftByFrontOffset = false;
        let returnPlinthRightByFrontOffset = false;
        let returnCeilingFillerLeftByFrontOffset = false;
        let returnCeilingFillerRightByFrontOffset = false;
        if (!moduleContext) {
            return {
                hasDockingLeft: false,
                hasDockingRight: false,
                returnPlinthLeft: true,
                returnPlinthRight: true,
                returnCeilingFillerLeft: true,
                returnCeilingFillerRight: true,
                needsVisibleSideLeft: true,
                needsVisibleSideRight: true,
                dataComplete: true,
            };
        }
        const neighborModules = moduleContext._contextData?.dockedRoots || [];
        neighborModules.forEach((neighbor) => {
            const ownDock = neighbor.ownDockingVector;
            switch (ownDock) {
                case Dock.LeftTop:
                    dockLeftTop = true;
                    break;
                case Dock.LeftBottom:
                    dockLeftBtm = true;
                    break;
                case Dock.RightTop:
                    dockRightTop = true;
                    break;
                case Dock.RightBottom:
                    dockRightBtm = true;
                    break;
            }

            // Only side dockings contribute to this calculation. Back/top dockings
            // must not invalidate an otherwise complete side snapshot.
            const isSideDocking =
                ownDock === Dock.LeftBottom ||
                ownDock === Dock.LeftTop ||
                ownDock === Dock.RightBottom ||
                ownDock === Dock.RightTop;
            if (!isSideDocking) return;
            const neighborId = neighbor.dockedRoots?.[0]?.id;
            if (!neighborId) {
                sideCoverageComplete = false;
                return;
            }
            const neighborContext = sourceModule.getContextModule(neighborId);
            const neighborAttributes = neighborContext?.getAttributes();
            if (!neighborAttributes) {
                sideCoverageComplete = false;
                return;
            }

            // Add every side docking, including neighbours that cover only part of
            // the cabinet height. The legacy carcase interpretation below is retained.
            if (
                ownDock === Dock.LeftBottom ||
                ownDock === Dock.LeftTop ||
                ownDock === Dock.RightBottom ||
                ownDock === Dock.RightTop
            ) {
                const coverage = getSideCoverage(
                    moduleContext?._articlePos,
                    neighborContext?._articlePos,
                    neighborAttributes,
                    myRotationY,
                );
                if (coverage) {
                    const list =
                        ownDock === Dock.LeftBottom || ownDock === Dock.LeftTop
                            ? sideCoverageLeft
                            : sideCoverageRight;
                    list.push(coverage);
                } else {
                    sideCoverageComplete = false;
                }
            }
            const neighborHeight = Number(neighborAttributes.get('mod_Height') ?? 0);
            const coveredInterval = getCoveredInterval(ownDock, myHeight, neighborHeight);
            const neighborDepth = Number(neighborAttributes.get('mod_Depth') ?? 0);
            const neighborRotationY = neighborContext?._articlePos?.rotationY ?? 0;
            const myFront = getFrontPosition(moduleContext?._articlePos, myDepth, myRotationY);
            const neighborFront = getFrontPosition(
                neighborContext?._articlePos,
                neighborDepth,
                neighborRotationY,
            );
            const myProtrudesAtFront = myFront > neighborFront + EPS;
            if (myProtrudesAtFront) {
                switch (ownDock) {
                    case Dock.LeftBottom:
                        returnPlinthLeftByFrontOffset = true;
                        break;
                    case Dock.RightBottom:
                        returnPlinthRightByFrontOffset = true;
                        break;
                    case Dock.LeftTop:
                        returnCeilingFillerLeftByFrontOffset = true;
                        break;
                    case Dock.RightTop:
                        returnCeilingFillerRightByFrontOffset = true;
                        break;
                }
            }
            if (!coveredInterval) {
                return;
            }
            if (ownDock === Dock.LeftBottom || ownDock === Dock.LeftTop) {
                coveredLeft.push(coveredInterval);
                leftNeighborPositions.push(neighborContext?._articlePos);
                leftNeighborDepths.push(neighborDepth);
                leftNeighborRotationYs.push(neighborRotationY);
            }
            if (ownDock === Dock.RightBottom || ownDock === Dock.RightTop) {
                coveredRight.push(coveredInterval);
                rightNeighborPositions.push(neighborContext?._articlePos);
                rightNeighborDepths.push(neighborDepth);
                rightNeighborRotationYs.push(neighborRotationY);
            }
        });
        return {
            hasDockingLeft: dockLeftTop || dockLeftBtm,
            hasDockingRight: dockRightTop || dockRightBtm,
            returnPlinthLeft: !dockLeftBtm || returnPlinthLeftByFrontOffset,
            returnPlinthRight: !dockRightBtm || returnPlinthRightByFrontOffset,
            returnCeilingFillerLeft: !dockLeftTop || returnCeilingFillerLeftByFrontOffset,
            returnCeilingFillerRight: !dockRightTop || returnCeilingFillerRightByFrontOffset,
            needsVisibleSideLeft: needsVisibleSide(
                coveredLeft,
                myHeight,
                moduleContext?._articlePos,
                leftNeighborPositions,
                myDepth,
                leftNeighborDepths,
                myRotationY,
                leftNeighborRotationYs,
            ),
            needsVisibleSideRight: needsVisibleSide(
                coveredRight,
                myHeight,
                moduleContext?._articlePos,
                rightNeighborPositions,
                myDepth,
                rightNeighborDepths,
                myRotationY,
                rightNeighborRotationYs,
            ),
            dataComplete: true,
        };
    }
    // Get Front Position
    // Calculates the absolute front edge coordinate of a module in room space.
    // Used to detect front offsets between docked modules
    // for plinth and ceiling filler return decisions.
    // getFrontPosition

    //======================================================================
    // getFrontPosition
    //======================================================================
    function getFrontPosition(
        articlePos: ArticlePosition | undefined,
        depth: number,
        rotationY: number,
    ): number {
        const x = articlePos?.x ?? 0;
        const z = articlePos?.z ?? 0;
        const ry = (((Math.round((rotationY ?? 0) / 90) * 90) % 360) + 360) % 360;
        if (ry === 0) {
            return z + depth;
        }
        if (ry === 90) {
            return x + depth;
        }
        if (ry === 180) {
            return z - depth;
        }
        if (ry === 270) {
            return x - depth;
        }
        return z + depth;
    }
    // Get Back Position
    // Calculates the absolute back edge coordinate of a module in room space.
    // Used together with the front position to detect depth coverage.
    // getBackPosition

    //======================================================================
    // getBackPosition
    //======================================================================
    function getBackPosition(articlePos: ArticlePosition | undefined, rotationY: number): number {
        const x = articlePos?.x ?? 0;
        const z = articlePos?.z ?? 0;
        const ry = (((Math.round((rotationY ?? 0) / 90) * 90) % 360) + 360) % 360;
        if (ry === 0) {
            return z;
        }
        if (ry === 90) {
            return x;
        }
        if (ry === 180) {
            return z;
        }
        if (ry === 270) {
            return x;
        }
        return z;
    }
    // Get Covered Interval
    // Calculates the covered height range created by a neighboring module.
    // getCoveredInterval

    //======================================================================
    // getCoveredInterval
    //======================================================================
    function getCoveredInterval(
        ownDock: Dock,
        myHeight: number,
        neighborHeight: number,
    ): {
        from: number;
        to: number;
    } | null {
        let coveredFrom = 0;
        let coveredTo = 0;
        switch (ownDock) {
            case Dock.LeftBottom:
            case Dock.RightBottom:
                coveredFrom = 0;
                coveredTo = neighborHeight;
                break;
            case Dock.LeftTop:
            case Dock.RightTop:
                coveredFrom = myHeight - neighborHeight;
                coveredTo = myHeight;
                break;
            default:
                return null;
        }

        // Clamp values
        coveredFrom = Math.max(0, coveredFrom);
        coveredTo = Math.min(myHeight, coveredTo);
        if (coveredTo <= coveredFrom) {
            return null;
        }
        return {
            from: coveredFrom,
            to: coveredTo,
        };
    }
    // Is Fully Covered Height
    // Checks whether the complete side of the module
    // is covered in height by neighboring modules.
    // isFullyCoveredHeight

    //======================================================================
    // isFullyCoveredHeight
    //======================================================================
    function isFullyCoveredHeight(
        intervals: {
            from: number;
            to: number;
        }[],
        totalLength: number,
    ): boolean {
        if (totalLength <= 0 || intervals.length === 0) {
            return false;
        }
        const sorted = intervals.slice().sort((a, b) => a.from - b.from);
        let coveredTo = 0;
        for (const interval of sorted) {
            if (interval.from > coveredTo) {
                return false;
            }
            coveredTo = Math.max(coveredTo, interval.to);
            if (coveredTo >= totalLength) {
                return true;
            }
        }
        return false;
    }
    // Is Fully Covered Depth
    // Checks whether the complete depth of the module
    // is covered in depth by neighboring modules.
    // isFullyCoveredDepth

    //======================================================================
    // isFullyCoveredDepth
    //======================================================================
    function isFullyCoveredDepth(
        myArticlePos: ArticlePosition | undefined,
        neighborArticlePos: ArticlePosition | undefined,
        myDepth: number,
        neighborDepth: number,
        myRotationY: number,
        neighborRotationY: number,
    ): boolean {
        if (!myArticlePos || !neighborArticlePos || myDepth <= 0 || neighborDepth <= 0) {
            return false;
        }
        const myBack = getBackPosition(myArticlePos, myRotationY);
        const myFront = getFrontPosition(myArticlePos, myDepth, myRotationY);
        const neighborBack = getBackPosition(neighborArticlePos, neighborRotationY);
        const neighborFront = getFrontPosition(neighborArticlePos, neighborDepth, neighborRotationY);
        const myTo = Math.max(myBack, myFront);
        const neighborTo = Math.max(neighborBack, neighborFront);
        return neighborTo >= myTo - EPS;
    }
    // Needs Visible Side
    // Determines whether a visible side is required.
    // The height intervals describe which height ranges are covered by docked neighbors.
    // A height interval only counts as valid coverage when the same neighbor also covers
    // the complete depth of the current module.
    // Result:
    // - true  = visible side is required
    // - false = side is fully covered in height and depth
    // needsVisibleSide

    //======================================================================
    // needsVisibleSide
    //======================================================================
    function needsVisibleSide(
        coveredHeightIntervals: {
            from: number;
            to: number;
        }[],
        totalHeight: number,
        myArticlePos: ArticlePosition | undefined,
        neighborArticlePositions: (ArticlePosition | undefined)[],
        myDepth: number,
        neighborDepths: number[],
        myRotationY: number,
        neighborRotationYs: number[],
    ): boolean {
        const validCoveredHeightIntervals: {
            from: number;
            to: number;
        }[] = [];
        for (let i = 0; i < coveredHeightIntervals.length; i++) {
            const neighborCoversDepth = isFullyCoveredDepth(
                myArticlePos,
                neighborArticlePositions[i],
                myDepth,
                neighborDepths[i] ?? 0,
                myRotationY,
                neighborRotationYs[i] ?? 0,
            );
            if (neighborCoversDepth) {
                validCoveredHeightIntervals.push(coveredHeightIntervals[i]);
            }
        }
        return !isFullyCoveredHeight(validCoveredHeightIntervals, totalHeight);
    }
    // Analyze Surroundings
    // Analyzes the room contours and calculates
    // wall distances, ceiling distance and sloped ceiling information.
    // This is the former process_AnalyzeArticleSurroundings logic,
    // moved into this function as local helper.
    // analyzeSurroundings

    //======================================================================
    // analyzeSurroundings
    //======================================================================
    function analyzeSurroundings(
        surroundingContours: readonly RoomContour[],
        articlePosition: ArticlePosition,
        articleDimension: ArticleDimension,
    ): {
        distanceWallLeft: number;
        distanceWallRight: number;
        distanceWallBack: number;
        distanceCeiling: number;
        firstElement: boolean;
        lastElement: boolean;
        heightPosition: number;
        slopedCeiling: boolean;
        slopedCeilingDirection: 'toLeft' | 'toRight' | 'toBack' | null;
        slopedCeilingAngle: number;
        slopedCeilingLevel: number;
        dataComplete: boolean;
    } {
        const result = {
            distanceWallLeft: 0,
            distanceWallRight: 0,
            distanceWallBack: 0,
            distanceCeiling: 0,
            firstElement: false,
            lastElement: false,
            heightPosition: 0,
            slopedCeiling: false,
            slopedCeilingDirection: null as 'toLeft' | 'toRight' | 'toBack' | null,
            slopedCeilingAngle: 0,
            slopedCeilingLevel: 0,
            dataComplete: false,
        };

        // Rounding
        // round2

        //======================================================================
        // round2
        //======================================================================
        function round2(value: number): number {
            return Math.round(value * 100) / 100;
        }

        // Guards
        if (!surroundingContours || !surroundingContours.length) {
            return result;
        }
        if (!articlePosition) {
            return result;
        }
        if (!articleDimension) {
            return result;
        }

        // Get all valid contours
        const validContours = surroundingContours.filter(
            (c: RoomContour) => c && typeof c.level === 'number' && !isNaN(c.level) && c.segments?.length,
        );
        if (validContours.length === 0) {
            return result;
        }

        // Get all levels
        const validLevels = validContours.map((c: RoomContour) => c.level);

        // Get the contour-element with the lowest level
        const baseLevel = validContours.reduce((lowest: RoomContour, current: RoomContour) => {
            return current.level < lowest.level ? current : lowest;
        });

        // Extract coordinates
        const xs = baseLevel.segments.map((s: RoomSegment) => s.x);
        const ys = baseLevel.segments.map((s: RoomSegment) => s.y);

        // Get the min and max values
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Article dimensions
        const dimX = articleDimension.x ?? 0;
        const dimY = articleDimension.y ?? 0;
        const dimZ = articleDimension.z ?? 0;

        // Article position
        const x = articlePosition.x ?? 0;
        const y = articlePosition.y ?? 0;
        const z = articlePosition.z ?? 0;

        // Normalize rotation
        const ryRaw = articleDimension.ry ?? 0;
        const ry = (((Math.round(ryRaw / 90) * 90) % 360) + 360) % 360;

        // Find the lowest level
        const lowestLevel = Math.min(...validLevels);
        const groupHeightFromFloor = lowestLevel * -1;

        // Return the distance to the floor
        result.heightPosition = round2(groupHeightFromFloor + y);

        // Calculate the distance to the ceiling
        if (validLevels.length >= 2) {
            const highestLevel = Math.max(...validLevels);
            result.distanceCeiling = round2(highestLevel - y - dimY);
        } else {
            result.distanceCeiling = 0;
        }

        // Distance to the wall
        let disLeft = 0;
        let disRight = 0;
        let disBack = 0;
        if (ry === 0) {
            disLeft = x - minX;
            disRight = maxX - x - dimX;
            disBack = z - minY;
        } else if (ry === 90) {
            disLeft = maxY - z;
            disRight = z - minY - dimX;
            disBack = minX - x;
        } else if (ry === 180) {
            disLeft = maxX - x;
            disRight = x - minX - dimX;
            disBack = maxY - z;
        } else if (ry === 270) {
            disLeft = z - minY - dimX;
            disRight = maxY - z;
            disBack = maxX - x - dimZ;
        }
        result.distanceWallLeft = round2(disLeft);
        result.distanceWallRight = round2(disRight);
        result.distanceWallBack = round2(disBack);

        // First or last element in the group
        // isNearWall

        //======================================================================
        // isNearWall
        //======================================================================
        function isNearWall(distance: number): boolean {
            return distance >= -EPS && distance <= WALL_DISTANCE_MAX + EPS;
        }
        result.firstElement = isNearWall(result.distanceWallLeft);
        result.lastElement = isNearWall(result.distanceWallRight);

        // Sloped ceiling
        let slopedSegmentFound = false;
        for (const contour of validContours) {
            const xs = contour.segments.map((s: RoomSegment) => s.x);
            const ys = contour.segments.map((s: RoomSegment) => s.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            for (let i = 1; i < contour.segments.length; i++) {
                const prev = contour.segments[i - 1];
                const curr = contour.segments[i];
                if (typeof curr.angle !== 'number' || curr.angle === 0) {
                    continue;
                }
                let direction: 'toLeft' | 'toRight' | 'toBack' | null = null;

                // Left side
                if (Math.abs(prev.x - minX) < EPS && Math.abs(curr.x - minX) < EPS) {
                    if (ry === 0) direction = 'toLeft';
                    else if (ry === 90) direction = 'toBack';
                    else if (ry === 180) direction = 'toRight';
                }

                // Right side
                else if (Math.abs(prev.x - maxX) < EPS && Math.abs(curr.x - maxX) < EPS) {
                    if (ry === 0) direction = 'toRight';
                    else if (ry === 180) direction = 'toLeft';
                    else if (ry === 270) direction = 'toBack';
                }

                // Back side
                else if (Math.abs(prev.y - minY) < EPS && Math.abs(curr.y - minY) < EPS) {
                    if (ry === 0) direction = 'toBack';
                    else if (ry === 90) direction = 'toRight';
                    else if (ry === 270) direction = 'toLeft';
                }

                // Front side
                else if (Math.abs(prev.y - maxY) < EPS && Math.abs(curr.y - maxY) < EPS) {
                    if (ry === 90) direction = 'toLeft';
                    else if (ry === 180) direction = 'toBack';
                    else if (ry === 270) direction = 'toRight';
                }
                if (!direction) {
                    continue;
                }
                result.slopedCeiling = true;
                result.slopedCeilingDirection = direction;
                result.slopedCeilingAngle = round2(180 - curr.angle);
                let correctedLevel = contour.level;

                // Correction only if the sloped ceiling falls to the back side of the cabinet
                if (direction === 'toBack' && disBack > 0) {
                    const slopeAngle = 90 - curr.angle;
                    const angleRad = (slopeAngle * Math.PI) / 180;
                    const deltaHeight = Math.tan(angleRad) * disBack;
                    correctedLevel = contour.level + deltaHeight;
                }
                result.slopedCeilingLevel = round2(correctedLevel);
                slopedSegmentFound = true;
                break;
            }
            if (slopedSegmentFound) {
                break;
            }
        }

        // Return the room data
        result.dataComplete = true;
        return result;
    }
}
