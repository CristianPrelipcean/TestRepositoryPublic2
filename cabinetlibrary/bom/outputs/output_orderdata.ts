
  // Purpose: OrderDetails output (JSON) for productionManager / OrderManager
  //
  // Description:
  // Migration of 'Output_ProductionManager' to the OrderDetails structure.
  // OrderManager calculates the configuration and stores the calculated BOM of each
  // ConfigurationPosition in its additional property '_bom' (serialized CalcBomResult).
  // For every such position this script creates the BOM items (Component / Part / Resource)
  // like the productionManager XML and adds them as production 'Position' with
  // 'externalSystemId' = configuration position id, which OrderManager uses to merge the
  // production data into the order. Nothing is created without flags.bom.
  // flags.partProcessings / flags.partDrawings additionally create the MPR files / part drawings.
  // Like the productionManager XML, the parts have no barcode: the LIB barcode is only unique
  // within one configuration and productionManager rejects duplicates, so it assigns the barcodes.
  // Generated files are referenced by AdditionalDataEntity.name; the service uploads them
  // and fills in the download URLs.
  //
  // Note: this is an interim solution. A future version will generate everything (BOM,
  // drawings, processings) directly from the OrderDetails, without the '_bom' property on
  // the configuration positions, and will use updated methods to create the drawings and
  // processings.
  //===================================================

  const bomPropertyName = "_bom";
  let positionCount = 0;
  let positionsWithBom = 0;

  // Read a property of the serialized C# data (PascalCase or camelCase)
  function pick(source: any, pascalName: string, camelName?: string): any {
    if (source === null || source === undefined) {
      return undefined;
    }
    const camel = camelName ?? pascalName.charAt(0).toLowerCase() + pascalName.slice(1);
    return source[pascalName] ?? source[camel];
  }

  function toBomType(origin: any): string {
    const value = String(origin ?? "").toLowerCase();
    if (value === "part" || value === "1" || value === "bom") return "BOM";
    if (value === "touch" || value === "2" || value === "nc") return "NC";
    return "";
  }

  // Convert a CalcBomPart into the structure used by the productionManager output (BomPart)
  function toBomPartJson(calcPart: any): any {
    const childParts: any[] = pick(calcPart, "ChildParts") ?? [];
    const bomEntries: any[] = pick(calcPart, "BomEntries") ?? [];
    return {
      _id: pick(calcPart, "Id"),
      _partId: pick(calcPart, "PartId"),
      _wdt: pick(calcPart, "WDT", "wdt"),
      parentId: pick(calcPart, "ModuleParent"),
      _x: pick(calcPart, "RelX"),
      _y: pick(calcPart, "RelY"),
      _z: pick(calcPart, "RelZ"),
      _dimx: pick(calcPart, "DimX"),
      _dimy: pick(calcPart, "DimY"),
      _dimz: pick(calcPart, "DimZ"),
      _absx: pick(calcPart, "AbsX"),
      _absy: pick(calcPart, "AbsY"),
      _absz: pick(calcPart, "AbsZ"),
      _groupRootId: pick(calcPart, "GroupRootId"),
      _groupParentId: pick(calcPart, "GroupParentId"),
      a: pick(calcPart, "Attributes"),
      _childParts: childParts.map(toBomPartJson),
      _bom: bomEntries.map(e => ({
        _id: pick(e, "Id"),
        _bomElementTypeId: pick(e, "BomElementTypeId"),
        _bomType: toBomType(pick(e, "Origin")),
        _description: pick(e, "Description"),
        _touchOrigin: pick(e, "Touch"),
        _touchPart2Id: pick(e, "TouchPart2Id"),
        _touchPart2Name: pick(e, "TouchPart2Name"),
        _bomParentId: pick(e, "BomParentId"),
        a: pick(e, "Attributes"),
      })),
    };
  }

  function loadBomParts(bomData: any): PartBase[] {
    const calcBom = typeof bomData === "string" ? JSON.parse(bomData) : bomData;
    const calcParts: any[] = pick(calcBom, "BomEntries") ?? [];
    return calcParts.map(calcPart => {
      const bp = new BomPart();
      bp.loadJson(toBomPartJson(calcPart));
      return bp;
    });
  }

  function grainToString(grain: any): string {
    switch (Number(grain)) {
      case 1: return "Lengthwise";
      case 2: return "Crosswise";
      default: return "None";
    }
  }

  function toQuantity(value: any): number {
    const qty = Number(value);
    return Number.isFinite(qty) ? qty : 1;
  }

  // Create the BOM entries ({entry, extras}) like 'ZipConverter' in the productionManager output
  function createBomEntries(parts: PartBase[]): { entry: any; extras: Record<string, unknown> }[] {
    const unique = new Map<string, { entry: any; extras: Record<string, unknown> }>();
    createBomOutputById(parts, "Create_Bom").forEach((value, key) => {
      if (!key.toLowerCase().endsWith(".json")) {
        return;
      }
      try {
        const parsed = JSON.parse(value.content);
        if (parsed && parsed.entry) {
          unique.set(JSON.stringify(parsed.entry), { entry: parsed.entry, extras: parsed.extras ?? {} });
        }
      }
      catch (e) {
        // we are not returning error-messages
      }
    });
    return [...unique.values()];
  }

  interface PositionFiles {
    positionNumber: string;
    filePrefix: string;
    downloadPrefix: string;
    mprFiles: Map<string, BomOutputFileEntry>;
    drawingFiles: Map<string, BomOutputFileEntry>;
  }

  // Create the requested NC-Data (MPR) and drawings of a configuration position
  const createPositionFiles = (configPos: any, parts: PartBase[]): PositionFiles => {
    const positionNumber: string = String(configPos.positionNumber ?? configPos.name ?? positionCount);
    const filePrefix = "Images/" + configPos.id + "_";
    const mprFiles = flags.partProcessings === true ? createBomOutputById(parts, "Create_Mpr") : new Map<string, BomOutputFileEntry>();
    const drawingFiles = flags.partDrawings === true ? createBomOutputById(parts, "Create_Drawing") : new Map<string, BomOutputFileEntry>();
    mprFiles.forEach((value, key) => this.createFileEntry(result, filePrefix + key, value.content, value.contentType));
    drawingFiles.forEach((value, key) => this.createFileEntry(result, filePrefix + key, value.content, "image/svg+xml"));
    return { positionNumber, filePrefix, downloadPrefix: positionNumber + "_", mprFiles, drawingFiles };
  };

  // Reference the MPR / drawing of a board on its part
  function attachPartFiles(part: any, barcode: string, files: PositionFiles): void {
    const attach = (fileName: string, type: string, category: string) => {
      part.additionalData.push({ type, category, name: files.filePrefix + fileName, downloadFileName: files.downloadPrefix + fileName });
    };
    if (files.mprFiles.has(barcode + ".mpr")) {
      part.cncProgramName1 = files.downloadPrefix + barcode + ".mpr";
      attach(barcode + ".mpr", "CNCProgram", "MPR");
    }
    if (files.drawingFiles.has(barcode + ".svg")) {
      attach(barcode + ".svg", "Image", "PartDrawing");
    }
  }

  const createProductionPosition = (configPos: any, parts: PartBase[], files: PositionFiles): any => {
    const { positionNumber } = files;
    const position: any = {
      type: "Position",
      name: positionNumber,
      positionNumber: positionNumber,
      articleNumber: configPos.articleNumber,
      articleName: configPos.articleName,
      description: configPos.articleNumber,
      quantity: configPos.quantity ?? 1,
      QuantityUnit: "pcs",
      externalSystemId: configPos.id,
      items: [],
    };

    const entries = createBomEntries(parts);
    const visited = new Set<any>();

    const addEntry = (k: any, extras: Record<string, unknown>, container: any): any => {
      if (k.Type === "Partgroup") {
        const component: any = {
          type: "Component",
          articleNumber: k.id,
          description: k.Name,
          quantity: 1,
          length: k.width,
          width: k.depth,
          Thickness: k.thickness,
          QuantityUnit: "pcs",
          items: [],
        };
        // components are always placed on the position level (like the productionManager XML)
        position.items.push(component);
        return component;
      }

      if (k.Type === "Hardware") {
        container.items.push({
          ...extras,
          type: "Resource",
          articleNumber: k.Name,
          description: extras["bom_Description1"],
          quantity: toQuantity(extras["bom_Qty"]),
          length: k.width,
          width: k.depth,
          Thickness: k.thickness,
          Elementtype: k.Type,
          QuantityUnit: "pcs",
          items: [],
        });
      }

      if (k.Type === "Board") {
        const part: any = {
          ...extras,
          type: "Part",
          articleNumber: k.Name,
          description: k.Name + " of " + k.parent,
          articleGroup: k.ArticleGroup,
          quantity: 1,
          material: k.material,
          grain: grainToString(k.grain),
          finishLength: k.width,
          finishWidth: k.depth,
          length: k.cutLength,
          width: k.cutWidth,
          thickness: k.thickness,
          edgeDiagram: k.EdgeTransition,
          edgeFront: k.EdgeFront,
          edgeBack: k.EdgeBack,
          edgeLeft: k.EdgeLeft,
          edgeRight: k.EdgeRight,
          PartId: k.PartCode,
          Elementtype: k.Type,
          QuantityUnit: "pcs",
          additionalData: [],
          items: [],
        };
        attachPartFiles(part, k.barcode, files);
        container.items.push(part);
      }
      return container;
    };

    const insertChildren = (parent: string, container: any): void => {
      entries.forEach(e => {
        if (e.entry.parent !== parent || visited.has(e)) {
          return;
        }
        visited.add(e);
        const childContainer = addEntry(e.entry, e.extras, container);
        insertChildren(e.entry.id, childContainer);
      });
    };
    insertChildren("Root", position);
    return position;
  }

  const bomRequested = flags.bom === true;

  // Process all configuration positions; the production positions are added to the enclosing group
  const processItems = (items: any[], group: any): void => {
    items.forEach(item => {
      if (item === null || typeof item !== "object") {
        return;
      }
      if (item.type === "Group") {
        const groupItems: any[] = [...(item.items ?? [])];
        processItems(groupItems, item);
        return;
      }
      if (item.type === "ConfigurationPosition") {
        positionCount++;
        const bomData = item[bomPropertyName];
        if (bomData === undefined || bomData === null || bomData === "") {
          return;
        }
        positionsWithBom++;
        // the calculated BOM is only temporary data -> remove it from the (large) result
        delete item[bomPropertyName];

        const parts = loadBomParts(bomData);
        const files = createPositionFiles(item, parts);
        group.items ??= [];
        group.items.push(createProductionPosition(item, parts, files));
        return;
      }
      if (Array.isArray(item.items)) {
        processItems(item.items, group);
      }
    });
  };

  if (bomRequested) {
    processItems([...(od.items ?? [])], od);
    if (positionsWithBom === 0) {
      logWarning("No calculated BOM data ('" + bomPropertyName + "') found on any configuration position.");
    }
  }

  this.createFileEntry(result, "order-data.json", JSON.stringify(od, null, 2), "application/json");
