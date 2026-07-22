process_DrawingCalculationsApi() {

    enum FeatureType {
        DRILL_VERTICAL = 'DRILL_VERTICAL',
        DRILL_HORIZONTAL = 'DRILL_HORIZONTAL',
        GROOVE = 'GROOVE',
        POCKET = 'POCKET',
        SKIP = 'SKIP',
        UNKNOWN = 'UNKNOWN',
        PART = 'PART',
    }
    // ------------------------------
    // Drawing constants and settings
    // ------------------------------
    const DrawingOptions = {
        DrawingCanvasMargin: 50,
        DrawingCanvasWidth: 1920,
        DrawingCanvasEdgeColor: 'magenta',
        DrawingCanvasBackgroundColor: '#FFFFFF',
        DrawingColorFillDrillHorizontal: '#ffffc6',
        DrawingColorFillDrillVertical: 'gray',
        DrawingColorFillError: '#FF0000',
        DrawingColorFillGroove: '#7fff8e',
        DrawingColorFillPart: '#EEEEEE',
        DrawingColorFillPocket: '#7fc9ff',
        DrawingColorFillSkip: '#FF00FF',
        DrawingColorFillUnknown: '#000000',
        DrawingColorStrokeFeature: '#000000',
        DrawingColorStrokeAnnotation: '#000000',
        DrawingColorStrokeDashedReferenceLine: '#999999',
        DrawingAnnotationFontSize: 13,
        DrawingAnnotationFontFamily: 'Arial narrow',
        DrawingAnnotationStrokeWidth: 0.5,
        DrawingTableStrokeWidth: 1,
        DrawingFeatureStrokeWidth: 1,
        DrawingAnnotationReferenceLineDashLength: 5,
        DrawingAnnotationTextOffsetY: 5,
        DrawingAnnotationSpacing: 5,
        DrawingAnnotationVerticalLineLength: 10,
        DrawingAnnotationTextDecimalSpaces: 2,
        DrawingCanvasMaxZoom: 2,
        DrawingAnnotationFirstAnnotationDistance: 25,
        DrawingTableMarginHorizontal: 100,
        DrawingTableMarginVertical: 5,
        DrawingTableFontSize: 13,
        DrawingTableColorHeaderFill: '#EEEEEE',
        // requires computations from other constants - computed below outside of the object
        DrawingAnnotationDistanceBetweenAnnotationLines: 0,
        DrawingAnnotationDistanceOfFirstAnnotationFromDrawing: 0,
        // For everz feature type of the drawing, define columns (attribute keys) and header names for the table
        TABLES_HEADER: new Map<FeatureType, Map<string, string>>([
            [FeatureType.DRILL_VERTICAL, new Map<string, string>([
                ['$HEADER', 'Drill vertical'],
                ['XA', 'PosX'],
                ['YA', 'PosY'],
                ['DU', 'Diameter'],
                ['TI', 'Depth'],
                ['SIDE_Description_DE', 'Side'],
            ])],
            [FeatureType.DRILL_HORIZONTAL, new Map<string, string>([
                ['$HEADER', 'Drill horizontal'],
                ['XA', 'PosX'],
                ['YA', 'PosY'],
                ['DU', 'Diameter'],
                ['TI', 'Depth'],
                ['SIDE_Description_DE', 'Side'],
            ])],
            [FeatureType.GROOVE, new Map<string, string>([
                ['$HEADER', 'Groove'],
                ['XA', 'StartX'],
                ['YA', 'StartY'],
                ['XE', 'EndX'],
                ['YE', 'EndY'],
                ['RK', 'Direction'],
                ['TI', 'Depth'],
                ['SIDE_Description_DE', 'Side'],
            ])],
            [FeatureType.POCKET, new Map<string, string>([
                ['$HEADER', 'Pocket'],
                ['XA', 'PosX'],
                ['YA', 'PosY'],
                ['LA', 'Length'],
                ['TI', 'Width'],
                ['YE', 'Radius'],
                ['TI', 'Depth'],
                ['SIDE_Description_DE', 'Side'],
            ])],
        ]),
    }
    DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines = DrawingOptions.DrawingAnnotationFontSize + DrawingOptions.DrawingAnnotationTextOffsetY + DrawingOptions.DrawingAnnotationSpacing;
    DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing = DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines + 30;


    enum ViewType {
        TOP = 'TOP',
        BOTTOM = 'BOTTOM',
    };

    const lengthToString = (length: number): string => {
        // round and trim trailing zeros
        return parseFloat(length.toFixed(DrawingOptions.DrawingAnnotationTextDecimalSpaces)).toString();
    };

    const estimateTextLength = (annotationText: string): number => {
        return Array.from(annotationText).reduce((acc: number, char: string) => {
            return acc + DrawingOptions.DrawingAnnotationFontSize * 0.5;
        }, 0);
    };

    /** Process the incoming BOM data */
    class NcData {
        /** MPR Tool being used for this entry */
        Tool = '';
        /** Own definition: English representation of the feature name based on the Tool value */
        ToolFeatureDescription: FeatureType = FeatureType.UNKNOWN;
        Error: string | undefined = undefined;
        /** List of views where this feature is visible */
        VisibleInViews: ViewType[] = [];
        /** Grid distance */
        AB = 0;
        /** Count - WE DON'T HAVE TC ATTRIBUTE FOR THIS */
        AN = 0;
        /** Processing direction - X|Y Plus|Minus */
        BM: 'XP' | 'XM' | 'YP' | 'YM' | '' = '';
        /** NC width, MPR width of processing */
        BR = 0;
        /** Position X */
        coorX1 = 0;
        /** Position Y */
        coorY1 = 0;
        /** Diameter */
        DU = 0;
        /** Diameter */
        DUF = 0;
        /** NC length, length of processing */
        LA = 0;
        /** NC length, length of processing */
        LAF = 0;
        /** Groove width */
        NB = 0;
        /** Radius */
        RD = 0;
        /** Side of the machining */
        SIDE = '';
        /** Color representation of the side */
        SIDE_Color = '#767A95';
        /** German description of the side */
        SIDE_Description_DE = 'unbekannt';
        /** Depth */
        TI = 0;
        /** Depth */
        TIF = 0;
        /** Orientation angle */
        WI = 0;
        /** Pos X */
        XA = 0;
        /** End pos / end point X */
        XE = 0;
        /** Pos Y */
        YA = 0;
        /** End pos / end point Y */
        YE = 0;
        /**  */
        RK: 'WRKL' | 'WRKR' | '' = '';

        constructor(objRaw: any, parentPart: any) {

            const obj: any = {};

            if (objRaw.getAttributes) {
                objRaw.getAttributes().forEach((value: any, key: string) => {
                    obj[key] = value;
                });
            }
            else if (objRaw.toJson) {
                Object.assign(obj, objRaw.toJson().a);
            }
            else {
                Object.assign(obj, objRaw);
            }

            this.Tool = obj.nc_TOOL ?? this.Tool;
            this.coorX1 = obj.nc_XA ?? this.coorX1;
            this.coorY1 = obj.nc_YA ?? this.coorY1;
            this.XA = obj.nc_XA ?? this.XA;
            this.XE = obj.nc_XE ?? this.XE;
            this.YA = obj.nc_YA ?? this.YA;
            this.YE = obj.nc_YE ?? this.YE;
            this.DU = obj.nc_DU ?? this.DU;
            this.DUF = obj.nc_DU ?? this.DUF;
            this.WI = obj.nc_WI ?? this.WI;
            this.LA = obj.nc_LA ?? this.LA;
            this.LAF = obj.nc_LA ?? this.LAF;
            this.BR = obj.nc_BR ?? this.BR;
            this.RD = obj.nc_RD ?? this.RD;
            if (obj.nc_AN) {
                logWarning('The NcData provided an AN value, although it was not expected. This means that it is not based on a module attribute but gets filled somewhere else.');
            }
            this.AN = obj.nc_AN ?? this.AN;
            this.AB = obj.nc_AB ?? this.AB;
            this.NB = obj.nc_NB ?? this.NB;
            this.BM = obj.nc_BM ?? this.BM;
            this.TI = obj.nc_TI ?? this.TI;
            this.TIF = obj.nc_TI ?? this.TIF;
            this.SIDE = obj.nc_Side ?? this.SIDE;
            this.RK = obj.nc_RK ?? this.RK;

            // Following is taken from the original bom_outputs.ts by LW, version before April 2025
            switch (this.SIDE) {
                case 'Top':
                    this.SIDE_Description_DE = 'von oben';
                    this.SIDE_Color = '#767A95';
                    break;
                case 'Btm':
                    this.SIDE_Description_DE = 'von unten';
                    this.SIDE_Color = '#F5D0A9';
                    break;
                case 'Front':
                    this.SIDE_Description_DE = 'von vorne';
                    this.SIDE_Color = '#767A95';
                    break;
                case 'Back':
                    this.SIDE_Description_DE = 'von hinten';
                    this.SIDE_Color = '#767A95';
                    break;
                case 'Left':
                    this.SIDE_Description_DE = 'von links';
                    this.SIDE_Color = '#767A95';
                    break;
                case 'Right':
                    this.SIDE_Description_DE = 'von rechts';
                    this.SIDE_Color = '#767A95';
                    break;
                default:
                    this.SIDE_Description_DE = 'unbekannt';
                    this.SIDE_Color = '#767A95';
            }
            const processingGoesThrough = this.TI >= parentPart._thickness;
            switch (obj.nc_TOOL) {
                case '102':
                    this.ToolFeatureDescription = FeatureType.DRILL_VERTICAL;
                    if (processingGoesThrough || this.SIDE === 'Top') { this.VisibleInViews.push(ViewType.TOP); }
                    if (processingGoesThrough || this.SIDE === 'Btm') { this.VisibleInViews.push(ViewType.BOTTOM); }
                    break;
                case '103':
                    this.ToolFeatureDescription = FeatureType.DRILL_HORIZONTAL;
                    this.VisibleInViews.push(ViewType.TOP);
                    this.VisibleInViews.push(ViewType.BOTTOM);
                    break;
                case '109':
                    this.ToolFeatureDescription = FeatureType.GROOVE;
                    if (processingGoesThrough || this.SIDE === 'Top') { this.VisibleInViews.push(ViewType.TOP); }
                    if (processingGoesThrough || this.SIDE === 'Btm') { this.VisibleInViews.push(ViewType.BOTTOM); }
                    break;
                case '112':
                    this.ToolFeatureDescription = FeatureType.POCKET;
                    if (processingGoesThrough || this.SIDE === 'Top') { this.VisibleInViews.push(ViewType.TOP); }
                    if (processingGoesThrough || this.SIDE === 'Btm') { this.VisibleInViews.push(ViewType.BOTTOM); }
                    break;
                case '139':
                    this.ToolFeatureDescription = FeatureType.SKIP;
                    break;
                default:
                    this.ToolFeatureDescription = FeatureType.UNKNOWN;
            }
            if (this.SIDE === '' && this.ToolFeatureDescription !== FeatureType.DRILL_HORIZONTAL && this.ToolFeatureDescription !== FeatureType.SKIP && this.ToolFeatureDescription !== FeatureType.UNKNOWN) {
                logWarning('NcData has no SIDE value, this is not expected. Please check the data.');
                this.VisibleInViews.push(ViewType.TOP);
                this.VisibleInViews.push(ViewType.BOTTOM);
                this.Error = (this.Error ?? '') + 'SIDE="";';
            }
            if (this.ToolFeatureDescription === 'UNKNOWN') {
                logWarning('NcData has unknown ToolFeatureDescription value, this is not expected. Please check the data.');
                this.VisibleInViews.push(ViewType.TOP);
                this.VisibleInViews.push(ViewType.BOTTOM);
                this.Error = (this.Error ?? '') + 'ToolUnknown;';
            }
            if (this.Error) {
                logWarning('NcData error ' + this.Error);
            }
        }


        /**
         * Careful equal comparison to prevent multiple occurences. Lesser problem is to have something twice than to skip it.
         * For known and useful features, we will compare their relevant values.
         * For unknown or unuseful features, we just define they are inequal.
         */
        isEqual(other: NcData): boolean {
            if (
                this.ToolFeatureDescription !== other.ToolFeatureDescription
            ) {
                return false;
            }
            switch (this.ToolFeatureDescription) {
                case FeatureType.DRILL_VERTICAL:
                    return (
                        this.XA === other.XA
                        && this.YA === other.YA
                        && this.TI === other.TI
                        && this.DU === other.DU
                        && this.VisibleInViews.length === other.VisibleInViews.length
                        && this.VisibleInViews.every((view) => other.VisibleInViews.includes(view))
                    );
                case FeatureType.DRILL_HORIZONTAL:
                    return (
                        this.XA === other.XA
                        && this.YA === other.YA
                        && this.TI === other.TI
                        && this.DU === other.DU
                        && this.BM === other.BM
                        && this.VisibleInViews.length === other.VisibleInViews.length
                        && this.VisibleInViews.every((view) => other.VisibleInViews.includes(view))
                    );
                case FeatureType.POCKET:
                    return (
                        this.XA === other.XA
                        && this.YA === other.YA
                        && this.TI === other.TI
                        && this.LA === other.LA
                        && this.VisibleInViews.length === other.VisibleInViews.length
                        && this.VisibleInViews.every((view) => other.VisibleInViews.includes(view))
                    );
                case FeatureType.GROOVE:
                    return (
                        this.XA === other.XA
                        && this.XE === other.XE
                        && this.YA === other.YA
                        && this.YE === other.YE
                        && this.TI === other.TI
                        && this.NB === other.NB
                        && this.RK === other.RK
                        && this.VisibleInViews.length === other.VisibleInViews.length
                        && this.VisibleInViews.every((view) => other.VisibleInViews.includes(view))
                    );
                case FeatureType.SKIP:
                case FeatureType.UNKNOWN:
                default:
                    return false;
            }
        }

        static fromAny(obj: Array<any>, parentPart: any): NcData[] {
            const result: NcData[] = [];

            obj.forEach((item: any) => {
                const ncData = new NcData(item, parentPart);
                if ((ncData.XA === 0 && ncData.YA === 0) === false) {
                    result.push(ncData);
                }
                if (item._subBom) {
                    const subNcData = NcData.fromAny(item._subBom, parentPart);
                    result.push(...subNcData);
                }
            });

            return result;
        }
    }

    /** Represent an object structure which can be exported in an XML format. Also contains a constructor for creating a header of an SVG object used further in the drawings. */
    class XmlObject {
        tag: string;
        attributes: any;
        children: any[];
        [key: string]: any;
        metadata: any = {};

        constructor(tag: string, attributes: any = {}, children: any[] = []) {
            this.tag = tag;
            this.attributes = attributes;
            this.children = children;
        }

        push(child: XmlObject | XmlObject[] | string, atStart: boolean = false): void {
            const method = atStart ? 'unshift' : 'push';
            if (Array.isArray(child)) {
                this.children[method](...child);
            }
            else {
                this.children[method](child);
            }
        }

        toString(indent: string = '  ', level: number = 0): string {
            let result = `${indent.repeat(level)}<${this.tag}`

            const keysOfAttributes = Object.keys(this.attributes);
            if (keysOfAttributes.length > 0) {
                result += ` ${keysOfAttributes.map(key => `${key}="${this.attributes[key]}"`).join(' ')}`;
            }

            if (this.children?.length) {
                result += `>`;
                for (const child of this.children) {
                    if (child instanceof XmlObject) {
                        result += `\n${child.toString(indent, level + 1)}`;
                    }
                    else if (typeof child === 'string') {
                        result += `\n${indent.repeat(level + 1)}${child}`;
                    }
                    else {
                        result += `\n${indent.repeat(level + 1)}${child.toString()}`;
                    }
                }
                result += `\n${indent.repeat(level)}</${this.tag}>`;
            }
            else {
                result += ` />`;
            }
            return result;
        }

        deepFind(idValue: string, idKey: string = 'id'): XmlObject | null {
            if (this.attributes[idKey] === idValue) {
                return this;
            }
            for (const child of this.children) {
                if (child instanceof XmlObject) {
                    const found = child.deepFind(idValue, idKey);
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        }
        deepFindAll(idValue: string, idKey: string = 'id'): XmlObject[] {
            const found: XmlObject[] = [];
            if (this.attributes[idKey] === idValue) {
                found.push(this);
            }
            for (const child of this.children) {
                if (child instanceof XmlObject) {
                    found.push(...child.deepFindAll(idValue));
                }
            }
            return found;
        }

        static CreateSvgHeader(): XmlObject {
            const canvasWidth = DrawingOptions.DrawingCanvasWidth;
            const canvasHeight = DrawingOptions.DrawingCanvasWidth;

            const arrowLength = 12;
            const arrowWidth = 6;

            return new XmlObject(
                'svg',
                {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: canvasWidth,
                    height: canvasHeight,
                },
                [
                    new XmlObject(
                        'defs',
                        {},
                        [
                            new XmlObject(
                                'marker',
                                {
                                    id: 'arrEnd',
                                    markerWidth: arrowLength,
                                    markerHeight: arrowWidth,
                                    refX: arrowLength,
                                    refY: arrowWidth / 2,
                                    orient: 'auto',
                                },
                                [
                                    new XmlObject(
                                        'path',
                                        {
                                            d: `M0,0 L${arrowLength},${arrowWidth / 2} L0,${arrowWidth} z`,
                                            fill: 'context-stroke',
                                        }
                                    ),
                                ]
                            ),
                            new XmlObject(
                                'marker',
                                {
                                    id: 'arrStart',
                                    markerWidth: arrowLength,
                                    markerHeight: arrowWidth,
                                    refX: 0,
                                    refY: arrowWidth / 2,
                                    orient: 'auto',
                                },
                                [
                                    new XmlObject(
                                        'path',
                                        {
                                            d: `M0,${arrowWidth / 2} L${arrowLength},0 L${arrowLength},${arrowWidth} z`,
                                            fill: 'context-stroke',
                                        }
                                    ),
                                ]
                            ),
                        ]
                    ),
                ],
            );

        }










    }

    /** Bounding box of a 2D drawing */
    class BoundingBox {
        x: number;
        y: number;
        w: number;
        h: number;

        annotations: { left: number, right: number, top: number, bottom: number } = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };

        constructor(x: number, y: number, w: number, h: number, annotations?: { left: number, right: number, top: number, bottom: number }) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            if (annotations) {
                this.annotations = annotations;
            }
        }

        getZoomedBoundingBox(zoom: number): BoundingBox {
            return new BoundingBox(
                this.x - this.annotations.left * zoom,
                this.y - this.annotations.bottom * zoom,
                this.w + (this.annotations.left + this.annotations.right) * zoom,
                this.h + (this.annotations.top + this.annotations.bottom) * zoom,
                {
                    left: this.annotations.left,
                    right: this.annotations.right,
                    top: this.annotations.top,
                    bottom: this.annotations.bottom,
                }
            );
        }
    }

    /** A point that is being annotated. */
    class AnnotatedPoint {
        x: number;
        y: number;
        type: FeatureType;
        label: string | null = null;

        constructor(x: number, y: number, type: FeatureType, label: string | undefined = undefined) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.label = label ?? null;
        }
    }

    /** Annotation lines is constructed from annotated points that should be referred by a single annotation line. */
    class AnnotationLine {
        segments: number[] = [];
        referenceCoordinate: number;
        featureType: FeatureType;

        constructor(
            segments: number[],
            referenceCoordinate: number,
            featureType: FeatureType,
        ) {
            this.segments = segments.sort((a: number, b: number) => a - b);
            this.referenceCoordinate = referenceCoordinate;
            this.featureType = featureType;
        }
        toSvg(
            startX: number = 0,
            startY: number = 0,
            zoom: number = 1,
            type: 'horizontal' | 'vertical-topview' | 'vertical-bottomview' = 'horizontal',
            verticalLineDirection: 'up' | 'down' = 'up',
            verticalLineAddition: number = 0,
        ): XmlObject {
            const azimuth = type === 'horizontal' ? 0 : -90;


            // wrapper and return object
            const annotation = new XmlObject('g', {
                transform: `translate(${startX}, ${startY}) rotate(${azimuth})`,
            }, []);

            // for sorting of the annotations to draw them in a correct SVG order
            annotation.metadata = {
                x: startX,
                y: startY,
            };

            let fill;
            switch (this.featureType) {
                case FeatureType.DRILL_HORIZONTAL: fill = DrawingOptions.DrawingColorFillDrillHorizontal; break;
                case FeatureType.DRILL_VERTICAL: fill = DrawingOptions.DrawingColorFillDrillVertical; break;
                case FeatureType.GROOVE: fill = DrawingOptions.DrawingColorFillGroove; break;
                case FeatureType.POCKET: fill = DrawingOptions.DrawingColorFillPocket; break;
                case FeatureType.SKIP: fill = DrawingOptions.DrawingColorFillSkip; break;
                case FeatureType.UNKNOWN: fill = DrawingOptions.DrawingColorFillUnknown; break;
                case FeatureType.PART: fill = DrawingOptions.DrawingColorFillPart; break;
                default: fill = DrawingOptions.DrawingColorFillError; break;
            }

            //--------------
            // Definitions
            //--------------
            const spacing = DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines - DrawingOptions.DrawingAnnotationVerticalLineLength;

            const verticalY1 = -DrawingOptions.DrawingAnnotationVerticalLineLength / 2 - (verticalLineDirection === 'up' ? spacing + verticalLineAddition : 0);
            const verticalY2 = DrawingOptions.DrawingAnnotationVerticalLineLength / 2 + (verticalLineDirection === 'down' ? spacing + verticalLineAddition : 0);

            const vertical = (pos: number) => {

                return new XmlObject('line', {
                    x1: pos * zoom,
                    y1: verticalY1,
                    x2: pos * zoom,
                    y2: verticalY2,
                    stroke: DrawingOptions.DrawingColorStrokeAnnotation,
                    'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                    'vector-effect': 'non-scaling-stroke',
                });
            };
            const horizontal = (pos: number, length: number, leftArrow: boolean = true, rightArrow: boolean = true) => new XmlObject('line', {
                x1: pos * zoom,
                y1: 0,
                x2: (pos + length) * zoom,
                y2: 0,
                stroke: DrawingOptions.DrawingColorStrokeAnnotation,
                'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                'vector-effect': 'non-scaling-stroke',
                'marker-end': rightArrow ? 'url(#arrEnd)' : undefined,
                'marker-start': leftArrow ? 'url(#arrStart)' : undefined,
            });


            const text = (pos: number, length: number, additionalOffsetY: number) => {
                const annotationText = lengthToString(length);
                const annotationTextEstimateLength = estimateTextLength(annotationText);
                // opaque background rectangle that hides the <line>s behind it
                const backgroundRect = new XmlObject('rect', {
                    x: (pos * zoom - annotationTextEstimateLength / 2),
                    y: -DrawingOptions.DrawingAnnotationTextOffsetY * 0.8 - additionalOffsetY - DrawingOptions.DrawingAnnotationFontSize,
                    width: annotationTextEstimateLength,
                    height: DrawingOptions.DrawingAnnotationFontSize,
                    fill: DrawingOptions.DrawingCanvasBackgroundColor,
                    'fill-opacity': '1',
                    stroke: 'none',
                });

                const text = new XmlObject('text', {
                    x: (pos) * zoom,
                    y: -DrawingOptions.DrawingAnnotationTextOffsetY - additionalOffsetY,
                    'font-size': `${DrawingOptions.DrawingAnnotationFontSize}px`,
                    'font-family': DrawingOptions.DrawingAnnotationFontFamily,
                    'text-anchor': 'middle',
                    'dominant-baseline': 'bottom',
                    fill: DrawingOptions.DrawingColorStrokeAnnotation,
                    'vector-effect': 'non-scaling-stroke',
                }, [
                    annotationText,
                ]);

                return [backgroundRect, text];
            }

            //---------------
            // Calculate coordinates of the annotations - vertical views need to be reversed because +y in the SVG is down, which is opposite of our coordinates
            //---------------

            const lengths = [];
            for (let i = 0; i < this.segments.length - 1; i++) {
                const curr = this.segments[i];
                const next = this.segments[i + 1];
                const length = Math.abs(next - curr);
                lengths.push(length);
            }

            if (
                type === 'vertical-bottomview'
                || type === 'vertical-topview'
            ) {
                lengths.reverse();
            }

            const adjustedSegments = [0];
            let runningValue = 0;
            for (let i = 0; i < this.segments.length - 1; i++) {
                runningValue += lengths[i];
                adjustedSegments.push(runningValue);
            }

            //---------------
            // Calculate space around the annotations and if the annotations fit
            //---------------

            const estimatedTextLengths = lengths.map((length: number) => estimateTextLength(lengthToString(length)));
            const zoomedLengths = lengths.map((length: number) => length * zoom);
            const remainingSpaceAroundAnnotationText = zoomedLengths.map((space: number, index: number) => (space - estimatedTextLengths[index]) / 2);

            //---------------
            // Draw the annotations
            //---------------

            const verticals: XmlObject[] = [];
            verticals.push(vertical(adjustedSegments[0]));
            for (let i = 0; i < adjustedSegments.length - 1; i++) {
                const curr = adjustedSegments[i];
                const next = adjustedSegments[i + 1];
                const length = next - curr;
                const zoomedLength = length * zoom;
                verticals.push(vertical(next));

                const remainingSpace = remainingSpaceAroundAnnotationText[i];
                const estTextLen = estimatedTextLengths[i];
                const fits = remainingSpace > 0;
                const addition = 10;

                if (fits) {
                    annotation.push(horizontal(curr, length, true, true));
                    annotation.push(text(curr + length / 2, length, 0));
                }
                else {

                    if (i == 0) {
                        annotation.push(horizontal(curr, length, false, false));
                        annotation.push(horizontal(curr - estTextLen - addition, estTextLen + addition, false, true));
                        annotation.push(horizontal(next, DrawingOptions.DrawingAnnotationStrokeWidth, true, false));
                        annotation.push(text(curr - estTextLen / 2 - addition, length, 0));
                        remainingSpaceAroundAnnotationText[i] = length * zoom;
                    }
                    else if (i == adjustedSegments.length - 2) {
                        annotation.push(horizontal(curr, length, false, false));
                        annotation.push(horizontal(next, estTextLen + addition, true, false));
                        annotation.push(horizontal(curr - DrawingOptions.DrawingAnnotationStrokeWidth, DrawingOptions.DrawingAnnotationStrokeWidth, false, true));
                        annotation.push(text(next + estTextLen / 2 + addition, length, 0));
                        remainingSpaceAroundAnnotationText[i] = length * zoom;
                    }
                    else {
                        const remainingSpaceOfLeft = remainingSpaceAroundAnnotationText[i - 1] ?? -999;
                        const remainingSpaceOfRight = remainingSpaceAroundAnnotationText[i + 1] ?? -999;

                        const overlapSize = (estTextLen - zoomedLength) / 2;

                        if (
                            overlapSize < remainingSpaceOfLeft
                            && (
                                (overlapSize < remainingSpaceOfRight)
                                // penultimate annotation, where the last one doesn't fit and will clear the way - which we don't know yet based on remainingSpaceOfRight
                                || (remainingSpaceOfRight < 0 && i === adjustedSegments.length - 3)
                            )
                        ) {
                            // small, but doesn't collide with neighbbours -> make the verticals around it lower
                            [verticals[i], verticals[i + 1]].forEach((vert: XmlObject) => {
                                vert.attributes.y1 = -DrawingOptions.DrawingAnnotationVerticalLineLength / 4;
                            });
                            annotation.push(horizontal(curr, length, true, true));
                            annotation.push(text(curr + length / 2, length, 0));
                        }
                        else {
                            const t = text(curr + length / 2, length, 0);
                            t[1].attributes.fill = 'red';
                            annotation.push(t);
                            logWarning(`Annotation ${i} does not fit: ${lengthToString(length)} (${length})`);
                        }
                    }

                }

            }

            annotation.push(verticals);


            // Sort in following order so that the lines are interrupted behind the text
            // This might be redundant, since the line and text doesn't collide on 1 annotation line and rect is always before the text
            const sortOrder = ['line', 'rect', 'text'];
            annotation.children.sort((a: XmlObject, b: XmlObject) => {
                const aSort = sortOrder.indexOf(a.tag);
                const bSort = sortOrder.indexOf(b.tag);
                return aSort - bSort;
            });

            return annotation;
        }
    }

    /**
     * This represents a top or bottom view of a 2D drawing. Constructed from a list of NC Data and part data.
     * Construction starts by passing the part and NcData, then the SVGs of the drawing and the features are created.
     * All necessary annotations are evaluated.
     * Here the construction stops.
     * Next step is to compute the canvas size and zoom of the drawing and the annotations and then draw the annotations (they are not zoomed).
     * 
     */
    class PartDrawingView {
        viewType: ViewType;
        part: any;
        ncData: NcData[] = [];
        svg: XmlObject;
        annotatedPoints: AnnotatedPoint[] = [];
        referenceLinesVerticalXCoordinates: number[] = [];
        referenceLinesHorizontalYCoordinates: number[] = [];
        annotations: { left: AnnotationLine[], right: AnnotationLine[], top: AnnotationLine[], bottom: AnnotationLine[] } = {
            left: [],
            right: [],
            top: [],
            bottom: [],
        };
        boundingBox: BoundingBox;

        coordinateTransformerX: (c: number) => number;
        coordinateTransformerY: (c: number) => number;

        constructor(args: {
            viewType: ViewType,
            ncData: NcData[],
            part: any,
        }) {
            this.viewType = args.viewType;

            this.coordinateTransformerX = (c: number) => c;
            this.coordinateTransformerY = (c: number) => c;
            if (this.viewType === ViewType.TOP) {
                this.coordinateTransformerY = (c: number) => this.part._depth - c;
            }

            this.ncData = args.ncData.filter((item) => {
                return item.VisibleInViews.includes(this.viewType);
            });
            this.part = args.part;
            this.svg = new XmlObject('g', {
                id: this.viewType.toLowerCase() + ' view',
                transform: `translate(${DrawingOptions.DrawingCanvasMargin}, ${DrawingOptions.DrawingCanvasMargin})`,
            });
            this.drawPart();
            this.setAnnotatedPoints();
            this.drawReferenceLines();
            this.drawFeatures();
            this.evaluateAnnotations();
            this.boundingBox = this.getBoundingBox();
        }

        lineSegmentFromOutsideToInside(xa: number, ya: number, xe: number, ye: number): { xa: number, ya: number, xe: number, ye: number } {
            const original = { xa, xe, ya, ye };


            const dx = xe - xa;
            const dy = ye - ya;

            if (dx !== 0 && dy !== 0) {
                // linear function y=kx+q
                const k = dy / dx;
                const q = ye - k * xe;
                const fx = (x: number) => k * x + q;
                const fy = (y: number) => (y - q) / k;

                // TODO
                if (xa < 0) { xa = fx(0); }
                else if (xa > this.part._width) { xa = fx(this.part._width); }

                if (xe < 0) { xe = fx(0); }
                else if (xe > this.part._width) { xe = fx(this.part._width); }

                if (ya < 0) { ya = fy(0); }
                else if (ya > this.part._depth) { ya = fy(this.part._depth); }

                if (ye < 0) { ye = fy(0); }
                else if (ye > this.part._depth) { ye = fy(this.part._depth); }

                if (
                    xa < 0 || xa > this.part._width
                    || xe < 0 || xe > this.part._width
                    || ya < 0 || ya > this.part._depth
                    || ye < 0 || ye > this.part._depth
                ) {
                    logWarning(`Line segment from outside to inside: ${JSON.stringify(original)}`);
                }
            }
            else {

                if (dx === 0) {
                    if (ya < 0) { ya = 0; }
                    else if (ya > this.part._depth) { ya = this.part._depth; }

                    if (ye < 0) { ye = 0; }
                    else if (ye > this.part._depth) { ye = this.part._depth; }
                }
                // not else if, could be two points at the same position; such a case will be covered
                if (dy === 0) {
                    if (xa < 0) { xa = 0; }
                    else if (xa > this.part._width) { xa = this.part._width; }

                    if (xe < 0) { xe = 0; }
                    else if (xe > this.part._width) { xe = this.part._width; }
                }
            }



            return { xa, ya, xe, ye };
        }

        /** Draw the part rectangle */
        drawPart() {
            const partRect = new XmlObject('rect', {
                x: 0,
                y: 0,
                width: this.part._width,
                height: this.part._depth,
                fill: DrawingOptions.DrawingColorFillPart,
                'stroke-width': DrawingOptions.DrawingFeatureStrokeWidth,
                stroke: DrawingOptions.DrawingColorStrokeFeature,
                'vector-effect': 'non-scaling-stroke',
            });
            this.svg.push(partRect);
        }

        /** Go through all ncData and evaluate which points need to be annotated. */
        setAnnotatedPoints() {
            const fX = this.coordinateTransformerX;
            const fY = this.coordinateTransformerY;

            // the part itself
            this.annotatedPoints.push(new AnnotatedPoint(0, 0, FeatureType.UNKNOWN, this.part._partNumber));
            this.annotatedPoints.push(new AnnotatedPoint(this.part._width, 0, FeatureType.UNKNOWN, this.part._partNumber));
            this.annotatedPoints.push(new AnnotatedPoint(0, this.part._depth, FeatureType.UNKNOWN, this.part._partNumber));
            this.annotatedPoints.push(new AnnotatedPoint(this.part._width, this.part._depth, FeatureType.UNKNOWN, this.part._partNumber));

            this.ncData.forEach((entry: NcData) => {
                if (entry.ToolFeatureDescription === FeatureType.DRILL_VERTICAL) {
                    this.annotatedPoints.push(new AnnotatedPoint(fX(entry.XA), fY(entry.YA), FeatureType.DRILL_VERTICAL, entry.ToolFeatureDescription));
                }
                else if (entry.ToolFeatureDescription === FeatureType.DRILL_HORIZONTAL) {

                    this.annotatedPoints.push(new AnnotatedPoint(fX(entry.XA), fY(entry.YA), FeatureType.DRILL_HORIZONTAL, entry.ToolFeatureDescription));
                }
                else if (entry.ToolFeatureDescription === FeatureType.GROOVE) {
                    const C = this.lineSegmentFromOutsideToInside(fX(entry.XA), fY(entry.YA), fX(entry.XE), fY(entry.YE));

                    this.annotatedPoints.push(new AnnotatedPoint(C.xa, C.ya, FeatureType.GROOVE, entry.ToolFeatureDescription));
                    this.annotatedPoints.push(new AnnotatedPoint(C.xe, C.ye, FeatureType.GROOVE, entry.ToolFeatureDescription));
                }
                else if (entry.ToolFeatureDescription === FeatureType.POCKET) {
                    const rw = entry.LA;
                    const rh = entry.TI;
                    const x = fX(entry.XA);
                    const y = fY(entry.YA + rh / 2);
                    const rx = x - rw / 2;
                    const ry = y - rh / 2;
                    this.annotatedPoints.push(new AnnotatedPoint(rx, ry, FeatureType.POCKET, entry.ToolFeatureDescription));
                    this.annotatedPoints.push(new AnnotatedPoint(rx + rw, ry, FeatureType.POCKET, entry.ToolFeatureDescription));
                    this.annotatedPoints.push(new AnnotatedPoint(rx, ry + rh, FeatureType.POCKET, entry.ToolFeatureDescription));
                    this.annotatedPoints.push(new AnnotatedPoint(rx + rw, ry + rh, FeatureType.POCKET, entry.ToolFeatureDescription));
                }
            });
        }

        /** Draw the features of the part - drills, grooves, pockets */
        drawFeatures() {
            const fX = this.coordinateTransformerX;
            const fY = this.coordinateTransformerY;

            this.ncData.forEach((entry: NcData) => {
                if (entry.Error) {
                    const errorText = new XmlObject(
                        'text',
                        {
                            x: fX(entry.XA),
                            y: fY(entry.YA),
                            'font-size': `${DrawingOptions.DrawingAnnotationFontSize}px`,
                            'font-family': DrawingOptions.DrawingAnnotationFontFamily,
                            'text-anchor': 'middle',
                            fill: DrawingOptions.DrawingColorFillError,
                            'vector-effect': 'non-scaling-stroke',
                        },
                        [
                            entry.ToolFeatureDescription,
                            entry.Error,
                        ]
                    );

                    this.svg.push(errorText);
                }
                if (entry.ToolFeatureDescription === FeatureType.DRILL_VERTICAL) {
                    this.svg.push(new XmlObject('circle', {
                        cx: fX(entry.XA),
                        cy: fY(entry.YA),
                        r: entry.DU / 2,
                        fill: DrawingOptions.DrawingColorFillDrillVertical,
                        stroke: DrawingOptions.DrawingColorStrokeFeature,
                        'stroke-width': DrawingOptions.DrawingFeatureStrokeWidth,
                        'vector-effect': 'non-scaling-stroke',
                    }));
                }
                else if (entry.ToolFeatureDescription === FeatureType.DRILL_HORIZONTAL) {
                    let x, y, rw, rh, rx, ry: number;
                    x = fX(entry.XA);
                    y = fY(entry.YA);
                    switch (entry.BM) {
                        case 'XP': // from left (x plus)
                            rw = entry.TI;
                            rh = entry.DU;
                            rx = x;
                            ry = y - rh / 2;
                            break;
                        case 'XM': // from right (x minus)
                            rw = entry.TI;
                            rh = entry.DU;
                            rx = x - rw;
                            ry = y - rh / 2;
                            break;
                        case 'YP': // from top (y plus)
                            rw = entry.DU;
                            rh = entry.TI;
                            rx = x - rw / 2;
                            ry = y - rh;
                            break;
                        case 'YM': // from bottom (y minus)
                            rw = entry.DU;
                            rh = entry.TI;
                            rx = x - rw / 2;
                            ry = y;
                            break;
                        default:
                            throw (new Error(`Unknown BM: ${entry.BM}`));
                    }
                    this.svg.push(new XmlObject('rect', {
                        x: rx,
                        y: ry,
                        width: rw,
                        height: rh,
                        fill: DrawingOptions.DrawingColorFillDrillHorizontal,
                        stroke: DrawingOptions.DrawingColorStrokeFeature,
                        'stroke-width': DrawingOptions.DrawingFeatureStrokeWidth,
                        'vector-effect': 'non-scaling-stroke',
                    }));
                }
                else if (entry.ToolFeatureDescription === FeatureType.GROOVE) {

                    const C = this.lineSegmentFromOutsideToInside(fX(entry.XA), fY(entry.YA), fX(entry.XE), fY(entry.YE));
                    const XA = C.xa;
                    const YA = C.ya;
                    const XE = C.xe;
                    const YE = C.ye;

                    const grooveLine = new XmlObject(
                        'line',
                        {
                            x1: XA,
                            y1: YA,
                            x2: XE,
                            y2: YE,
                            //stroke: ncData.SIDE_Color,
                            stroke: 'red',
                            'stroke-width': 2,
                            'marker-end': 'url(#arrEnd)',
                            'vector-effect': 'non-scaling-stroke',
                        },
                    );

                    const angle = Math.atan2(YE - YA, XE - XA) * 180 / Math.PI;
                    const azimuth = angle < 0 ? angle + 360 : angle;
                    const length = Math.sqrt(Math.pow(XE - XA, 2) + Math.pow(YE - YA, 2));

                    const grooveRect = new XmlObject(
                        'rect',
                        {
                            fill: DrawingOptions.DrawingColorFillGroove,
                            x: `0`,
                            y: `0`,
                            width: length,
                            height: entry.NB,
                            stroke: DrawingOptions.DrawingColorStrokeFeature,
                            'stroke-width': 1,
                            transform:
                                (
                                    (entry.RK === 'WRKL' && this.viewType === ViewType.TOP)
                                    || (entry.RK === 'WRKR' && this.viewType === ViewType.BOTTOM)
                                )
                                    ? `translate(${XE}, ${YE}) rotate(${180 + azimuth})`
                                    : `translate(${XA}, ${YA}) rotate(${azimuth})`,
                            'vector-effect': 'non-scaling-stroke',
                        },
                    );
                    this.svg.push(grooveRect);
                    //this.svg.push(grooveLine);
                }
                else if (entry.ToolFeatureDescription === FeatureType.POCKET) {
                    const rw = entry.LA;
                    const rh = entry.TI;
                    const x = fX(entry.XA);
                    const y = fY(entry.YA + rh / 2);
                    const rx = x - rw / 2;
                    const ry = y - rh / 2;
                    this.svg.push(new XmlObject('rect', {
                        x: rx,
                        y: ry,
                        width: rw,
                        height: rh,
                        fill: DrawingOptions.DrawingColorFillPocket,
                        stroke: DrawingOptions.DrawingColorStrokeFeature,
                        'stroke-width': DrawingOptions.DrawingFeatureStrokeWidth,
                        'vector-effect': 'non-scaling-stroke',
                    }));
                }
            });
        }

        /** Debug - red cross at place of all annotated points */
        drawAnnotatedPoints() {
            this.annotatedPoints.forEach((point: AnnotatedPoint) => {
                // debug: draw a cross at the point location
                const crossSize = 5;
                this.svg.push(new XmlObject('g', {}, [
                    new XmlObject('line', {
                        x1: point.x - crossSize,
                        y1: point.y - crossSize,
                        x2: point.x + crossSize,
                        y2: point.y + crossSize,
                        stroke: 'red',
                        'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                        'vector-effect': 'non-scaling-stroke',
                    }),
                    new XmlObject('line', {
                        x1: point.x + crossSize,
                        y1: point.y - crossSize,
                        x2: point.x - crossSize,
                        y2: point.y + crossSize,
                        stroke: 'red',
                        'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                        'vector-effect': 'non-scaling-stroke',
                    }),
                ]));
            });
        }

        /** Dashed lines */
        drawReferenceLines() {
            this.referenceLinesVerticalXCoordinates = Array.from(new Set(this.annotatedPoints.map((point: AnnotatedPoint) => point.x))).sort((a, b) => a - b);
            this.referenceLinesHorizontalYCoordinates = Array.from(new Set(this.annotatedPoints.map((point: AnnotatedPoint) => point.y))).sort((a, b) => a - b);

            const referenceLines = new XmlObject('g', {}, []);
            this.referenceLinesVerticalXCoordinates.forEach((x: number) => {
                referenceLines.push(new XmlObject('line', {
                    x1: x,
                    y1: 0,
                    x2: x,
                    y2: this.part._depth,
                    stroke: DrawingOptions.DrawingColorStrokeDashedReferenceLine,
                    'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                    'vector-effect': 'non-scaling-stroke',
                    // dash
                    'stroke-dasharray': `${DrawingOptions.DrawingAnnotationReferenceLineDashLength},${DrawingOptions.DrawingAnnotationReferenceLineDashLength}`,
                    'stroke-dashoffset': x,
                }));
            });
            this.referenceLinesHorizontalYCoordinates.forEach((y: number) => {
                referenceLines.push(new XmlObject('line', {
                    x1: 0,
                    y1: y,
                    x2: this.part._width,
                    y2: y,
                    stroke: DrawingOptions.DrawingColorStrokeDashedReferenceLine,
                    'stroke-width': DrawingOptions.DrawingAnnotationStrokeWidth,
                    'vector-effect': 'non-scaling-stroke',
                    // dash
                    'stroke-dasharray': `${DrawingOptions.DrawingAnnotationReferenceLineDashLength},${DrawingOptions.DrawingAnnotationReferenceLineDashLength}`,
                    'stroke-dashoffset': y,
                }));
            });
            this.svg.push(referenceLines);

        }

        /** Evaluate what annotation lines we have and if they are on top, bottom, left or right */
        evaluateAnnotations() {
            const arrayEqual = (a: number[], b: number[]): boolean => {
                if (a.length !== b.length) return false;
                for (let i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) return false;
                }
                return true;
            }

            const horizontalAnnotations: AnnotationLine[] = [];
            const verticalAnnotations: AnnotationLine[] = [];

            horizontalAnnotations.push(new AnnotationLine([0, this.part._width], this.part._depth, FeatureType.PART));
            verticalAnnotations.push(new AnnotationLine([0, this.part._depth], this.part._width, FeatureType.PART));

            [
                FeatureType.POCKET,
                FeatureType.GROOVE,
                FeatureType.DRILL_HORIZONTAL,
                FeatureType.DRILL_VERTICAL,
            ].forEach((filteringFeatureType: FeatureType) => {

                this.referenceLinesHorizontalYCoordinates.forEach((y: number) => {

                    const annotationPointsAtTheCoordinate = Array.from(new Set(this.annotatedPoints.filter((point: AnnotatedPoint) => point.y === y && point.type === filteringFeatureType).map((point: AnnotatedPoint) => point.x).sort((a: number, b: number) => a - b)));
                    if (annotationPointsAtTheCoordinate[0] !== 0) {
                        annotationPointsAtTheCoordinate.unshift(0);
                    }
                    if (annotationPointsAtTheCoordinate[annotationPointsAtTheCoordinate.length - 1] !== this.part._width) {
                        annotationPointsAtTheCoordinate.push(this.part._width);
                    }

                    const existing = horizontalAnnotations.find((annotation: AnnotationLine) => {
                        return arrayEqual(annotation.segments, annotationPointsAtTheCoordinate);
                    });
                    if (!existing) {
                        horizontalAnnotations.push(new AnnotationLine(annotationPointsAtTheCoordinate, y, filteringFeatureType));
                    }
                });

                this.referenceLinesVerticalXCoordinates.forEach((x: number) => {
                    const annotationPointsAtTheCoordinate = Array.from(new Set(this.annotatedPoints.filter((point: AnnotatedPoint) => point.x === x && point.type === filteringFeatureType).map((point: AnnotatedPoint) => point.y).sort((a: number, b: number) => a - b)));
                    if (annotationPointsAtTheCoordinate[0] !== 0) {
                        annotationPointsAtTheCoordinate.unshift(0);
                    }
                    if (annotationPointsAtTheCoordinate[annotationPointsAtTheCoordinate.length - 1] !== this.part._depth) {
                        annotationPointsAtTheCoordinate.push(this.part._depth);
                    }
                    const existing = verticalAnnotations.find((annotation: AnnotationLine) => {
                        return arrayEqual(annotation.segments, annotationPointsAtTheCoordinate);
                    });
                    if (!existing) {
                        verticalAnnotations.push(new AnnotationLine(annotationPointsAtTheCoordinate, x, filteringFeatureType));
                    }
                });
            });

            const annotationSort = (a: AnnotationLine, b: AnnotationLine) => {
                if (a.featureType === b.featureType) {
                    return a.referenceCoordinate - b.referenceCoordinate;
                }
                else {
                    const featureTypeSort = [
                        FeatureType.POCKET,
                        FeatureType.GROOVE,
                        FeatureType.DRILL_HORIZONTAL,
                        FeatureType.DRILL_VERTICAL,
                        FeatureType.PART,
                    ];
                    const aIndex = featureTypeSort.indexOf(a.featureType);
                    const bIndex = featureTypeSort.indexOf(b.featureType);
                    return aIndex - bIndex;
                }
            };

            horizontalAnnotations.sort(annotationSort);
            verticalAnnotations.sort(annotationSort);

            this.annotations.left = verticalAnnotations.filter((annotation: AnnotationLine) => annotation.referenceCoordinate < this.part._width / 2);
            this.annotations.right = verticalAnnotations.filter((annotation: AnnotationLine) => annotation.referenceCoordinate >= this.part._width / 2);
            this.annotations.top = horizontalAnnotations.filter((annotation: AnnotationLine) => annotation.referenceCoordinate < this.part._depth / 2);
            this.annotations.bottom = horizontalAnnotations.filter((annotation: AnnotationLine) => annotation.referenceCoordinate >= this.part._depth / 2);

        }

        /** Convert the evaluated annotations to SVG. This step should be done after finding a position for the drawing based on the evaluated annotations. */
        getAnnotationsSvg(x: number, y: number, zoom: number): XmlObject {
            // this is called with origin in bottom left corner of the part view
            const parentGroup = new XmlObject('g', {}, []);

            const annotationsSvgLeft: XmlObject[] = [];
            for (let i = 0; i < this.annotations.left.length; i++) {
                const annotation = this.annotations.left[i].toSvg(
                    x - DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines * i - DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing,
                    y,
                    zoom,
                    this.viewType === 'TOP' ? 'vertical-topview' : 'vertical-bottomview',
                    'down',
                    i === 0 ? DrawingOptions.DrawingAnnotationFirstAnnotationDistance : 0,
                );
                annotationsSvgLeft.push(annotation);
            }
            annotationsSvgLeft.sort((a: XmlObject, b: XmlObject) => a.metadata.x - b.metadata.x);
            parentGroup.push(annotationsSvgLeft);


            const annotationsSvgRight: XmlObject[] = [];
            for (let i = 0; i < this.annotations.right.length; i++) {
                const annotation = this.annotations.right[i].toSvg(
                    x + this.part._width * zoom + DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines * i + DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing,
                    y,
                    zoom,
                    this.viewType === 'TOP' ? 'vertical-topview' : 'vertical-bottomview',
                    'up',
                    i === 0 ? DrawingOptions.DrawingAnnotationFirstAnnotationDistance : 0,
                );
                annotationsSvgRight.push(annotation);
            }
            annotationsSvgRight.sort((a: XmlObject, b: XmlObject) => b.metadata.x - a.metadata.x);
            parentGroup.push(annotationsSvgRight);

            const annotationsSvgTop: XmlObject[] = [];
            for (let i = 0; i < this.annotations.top.length; i++) {
                const annotation = this.annotations.top[i].toSvg(
                    x,
                    y - this.part._depth * zoom - DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines * i - DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing,
                    zoom,
                    'horizontal',
                    'down',
                    i === 0 ? DrawingOptions.DrawingAnnotationFirstAnnotationDistance : 0,
                );
                annotationsSvgTop.push(annotation);
            }
            annotationsSvgTop.sort((a: XmlObject, b: XmlObject) => a.metadata.y - b.metadata.y);
            parentGroup.push(annotationsSvgTop);

            const annotationsSvgBottom: XmlObject[] = [];
            for (let i = 0; i < this.annotations.bottom.length; i++) {
                const annotation = this.annotations.bottom[i].toSvg(
                    x,
                    y + DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines * i + DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing,
                    zoom,
                    'horizontal',
                    'up',
                    i === 0 ? DrawingOptions.DrawingAnnotationFirstAnnotationDistance : 0,
                );
                annotationsSvgBottom.push(annotation);
            }
            annotationsSvgBottom.sort((a: XmlObject, b: XmlObject) => a.metadata.y - b.metadata.y);
            parentGroup.push(annotationsSvgBottom);

            return parentGroup;
        }

        getBoundingBox(): BoundingBox {
            const xValues = this.annotatedPoints.map((point: AnnotatedPoint) => point.x);
            const yValues = this.annotatedPoints.map((point: AnnotatedPoint) => point.y);
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            const minY = Math.min(...yValues);
            const maxY = Math.max(...yValues);
            return new BoundingBox(minX, minY, maxX - minX, maxY - minY,
                {
                    left: (this.annotations.left.length * DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines) + (this.annotations.left.length > 0 ? DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing : 0),
                    right: (this.annotations.right.length * DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines) + (this.annotations.right.length > 0 ? DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing : 0),
                    top: (this.annotations.top.length * DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines) + (this.annotations.top.length > 0 ? DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing : 0),
                    bottom: (this.annotations.bottom.length * DrawingOptions.DrawingAnnotationDistanceBetweenAnnotationLines) + (this.annotations.bottom.length > 0 ? DrawingOptions.DrawingAnnotationDistanceOfFirstAnnotationFromDrawing : 0),
                }

            );
        }
    }

    class DrawingTable {
        ncData: NcData[] = [];
        tableHeader: string;
        valuesHeader: Map<string, string>;
        boundingBox: BoundingBox;
        svg: XmlObject = new XmlObject('g', {}, []);

        constructor(featureType: FeatureType, ncData: NcData[]) {
            this.ncData = ncData.filter((entry: NcData) => entry.ToolFeatureDescription === featureType);
            const headerEntry = DrawingOptions.TABLES_HEADER.get(featureType)!;
            // pop first element from the header entry
            this.tableHeader = headerEntry.get('$HEADER')!;
            this.valuesHeader = new Map<string, string>();
            headerEntry.forEach((value: string, key: string) => {
                if (key !== '$HEADER') {
                    this.valuesHeader.set(key, value);
                }
            });
            this.svg = new XmlObject('g', {}, []);
            this.createSvg();
            const tableFrame = this.svg.deepFind('TableFrame', 'id')!;
            this.boundingBox = new BoundingBox(
                parseFloat(tableFrame.attributes.x),
                parseFloat(tableFrame.attributes.y),
                parseFloat(tableFrame.attributes.width),
                parseFloat(tableFrame.attributes.height),
            );
        }

        createSvg() {
            const headerKeys: string[] = Array.from(this.valuesHeader.keys());
            const rowsAndColumnsContent: Map<string, string>[] = [];

            // push the header
            const headerRow: Map<string, string> = new Map<string, string>();
            headerKeys.forEach((key: string) => {
                headerRow.set(key, this.valuesHeader.get(key)!);
            });
            rowsAndColumnsContent.push(headerRow);

            // convert and push the nc data
            this.ncData.forEach((entry: NcData) => {
                const row: Map<string, string> = new Map<string, string>();
                headerKeys.forEach((key: string) => {
                    let value = entry[key as keyof NcData]!;
                    if (typeof value === 'number') {
                        value = lengthToString(value);
                    }
                    row.set(key, value.toString());
                });
                rowsAndColumnsContent.push(row);
            });

            // store maximum widths of every column
            const columnWidthsMap: Map<string, number> = new Map<string, number>();
            headerKeys.forEach((key: string) => {
                columnWidthsMap.set(key, 0);
            });
            rowsAndColumnsContent.forEach((row: Map<string, string>) => {
                row.forEach((value: string, key: string) => {
                    const widthInColumn = estimateTextLength(value);
                    const runningMax = columnWidthsMap.get(key)!;
                    if (widthInColumn > runningMax) {
                        columnWidthsMap.set(key, widthInColumn);
                    }
                });
            });
            const columnWidthsArr = Array.from(columnWidthsMap.values()).map((width: number) => Math.ceil(width / DrawingOptions.DrawingTableMarginHorizontal) * DrawingOptions.DrawingTableMarginHorizontal);
            // cumulative sum of the column widths where the last one is added by half
            let x = columnWidthsArr[0] / 2;
            const columnTextX: number[] = [x];
            for (let i = 1; i < columnWidthsArr.length; i++) {
                x += columnWidthsArr[i];
                columnTextX.push(x);
            }

            const tableWidth = columnWidthsArr.reduce((a: number, b: number) => a + b, 0);
            const rowHeight = DrawingOptions.DrawingAnnotationFontSize + 2 * DrawingOptions.DrawingTableMarginVertical;
            const tableHeight = (
                + 1 // table header
                + 1 // columns header
                + this.ncData.length
            ) * rowHeight;


            // table frame
            this.svg.push(new XmlObject('rect', {
                id: 'TableFrame',
                x: 0,
                y: 0,
                width: tableWidth,
                height: tableHeight,
                fill: DrawingOptions.DrawingCanvasBackgroundColor,
                stroke: DrawingOptions.DrawingColorStrokeAnnotation,
                'stroke-width': DrawingOptions.DrawingTableStrokeWidth,
                'vector-effect': 'non-scaling-stroke',
            }));
            // header row undercolor
            this.svg.push(new XmlObject('rect', {
                x: DrawingOptions.DrawingTableStrokeWidth,
                y: DrawingOptions.DrawingTableStrokeWidth,
                width: tableWidth - 2 * DrawingOptions.DrawingTableStrokeWidth,
                height: rowHeight * 2 - 2 * DrawingOptions.DrawingTableStrokeWidth,
                fill: DrawingOptions.DrawingTableColorHeaderFill,
                // without stroke
                stroke: 'none',
                'vector-effect': 'non-scaling-stroke',
            }));
            // row lines
            for (let r = 1; r < 3; r++) {
                this.svg.push(new XmlObject('line', {
                    x1: 0,
                    y1: r * rowHeight,
                    x2: tableWidth,
                    y2: r * rowHeight,
                    stroke: DrawingOptions.DrawingColorStrokeAnnotation,
                    'stroke-width': DrawingOptions.DrawingTableStrokeWidth,
                    'vector-effect': 'non-scaling-stroke',
                }));
            }
            // row fill undercolor
            for (let r = 3; r < rowsAndColumnsContent.length + 1; r = r + 2) {
                this.svg.push(new XmlObject('rect', {
                    x: DrawingOptions.DrawingTableStrokeWidth,
                    y: DrawingOptions.DrawingTableStrokeWidth + r * rowHeight,
                    width: tableWidth - 2 * DrawingOptions.DrawingTableStrokeWidth,
                    height: rowHeight - 2 * DrawingOptions.DrawingTableStrokeWidth,
                    fill: DrawingOptions.DrawingTableColorHeaderFill,
                    // without stroke
                    stroke: 'none',
                    'vector-effect': 'non-scaling-stroke',
                }));
            }
            // column lines
            for (let c = 0; c < columnWidthsArr.length - 1; c++) {
                this.svg.push(new XmlObject('line', {
                    x1: columnWidthsArr.slice(0, c + 1).reduce((a: number, b: number) => a + b, 0),
                    y1: rowHeight,
                    x2: columnWidthsArr.slice(0, c + 1).reduce((a: number, b: number) => a + b, 0),
                    y2: tableHeight,
                    stroke: DrawingOptions.DrawingColorStrokeAnnotation,
                    'stroke-width': DrawingOptions.DrawingTableStrokeWidth,
                    'vector-effect': 'non-scaling-stroke',
                }));
            }
            // header
            this.svg.push(new XmlObject('text', {
                x: tableWidth / 2,
                y: DrawingOptions.DrawingTableMarginVertical,
                fill: DrawingOptions.DrawingColorStrokeAnnotation,
                'font-size': DrawingOptions.DrawingAnnotationFontSize,
                'font-family': DrawingOptions.DrawingAnnotationFontFamily,
                'text-anchor': 'middle',
                'dominant-baseline': 'hanging',
                'font-weight': 'bold',
                'vector-effect': 'non-scaling-stroke',
            }, [this.tableHeader]));
            // values
            for (let r = 0; r < rowsAndColumnsContent.length; r++) {
                const row: Map<string, string> = rowsAndColumnsContent[r];
                const y = (r + 1) * rowHeight + DrawingOptions.DrawingTableMarginVertical;
                for (let c = 0; c < headerKeys.length; c++) {
                    const key: string = headerKeys[c];
                    const value: string = row.get(key)!;
                    const x = columnTextX[c];
                    this.svg.push(new XmlObject('text', {
                        x: x,
                        y: y,
                        fill: DrawingOptions.DrawingColorStrokeAnnotation,
                        'font-size': DrawingOptions.DrawingAnnotationFontSize,
                        'font-family': DrawingOptions.DrawingAnnotationFontFamily,
                        'text-anchor': 'middle',
                        'dominant-baseline': 'hanging',
                        'vector-effect': 'non-scaling-stroke',
                        // bold if first
                        'font-weight': r === 0 ? 'bold' : 'normal',
                    }, [value]));
                }
            }
        }

    }

    /**
     * Entry point of the drawing. This draws a part from the top and bottom views. 
     * This is consturcted of an object which is:
     * {
     *  part: the data of the part
     *  bomEntries: list of the BOM entries
     * }
    */
    class PartDrawing {
        part: any;
        ncData: NcData[] = [];
        svg: XmlObject;

        constructor(data: any) {
            this.part = data.part;
            const allEntriesAsNcData = NcData
                .fromAny(data.bomEntries, this.part)
                // do not do anything that are groups or are to be skipped or unknown
                .filter((entry: NcData) => {
                    return entry.ToolFeatureDescription !== FeatureType.UNKNOWN && entry.ToolFeatureDescription !== FeatureType.SKIP;
                })
                // some are grouped, some are freely in the array -> sort them to be able to only take the unique ones
                .sort((a: NcData, b: NcData) => {
                    if (a.ToolFeatureDescription === b.ToolFeatureDescription) {
                        if (a.XA !== b.XA) {
                            return a.XA - b.XA;
                        }
                        else if (a.YA !== b.YA) {
                            return a.YA - b.YA;
                        }
                        else {
                            return a.TI + a.DU - (b.TI + b.DU);
                        }
                    }
                    else {
                        return a.ToolFeatureDescription.localeCompare(b.ToolFeatureDescription)
                    }
                });
            // take one after another from the sorted array and check if it already exists in the ncData array
            // combination of pop+unshift on the sorted array is faster because we should have the most similar ones at the end of the array
            while (allEntriesAsNcData.length > 0) {
                const entry = allEntriesAsNcData.pop()!;
                const alreadyExists = this.ncData.some((e: NcData) => e.isEqual(entry));
                if (!alreadyExists) {
                    this.ncData.unshift(entry);
                }
            }

            this.svg = XmlObject.CreateSvgHeader();

            const views = {
                'TOP': new PartDrawingView({ viewType: ViewType.TOP, ncData: this.ncData, part: this.part }),
                'BOTTOM': new PartDrawingView({ viewType: ViewType.BOTTOM, ncData: this.ncData, part: this.part }),
            };


            // draw the two views in the same svg
            // draw only the view that has some features
            // if both views have features, draw the top view only
            const displayedDrawings: PartDrawingView[] = [];
            if (views.BOTTOM.ncData.length > 0) {
                displayedDrawings.unshift(views.BOTTOM);
            }
            if (views.TOP.ncData.length > 0 || displayedDrawings.length === 0) {
                displayedDrawings.unshift(views.TOP);
            }

            let maxDrawingWidth = 0
            let maxDrawingHeight = 0;
            let maxAnnotationsLeftWidth = 0;
            let maxAnnotationsRightWidth = 0;

            const tables = new Map<FeatureType, DrawingTable>();
            [
                FeatureType.DRILL_HORIZONTAL,
                FeatureType.DRILL_VERTICAL,
                FeatureType.POCKET,
                FeatureType.GROOVE,
            ].forEach((featureType: FeatureType) => tables.set(featureType, new DrawingTable(featureType, this.ncData)));




            displayedDrawings.forEach((view: PartDrawingView) => {
                this.svg.push(view.svg);
                const boundingBox = view.boundingBox;
                maxDrawingWidth = Math.max(maxDrawingWidth, boundingBox.w);
                maxDrawingHeight = Math.max(maxDrawingHeight, boundingBox.h);
                maxAnnotationsLeftWidth = Math.max(maxAnnotationsLeftWidth, boundingBox.annotations.left);
                maxAnnotationsRightWidth = Math.max(maxAnnotationsRightWidth, boundingBox.annotations.right);
            });
            let zoom = (DrawingOptions.DrawingCanvasWidth - 2 * DrawingOptions.DrawingCanvasMargin - maxAnnotationsLeftWidth - maxAnnotationsRightWidth) / (maxDrawingWidth);
            if (zoom > DrawingOptions.DrawingCanvasMaxZoom) {
                zoom = DrawingOptions.DrawingCanvasMaxZoom;
            }

            const drawingsPositionX = DrawingOptions.DrawingCanvasWidth / 2 - (maxDrawingWidth * zoom) / 2 + maxAnnotationsLeftWidth / 2 - maxAnnotationsRightWidth / 2;
            let drawingsPositionY = DrawingOptions.DrawingCanvasMargin;
            displayedDrawings.forEach((view: PartDrawingView) => {
                drawingsPositionY += view.boundingBox.annotations.top;
                view.svg.attributes.transform = `translate(${drawingsPositionX}, ${drawingsPositionY}) scale(${zoom})`;
                const drawingHeightZoomed = view.boundingBox.h * zoom;
                this.svg.push(view.getAnnotationsSvg(drawingsPositionX, drawingsPositionY + drawingHeightZoomed, zoom));
                drawingsPositionY += drawingHeightZoomed + view.boundingBox.annotations.bottom + DrawingOptions.DrawingCanvasMargin;
            });

            // draw the tables
            tables.forEach((table: DrawingTable) => {
                if (table.ncData.length > 0) {
                    const tableX = DrawingOptions.DrawingCanvasWidth / 2 - table.boundingBox.w / 2;
                    const tableY = drawingsPositionY;
                    table.svg.attributes.transform = `translate(${tableX}, ${tableY})`;
                    this.svg.push(table.svg);
                    drawingsPositionY += table.boundingBox.h + DrawingOptions.DrawingCanvasMargin;
                }
            });

            this.svg.attributes.height = drawingsPositionY;

            this.svg.push([

                // rect drawing size
                new XmlObject('rect', {
                    x: 0,
                    y: 0,
                    width: this.svg.attributes.width,
                    height: this.svg.attributes.height,
                    fill: DrawingOptions.DrawingCanvasBackgroundColor,
                    stroke: DrawingOptions.DrawingCanvasEdgeColor,
                    'stroke-width': '1',
                    'vector-effect': 'non-scaling-stroke',
                }),
            ], true);

        }


    }

    const SetDrawingOptions = (source: any) => {
        const drawingOptionsKeys = Object.keys(DrawingOptions);
        for (const sourceKey in source) {
            console.log('SetDrawingOptions', sourceKey, source[sourceKey]);
            let key = sourceKey as string;
            if (key.startsWith('_basic_')) {
                key = key.substring(7);
            }
            if (drawingOptionsKeys.includes(key)) {
                (DrawingOptions as any)[key] = source[sourceKey];
            }
        }
    }

    return {
        PartDrawing,
        SetDrawingOptions,
    }

}