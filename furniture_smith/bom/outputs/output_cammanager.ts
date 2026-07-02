
  // Schuler Consulting
  // Create: March 2026
  // By: Ludwig Weber
  //
  // Purpose: Create JSON export (Order/Article/AssemblyPart/Part/...)
  // ===================================================

  // ===================================================
  // Types (matching the document structure) :contentReference[oaicite:2]{index=2}
  // ===================================================

  type AttributeTyp = "String" | "Int" | "Decimal" | "Date" | "DateTime";
  type SegmentTyp = "Line" | "Arc";
  type ArcTyp = "undefined" | "Clockwise" | "CounterClockwise";
  type ContourType = "OutSide" | "InSide";
  type EdgeTransition = "Short" | "Long";
  type InsertPoint = "Left" | "Middle" | "Right";

  // Minimal PartTyp mapping (extend as needed)
  type PartTyp =
    | "LeftSide"
    | "RightSide"
    | "BackPanel"
    | "TopShelf"
    | "BottomShelf"
    | "Front"
    | "Shelf";

  interface Attribute {
    Name: string;
    Typ: AttributeTyp;
    Value: string;
  }

  interface Segment {
    StartX: number;
    StartY: number;
    StartZ: number;
    EndX: number;
    EndY: number;
    EndZ: number;
    Radius: number;
    SegmentTyp: SegmentTyp;
    ArcTyp: ArcTyp;
  }

  interface Contour {
    PosX: number;
    PosY: number;
    PosZ: number;
    Segments: Segment[];
  }

  interface Edge {
    Number: number;
    Thickness: number;
    Oversize: number;
    Name: string;
    EdgeTransition: EdgeTransition;
    Contour: Contour;
  }

  interface Exclude {
    StartPosX: number;
    StartPosY: number;
    StartPosZ: number;
    EndPosX: number;
    EndPosY: number;
    EndPosZ: number;
  }

  // Operations (minimal placeholders; extend when you map real CAM data)
  interface Mill {
    OperationType: string;
    ZPosition: number;
    Angle: number;
    ContoureType: ContourType;
    ProcessingDirection: string;
    Attributes: Attribute[];
    Conture: Contour;
  }
  interface Drill {
    OperationType: string;
    Diameter: number;
    Depth: number;
    OrX: number;
    OrY: number;
    OrZ: number;
    ProcessingDirection: string;
    PosX: number;
    PosY: number;
    PosZ: number;
    Attributes: Attribute[];
  }
  interface Groove {
    OperationType: string;
    Width: number;
    Depth: number;
    OrX: number;
    OrY: number;
    OrZ: number;
    StartPosX: number;
    StartPosY: number;
    EndPosX: number;
    EndPosY: number;
    ProcessingDirection: string;
    ZPos: number;
    InsertPoint: InsertPoint;
    Attributes: Attribute[];
  }
  interface Pocket {
    OperationType: string;
    Length: number;
    Width: number;
    Depth: number;
    CornerRadius: number;
    OrX: number;
    OrY: number;
    OrZ: number;
    ProcessingDirection: string;
    PosX: number;
    PosY: number;
    PosZ: number;
    Attributes: Attribute[];
  }
  interface Saw {
    OperationType: string;
    OrX: number;
    OrY: number;
    OrZ: number;
    StartPosX: number;
    StartPosY: number;
    EndPosX: number;
    EndPosY: number;
    PosZ: number;
    InsertPoint: InsertPoint;
    Attributes: Attribute[];
  }
  interface ComponentOp {
    OperationType: string;
    OrX: number;
    OrY: number;
    OrZ: number;
    PosX: number;
    PosY: number;
    PosZ: number;
    ProcessingDirection: string;
    Attributes: Attribute[];
    Exclude?: Exclude;
  }

  type Operation = Mill | Drill | Groove | Pocket | Saw | ComponentOp;

  interface Workgroup {
    Typ: number;
    Name: string;
    Operations: Operation[];
    Attributes: Attribute[];
  }

  interface Part {
    ID: number;
    Typ: PartTyp;
    Description: string;

    XDim: number;
    YDim: number;
    ZDim: number;

    XDimbase?: number;
    YDimbase?: number;
    ZDimbase?: number;

    OrX: number;
    OrY: number;
    OrZ: number;

    PosX: number;
    PosY: number;
    PosZ: number;

    Attributes: Attribute[];
    Edges: Edge[];

    Partcontour: Contour;
    PartBasicContour: Contour;

    Workgroups: Workgroup[];
    Excludes: Exclude[];
  }

  interface AssemblyPart {
    ID: number;

    XDim: number;
    YDim: number;
    ZDim: number;

    OrX: number;
    OrY: number;
    OrZ: number;

    PosX: number;
    PosY: number;
    PosZ: number;

    Attributes: Attribute[];
    Parts: Part[];
  }

  interface Article {
    ID: number;

    XDim: number;
    YDim: number;
    ZDim: number;

    OrX: number;
    OrY: number;
    OrZ: number;

    PosX: number;
    PosY: number;
    PosZ: number;

    Attributes: Attribute[];
    AssemblyParts: AssemblyPart[];
    Workgroups: Workgroup[];
  }

  interface Order {
    Attributes: Attribute[];
    Articles: Article[];
  }

  interface OrderRoot {
    Order: Order;
  }

  // ===================================================
  // Helpers
  // ===================================================

  function safeStr(v: any): string {
    if (v === undefined || v === null) return "";
    return String(v);
  }

  function attr(name: string, value: any, typ: AttributeTyp = "String"): Attribute {
    return { Name: name, Typ: typ, Value: safeStr(value) };
  }

  function toNumber(v: any, fallback = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function formatDate(value?: string | Date | null, fallbackDays = 30): string {

    // fallback date
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + fallbackDays);

    if (!value) return fallback.toISOString();

    let d: Date;

    if (value instanceof Date) {
      d = value;
    } else if (typeof value === "string") {
      // remove timezone text like "(UTC+1)" or "(Central Europe Standard Time)"
      const cleaned = value.replace(/\s*\(.*?\)/g, "");
      d = new Date(cleaned);
    } else {
      return fallback.toISOString();
    }

    if (isNaN(d.getTime())) {
      return fallback.toISOString();
    }

    return d.toISOString();
  }

  /**
   * Draft rectangle contour in "Bearbeitungslage":
   * Origin bottom-left, rectangle of (xDim, yDim), Z=0.
   */
  function makeRectContour(xDim: number, yDim: number): Contour {
    const x = Math.max(0, xDim);
    const y = Math.max(0, yDim);
    return {
      PosX: 0,
      PosY: 0,
      PosZ: 0,
      Segments: [
        { StartX: 0, StartY: 0, StartZ: 0, EndX: x, EndY: 0, EndZ: 0, Radius: 0, SegmentTyp: "Line", ArcTyp: "undefined" },
        { StartX: x, StartY: 0, StartZ: 0, EndX: x, EndY: y, EndZ: 0, Radius: 0, SegmentTyp: "Line", ArcTyp: "undefined" },
        { StartX: x, StartY: y, StartZ: 0, EndX: 0, EndY: y, EndZ: 0, Radius: 0, SegmentTyp: "Line", ArcTyp: "undefined" },
        { StartX: 0, StartY: y, StartZ: 0, EndX: 0, EndY: 0, EndZ: 0, Radius: 0, SegmentTyp: "Line", ArcTyp: "undefined" },
      ],
    };
  }

  /**
   * Draft edge contours (each edge as a single line segment).
   * Numbering is a draft: 1..4.
   * IMPORTANT: If your "front/back/left/right" meaning differs, adjust mapping.
   */
  function makeEdgesForRect(xDim: number, yDim: number, k: any): Edge[] {
    const x = Math.max(0, xDim);
    const y = Math.max(0, yDim);

    const edgeThickness = 1; // unknown -> default
    const oversize = 0;

    const mkEdgeContour = (sx: number, sy: number, ex: number, ey: number): Contour => ({
      PosX: sx,
      PosY: sy,
      PosZ: 0,
      Segments: [{
        StartX: sx, StartY: sy, StartZ: 0,
        EndX: ex, EndY: ey, EndZ: 0,
        Radius: 0,
        SegmentTyp: "Line",
        ArcTyp: "undefined",
      }]
    });

    // If no edge info present, return empty
    const hasAny = !!(k?.EdgeFront || k?.EdgeBack || k?.EdgeLeft || k?.EdgeRight);
    if (!hasAny) return [];

    // Draft mapping:
    // 1 = bottom (Front), 2 = right, 3 = top (Back), 4 = left
    const edges: Edge[] = [];

    if (k.EdgeFront) {
      edges.push({
        Number: 1,
        Thickness: edgeThickness,
        Oversize: oversize,
        Name: safeStr(k.EdgeFront),
        EdgeTransition: edgeTransitionForEdge(k, 1),
        Contour: mkEdgeContour(0, 0, x, 0),
      });
    }
    if (k.EdgeRight) {
      edges.push({
        Number: 2,
        Thickness: edgeThickness,
        Oversize: oversize,
        Name: safeStr(k.EdgeRight),
        EdgeTransition: edgeTransitionForEdge(k, 4),
        Contour: mkEdgeContour(x, 0, x, y),
      });
    }
    if (k.EdgeBack) {
      edges.push({
        Number: 3,
        Thickness: edgeThickness,
        Oversize: oversize,
        Name: safeStr(k.EdgeBack),
        EdgeTransition: edgeTransitionForEdge(k, 2),
        Contour: mkEdgeContour(x, y, 0, y),
      });
    }
    if (k.EdgeLeft) {
      edges.push({
        Number: 4,
        Thickness: edgeThickness,
        Oversize: oversize,
        Name: safeStr(k.EdgeLeft),
        EdgeTransition: edgeTransitionForEdge(k, 3),
        Contour: mkEdgeContour(0, y, 0, 0),
      });
    }

    return edges;
  }

  function edgeTransitionForEdge(k: any, edgeNumber: number): EdgeTransition {
    const raw = safeStr(k?.EdgeTransition);
    const parts = raw.split(":");

    const seg = parts[edgeNumber - 1];
    if (!seg || seg.length === 0) return "Short";

    const lastChar = seg[seg.length - 1];
    return lastChar === "0" ? "Short" : "Long";
  }

  /**
   * Draft PartTyp guessing.
   * If you have a reliable field in k (e.g. k.partType), map it here.
   */
  const PART_TYPE_MAP: Record<string, PartTyp> = {
    // sides
    part_sidepanelleft: "LeftSide",
    part_panelwoodframeleft: "LeftSide",

    part_sidepanelright: "RightSide",
    part_panelwoodframeright: "RightSide",

    // back
    part_backwall: "BackPanel",
    part_drawerbackwallwood: "BackPanel",

    // top
    part_shelftop: "TopShelf",
    part_paneltop: "TopShelf",
    part_slopedceilingshelftopangle: "TopShelf",
    part_slopedceilingshelftophor: "TopShelf",

    // bottom
    part_shelfbtm: "BottomShelf",
    part_drawershelfbtm: "BottomShelf",
    part_panelwoodframebtm: "BottomShelf",
    part_toekick: "BottomShelf",

    // front
    part_door: "Front",
    part_fixedfront: "Front",
    part_dishwasherpanel: "Front",
    part_baseunitfridgepanel: "Front",
    part_doorpanelwoodframe: "Front",
    part_fixedfrontpanelwoodframe: "Front",

    // shelves default
    part_shelfadjwood: "Shelf",
    part_shelfadjglass: "Shelf",
    part_shelffixed: "Shelf",
  };

  function guessPartTyp(k: any): PartTyp {
    const key = getPartIdFromBarcode(k).toLowerCase();

    if (PART_TYPE_MAP[key]) {
      return PART_TYPE_MAP[key];
    }

    // fallback heuristic if the part is unknown
    if (key.includes("left")) return "LeftSide";
    if (key.includes("right")) return "RightSide";
    if (key.includes("back")) return "BackPanel";
    if (key.includes("top")) return "TopShelf";
    if (key.includes("bottom")) return "BottomShelf";
    if (key.includes("front")) return "Front";

    return "Shelf";
  }

  function getPartIdFromBarcode(boardK: any): string {
    const bc = safeStr(boardK?.barcode);
    const idx = bc.lastIndexOf("_");
    if (idx <= 0) return bc;
    return bc.substring(0, idx);
  }

  /**
   * Draft read processings.
   * Prepare the workgroup
   */
  function fileEntryToString(fe: any): string {
    const c =
      (fe?.content ?? fe?._content ?? fe?.data ?? fe?.value ?? fe?.text);

    if (typeof c === "string") return c;
    try { return JSON.stringify(c); } catch { return String(c ?? ""); }
  }

  // ===================================================
  // Main builder
  // ===================================================

  function buildNewExchangeFormatOrder(oOutput: any, o: any, ol: any[], result: Map<string, any>): OrderRoot {

    // Create the order object
    const root: OrderRoot = {
      Order: {
        Attributes: [],
        Articles: []
      }
    };

    //--------------------------------------------------
    // Order level
    //--------------------------------------------------

    function addOrderAttr(name: string, value: any, typ: "String" | "Int" | "Decimal" | "Date" | "DateTime" = "String") {
      if (value === null || value === undefined || value === "") return;

      root.Order.Attributes.push({
        Name: name,
        Typ: typ,
        Value: String(value)
      });
    }

    // Core order data
    addOrderAttr("OrderName", o.orderNo);
    addOrderAttr("CustomerName", o.shopContact);
    addOrderAttr("CustomerNumber", o.posOrderDesc1);

    // Dates
    addOrderAttr("OrderDate", formatDate(new Date()), "DateTime");
    addOrderAttr("DeliveryDate", formatDate(o.posDeliveryDate), "DateTime");

    // Address
    addOrderAttr("AddressField1", "Herr / Frau");
    addOrderAttr("AddressField2", o.shopContact);
    addOrderAttr("AddressField3", o.shippingStreetNo);
    addOrderAttr("AddressField4", `${o.shippingZipCode ?? ""} ${o.shippingCity ?? ""}`.trim());

    // Optional technical data
    addOrderAttr("TargetProductionSite", o.targetProductionSite);
    addOrderAttr("ExternalOrderId", o.orderId ?? o.externalId);

    //--------------------------------------------------
    // Order lines
    //--------------------------------------------------

    // Here: we keep your traversal approach and map:
    // - Type "Partgroup" => AssemblyPart
    // - Type "Board" => Part (under current AssemblyPart)

    ol.forEach((p: any) => {
      // One Article per order line (first draft)

      const article: Article = {
        ID: p.orderLineId,
        XDim: toNumber(p?.XDim, 0),
        YDim: toNumber(p?.YDim, 0),
        ZDim: toNumber(p?.ZDim, 0),
        OrX: 0, OrY: 0, OrZ: 0,
        PosX: 0, PosY: 0, PosZ: 0,

        Attributes: [
          attr("Typ", "OrderItem"),
          attr("OrderItemNumber", p.posOrderLineNo, "Int"),
          attr("ArticleNumber", p.posArticleNo),
          attr("ArticleDescription", p.posArticleDesc),
          attr("Quantity", 1, "Int"),
          attr("QuantityUnit", "pcs"),
          attr("ExternalSystemId", p.orderLineId),
        ],
        AssemblyParts: [],
        Workgroups: [],
      };

      //--------------------------------------------------
      // Assemblyparts and parts
      //--------------------------------------------------

      // Create BOM output
      const bom: Map<string, any> = oOutput.createBomOutputCreate_Bom(p.bomEntries);

      // Create Processings (Workgroups/Operations JSON pro Part)
      const procOut: Map<string, BomOutputFileEntry> = oOutput.createBomOutputcreate_CamManagerProcessings(p.bomEntries);


      const findBomParent = (parent: string): any[] => {
        const r: any[] = [];
        bom.forEach((value: any, key: string) => {
          const k = JSON.parse(key);
          if (k.parent === parent) r.push(k);
        });
        return r;
      };

      // Track current AssemblyPart while traversing
      const assemblyById = new Map<string, AssemblyPart>();

      // Traverse up to 3 levels
      const rootNodes = findBomParent("Root");
      rootNodes.forEach((k0: any) => {
        insertK(k0);

        const ap0 = k0.Type === "Partgroup" ? ensureAssembly(k0) : undefined;

        const lvl1 = findBomParent(k0.id);
        lvl1.forEach((k1: any) => {
          insertK(k1, ap0);

          const ap1 = k1.Type === "Partgroup" ? ensureAssembly(k1) : ap0;

          const lvl2 = findBomParent(k1.id);
          lvl2.forEach((k2: any) => {
            insertK(k2, ap1);
          });
        });
      });

      // Push article to order
      root.Order.Articles.push(article);

      //--------------------------------------------------
      // Internal helpers for the order-lines
      //--------------------------------------------------

      // Main insertion helper
      function insertK(k: any, currentAssembly?: AssemblyPart) {

        // Assemblyparts (Partgroups)
        if (k.Type === "Partgroup") {
          ensureAssembly(k);
          return;
        }

        // Parts (Boards)
        // If Board without an explicit Partgroup in the tree, create a fallback assembly
        if (k.Type === "Board") {

          const ap =
            currentAssembly ??
            ensureAssembly({
              Type: "Partgroup",
              id: `AUTO_${safeStr(k.parent) || "ROOT"}`,
              Name: safeStr(k.parent) || "AutoAssembly",
              category: k.category,
              width: k.width,
              depth: k.depth,
              thickness: k.thickness,
            });

          addBoardToAssembly(k, ap);
        }
      }

      // Create an assemblypart
      function ensureAssembly(partgroupK: any): AssemblyPart {
        const idKey = safeStr(partgroupK.id);
        let ap = assemblyById.get(idKey);
        if (!ap) {
          ap = {
            ID: partgroupK.id,
            XDim: toNumber(partgroupK.width, 0),
            YDim: toNumber(partgroupK.depth, 0),
            ZDim: toNumber(partgroupK.thickness, 0),
            OrX: 0, OrY: 0, OrZ: 0,
            PosX: 0, PosY: 0, PosZ: 0,
            Attributes: [
              attr("Category", "Partgroup"),
              attr("Name", partgroupK.id),
              attr("Description", partgroupK.Name)
            ],
            Parts: [],
          };
          assemblyById.set(idKey, ap);
          article.AssemblyParts.push(ap);
        }
        return ap;
      }

      // Create a part
      function addBoardToAssembly(boardK: any, ap: AssemblyPart) {
        const finishLen = toNumber(boardK.width, 0);
        const finishWid = toNumber(boardK.depth, 0);
        const thick = toNumber(boardK.thickness, 0);

        const contour = makeRectContour(finishLen, finishWid);
        const edges = makeEdgesForRect(finishLen, finishWid, boardK);

        const procFileName = `${boardK.barcode}.processings.json`;
        let workgroups: Workgroup[] = [];

        if (procOut.has(procFileName)) {
          const fe = procOut.get(procFileName)!;
          const raw = String((fe as any).content ?? (fe as any)._content ?? "");
          const parsed = JSON.parse(raw);
          workgroups = parsed?.Workgroups ?? [];
        }

        const part: Part = {

          ID: boardK.barcode,
          Typ: guessPartTyp(boardK),
          Description: safeStr(boardK.Name),
          XDim: finishLen,
          YDim: finishWid,
          ZDim: thick,
          XDimbase: toNumber(boardK.cutLength, finishLen),
          YDimbase: toNumber(boardK.cutWidth, finishWid),
          ZDimbase: thick,
          OrX: 0, OrY: 0, OrZ: 0,
          PosX: 0, PosY: 0, PosZ: 0,

          Attributes: [
            attr("Type", boardK.Type),
            attr("Name", getPartIdFromBarcode(boardK)),
            attr("Description", boardK.Name),
            attr("Parent", boardK.parent),
            attr("Material", boardK.material),
            attr("Grain", boardK.grain),
            attr("ArticleGroup", boardK.ArticleGroup),
          ],
          Edges: edges,

          Partcontour: contour,
          PartBasicContour: contour,

          Workgroups: workgroups,
          Excludes: [],
        };

        ap.Parts.push(part);
      }
    });

    //--------------------------------------------------
    // Return the order-object
    //--------------------------------------------------

    return root;
  }

  // ===================================================
  // Export JSON file
  // ===================================================

  const exportObj = buildNewExchangeFormatOrder(this, o, ol, result);

  // Pretty JSON
  const jsonStr = JSON.stringify(exportObj, null, 2);

  // Create File
  this.createFileEntry(result, "camManager.json", jsonStr);