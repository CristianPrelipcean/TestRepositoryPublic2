process_GroupWidthFromBlueprint(group: go_mr_GroupOrchestrator, variant = ''): string {

  // Capture the incoming placement before creating or reusing any articles.
  const originalGroupPosition = { ...group.getArticlePos() };
  const fillCompleteWall = group.mod_GroupWidthAdjustment === 'FillCompleteWallWidth';
  let plannedGroupPosition: number[] | undefined;

  //====================================================================
  // Generic Helpers
  //====================================================================

  // Define the structure for blueprint cabinet information
  type BlueprintCabinetInfo = {
    Item: any;
    RootElement: any;
    Module: any;
    Reused: boolean;
  };

  // Define the structure for existing cabinet information
  type ExistingCabinetInfo = {
    ArticleId: string;
    RootElement: any;
    Module: any;
  };
    
  // Helper to force an attribute to be considered as input for a module
  const forceAttribute = (module: OD_M_mr_StorageunitSingle, attribute: string): void => {
    module._forcedInputAttributes ??= [];

    if (!module._forcedInputAttributes.includes(attribute)) {
      module._forcedInputAttributes.push(attribute);
    }
  };

  // Helper to get all cabinets in the group
  const getCabinets = (): OD_M_mr_StorageunitSingle[] => {
    const cabinets: OD_M_mr_StorageunitSingle[] = [];

    for (const rootElement of group.roots) {
      const module = rootElement.root;

      if (module instanceof OD_M_mr_StorageunitSingle) {
        cabinets.push(module);
      }
    }

    return cabinets;
  };

  // Helper to get the current total width of the group
  const getCurrentGroupWidth = (): number => {
    let width = 0;
    let minPosX = Number.MAX_VALUE;

    for (const cabinet of getCabinets()) {
      width += cabinet.mod_Width ?? 0;
      minPosX = Math.min(minPosX, cabinet._articlePos.x);
    }

    return minPosX === Number.MAX_VALUE
      ? width
      : Math.round(width + minPosX);
  };

  // Helper to get the target group width based on the adjustment setting
  const getTargetGroupWidth = (): number => {
    if (fillCompleteWall) {
      const gap = group.g.basic_GroupWallDistance;
      if (!Number.isFinite(gap) || gap < 0) {
        alert('FillCompleteWallWidth requires a non-negative basic_GroupWallDistance.');
        return 0;
      }

      // Full-wall calculation does not depend on the width of the old cabinets.
      const context = GlobalFunc.process_GetGroupContextInformation(
        group.roomData, originalGroupPosition, 0, true
      );
      if (!context.DataComplete || context.WallLength === undefined ||
          context.PositionOnWall === undefined || context.DirectionX === undefined ||
          context.DirectionZ === undefined) {
        alert('FillCompleteWallWidth: no parallel wall could be determined from the group position.');
        return 0;
      }

      const targetWidth = context.WallLength - 2 * gap;
      if (!Number.isFinite(targetWidth) || targetWidth <= 0) {
        alert('FillCompleteWallWidth: the wall is too short for the configured gaps.');
        return 0;
      }

      // Translate along the wall only: retain height, rotation and back clearance.
      const shift = gap - context.PositionOnWall;
      plannedGroupPosition = [
        (originalGroupPosition.x ?? 0) + shift * context.DirectionX,
        originalGroupPosition.y ?? 0,
        (originalGroupPosition.z ?? 0) + shift * context.DirectionZ
      ];
      return targetWidth;
    }

    if (group.mod_GroupWidthAdjustment === 'UseWallWidth') {
      const currentGroupWidth = getCurrentGroupWidth();

      const groupContext = GlobalFunc.process_GetGroupContextInformation(
        group.roomData,
        originalGroupPosition,
        currentGroupWidth
      );

      if (groupContext.DataComplete) {
        return currentGroupWidth + groupContext.Right - group.g.basic_GroupWallDistance;
      }
    }

    return group.mod_GroupWidth;
  };

  // Helper to remove all dockings in the group
  const removeAllDockings = (): void => {
    const roots = [...group.roots];

    for (let i = 0; i < roots.length; i++) {
      for (let j = i + 1; j < roots.length; j++) {
        group.removeDocking(roots[i].root, roots[j].root);
      }
    }
  };

  //====================================================================
  // Helper to set the attributes from the blueprint table
  //====================================================================

  // Convert the value into the datatype of the attribute
  const convertAttributeValue = (value: string | undefined, type: string | undefined): any => {
    if (value === undefined) {
      return undefined;
    }

    switch (type) {
      case 'Boolean':
        return value === 'true';

      case 'Number':
        return Number(value);

      case 'String':
      default:
        return value;
    }
  };

  // Try to get the entries of table tab_GroupAttributeAdjustment and set the attribute values
  const applyAttributeAdjustment = (module: OD_M_mr_StorageunitSingle, adjustmentId: string | undefined): void => {
    if (!adjustmentId) {
      return;
    }
    
    const adjustments = GlobalFunc.find_GroupAttributeAdjustment(adjustmentId) ?? [];

    for (const adjustment of adjustments) {
      if (!adjustment) {
        continue;
      }

      const attributeId = adjustment.AttributeId;
      
      if (!attributeId) {
        continue;
      }

      const attributeValue = convertAttributeValue(
        adjustment.AttributeValue,
        adjustment.AttributeType
      );

      if (attributeValue === undefined) {
        continue;
      }

      (module as any)[attributeId] = attributeValue;
      forceAttribute(module, attributeId);
    }
  };

  // Cycle through the blueprint to adjust the attributes of each cabinet
  const applyBlueprintAttributeAdjustments = (cabinetPlan: BlueprintCabinetInfo[]): void => {
    for (const cabinet of cabinetPlan) {

      if (!(cabinet.Module instanceof OD_M_mr_StorageunitSingle)) {
        continue;
      }

      applyAttributeAdjustment(cabinet.Module, cabinet.Item.AdjustmentId);
    }
  };

  //====================================================================
  // Helper Blueprint rebuild
  //====================================================================

  const rebuildGroupFromBlueprint = (blueprintItems: any[], targetWidth: number): void => {

    // Map to store all cabinets by their position, used for docking
    const rootsByPosition = new Map<number, any>();

    // Function to get the docking vector based on the string value
    const getDockingVector = (value: string): Dock | undefined => {
      const dockingByName: Record<string, Dock> = {
        LeftBottom: Dock.LeftBottom,
        RightBottom: Dock.RightBottom,
        LeftTop: Dock.LeftTop,
        RightTop: Dock.RightTop,
      };

      return dockingByName[value];
    };

	// Function to get the docking vector mode based on the string value
    const getDockingVectorMode = (value: string): DockMode | undefined => {
      const dockingModeByName: Record<string, DockMode> = {
        EndEnd: DockMode.EndEnd,
        EndStart: DockMode.EndStart,
        StartEnd: DockMode.StartEnd,
        StartStart: DockMode.StartStart,
      };

      return dockingModeByName[value];
    };

    // Function to get all existing cabinets in the group
    const getExistingCabinets = (): ExistingCabinetInfo[] => {
      const result: ExistingCabinetInfo[] = [];

      for (const rootElement of group.roots) {
        const module = rootElement.root;

        const articleId = rootElement.root._articleId
        if (!articleId) {
          continue;
        }

        result.push({
          ArticleId: String(articleId),
          RootElement: rootElement,
          Module: module,
        });
      }

      return result;
    };

    // Function to calculate the adjusted width for cabinets with 'Adjusted' width mode
    const calculateAdjustedWidth = (): number => {
      const relevantItems = blueprintItems.filter(x => x.GroupWidthRelevant === true);
      const fixedWidthSum = relevantItems.filter(x => x.WidthMode === 'Fixed').reduce((sum, x) => sum + (x.WidthValue ?? 0), 0);
      const adjustedItems = relevantItems.filter(x => x.WidthMode === 'Adjusted');
      return adjustedItems.length > 0 ? (targetWidth - fixedWidthSum) / adjustedItems.length : 0;
    };

    // Function to apply the blueprint width to a cabinet module
    const applyBlueprintWidth = (module: OD_M_mr_StorageunitSingle, item: any, adjustedWidth: number): void => {
      if (item.WidthMode === 'Fixed') {
        module.mod_Width = item.WidthValue;
        forceAttribute(module, 'mod_Width');
      }

      if (item.WidthMode === 'Adjusted') {
        module.mod_Width = adjustedWidth;
        forceAttribute(module, 'mod_Width');
      }
    };

    // Function to create a new cabinet based on the article ID
    const createCabinet = (articleId: string): any | undefined => {
      const newArticle = group.createArticle(articleId);

      if (!newArticle?.[0]?.root) {
        alert("Article not found: " + articleId);
        return undefined;
      }

      // Stage all roots; attach them only after the whole plan is available.
      createdRoots.push(...newArticle);
      return newArticle[0];
    };

    // Function to remove a cabinet from the group
    const removeCabinet = (rootElement: any): void => {
      group.removeRoot(rootElement);
    };

    // Function to build the cabinet plan based on the blueprint items and existing cabinets
    const buildCabinetPlan = (): BlueprintCabinetInfo[] | undefined => {

      // Array to store the final cabinet plan
      const result: BlueprintCabinetInfo[] = [];

      // Get all existing cabinets in the group
      const existingCabinets = getExistingCabinets();
      const availableByArticleId = new Map<string, ExistingCabinetInfo[]>();

      // Group existing cabinets by their article ID for reuse
      for (const existing of existingCabinets) {
        const list = availableByArticleId.get(existing.ArticleId) ?? [];
        list.push(existing);
        availableByArticleId.set(existing.ArticleId, list);
      }

      // Iterate through the blueprint items and create or reuse cabinets as needed
      for (const item of blueprintItems) {
        const articleId = String(item.ArticleId);
        const availableList = availableByArticleId.get(articleId);
        const existing = availableList?.shift();

        let rootElement: any;
        let module: any;
        let reused = false;

        if (existing) {
          rootElement = existing.RootElement;
          module = existing.Module;
          reused = true;
        }
        else {
          rootElement = createCabinet(articleId);

          if (!rootElement?.root) {
            alert("Cannot create article. Position=" + item.Position + ", ArticleId=" + articleId);
            return undefined;
          }

          module = rootElement.root;
        }

        rootsByPosition.set(item.Position, rootElement);

        result.push({
          Item: item,
          RootElement: rootElement,
          Module: module,
          Reused: reused,
        });
      }

      // Return the final cabinet plan
      return result;
    };

    // Function to resolve docking information for a blueprint item
    const resolveDocking = (item: any) => {
      const myRoot = rootsByPosition.get(item.Position);
      const neighbourRoot = rootsByPosition.get(item.DockToPosition);
      const neighbourDockingVector = getDockingVector(item.NeighbourDockingVector);
      const myDockingVector = getDockingVector(item.MyDockingVector);
      const dockingMode = getDockingVectorMode(item.DockingMode);
      const offset: number[] = [item.OffsetRight, item.OffsetUp, item.OffsetFront];

      if (!myRoot?.root || !neighbourRoot?.root) {
        return undefined;
      }

      if (neighbourDockingVector === undefined || myDockingVector === undefined || dockingMode === undefined) {
        return undefined;
      }

      return { myRoot: myRoot.root, neighbourRoot: neighbourRoot.root, myDockingVector, neighbourDockingVector, dockingMode, offset };
    };

    // Function to build dockings between cabinets based on the blueprint items
    const buildDockings = (): boolean => {

      for (const item of blueprintItems) {
        if (!item.DockToPosition || item.DockToPosition <= 0) {
          continue;
        }

        const docking = resolveDocking(item);
        if (!docking) {
          alert("Cannot create docking. Position=" + item.Position + ", DockToPosition=" + item.DockToPosition);
          return false;
        }

        group.addDocking( docking.neighbourRoot, docking.neighbourDockingVector, docking.myRoot, docking.myDockingVector, docking.dockingMode, docking.offset);
      }

      return true;
    };

    //====================================================================
    // Blueprint rebuild execution
    //====================================================================

    // Validate full-wall layouts before changing the current group. Every item
    // must connect to a single starting cabinet so that one anchor moves it all.
    let anchorItem: any;
    if (fillCompleteWall) {
      const anchors = blueprintItems.filter(item => !item.DockToPosition || item.DockToPosition <= 0);
      anchorItem = anchors[0];
      const itemsByPosition = new Map(blueprintItems.map(item => [item.Position, item]));
      const relevantItems = blueprintItems.filter(item => item.GroupWidthRelevant === true);
      const fixedWidth = relevantItems.filter(item => item.WidthMode === 'Fixed')
        .reduce((sum, item) => sum + (item.WidthValue ?? 0), 0);
      const adjustableCount = relevantItems.filter(item => item.WidthMode === 'Adjusted').length;
      if (anchors.length !== 1 || !relevantItems.length || !Number.isFinite(fixedWidth) ||
          (adjustableCount > 0 ? fixedWidth >= targetWidth : Math.abs(fixedWidth - targetWidth) > 0.001)) {
        alert('FillCompleteWallWidth: blueprint must have one starting article and widths that can fill the target.');
        return;
      }
      for (const item of blueprintItems) {
        if (!['Fixed', 'Adjusted'].includes(item.WidthMode) ||
            (item.WidthMode === 'Fixed' && (!Number.isFinite(item.WidthValue) || item.WidthValue <= 0))) {
          alert('FillCompleteWallWidth: invalid blueprint width at Position=' + item.Position);
          return;
        }
        const visited = new Set<number>();
        let current = item;
        while (current !== anchorItem) {
          if (!current || visited.has(current.Position) ||
              getDockingVector(current.MyDockingVector) === undefined ||
              getDockingVector(current.NeighbourDockingVector) === undefined ||
              getDockingVectorMode(current.DockingMode) === undefined) {
            alert('FillCompleteWallWidth: invalid or disconnected blueprint docking at Position=' + item.Position);
            return;
          }
          visited.add(current.Position);
          current = itemsByPosition.get(current.DockToPosition);
        }
      }
    }

    const createdRoots: any[] = [];
    // Build the cabinet plan based on the blueprint items and existing cabinets
    const cabinetPlan = buildCabinetPlan();
    if (!cabinetPlan) {
      return;
    }

    // Resolve every docking before touching the original group.
    if (blueprintItems.some(item => item.DockToPosition > 0 && !resolveDocking(item))) {
      alert('Cannot rebuild group: a blueprint docking could not be resolved.');
      return;
    }

    // A full-wall reference must be a cabinet whose origin represents its left
    // edge. The requested relative placement overrides any previous local offset.
    const anchor = fillCompleteWall ? rootsByPosition.get(anchorItem.Position)?.root : undefined;
    if (fillCompleteWall && (!(anchor instanceof OD_M_mr_StorageunitSingle) || !plannedGroupPosition)) {
      alert('FillCompleteWallWidth: the starting article must be a storage unit.');
      return;
    }

    if (fillCompleteWall && cabinetPlan.some(cabinet =>
      cabinet.Item.GroupWidthRelevant === true && !(cabinet.Module instanceof OD_M_mr_StorageunitSingle))) {
      alert('FillCompleteWallWidth: width-relevant articles must be storage units.');
      return;
    }

    const adjustedWidth = calculateAdjustedWidth();
    for (const cabinet of cabinetPlan) {
      if (cabinet.Module instanceof OD_M_mr_StorageunitSingle) {
        applyBlueprintWidth(cabinet.Module, cabinet.Item, adjustedWidth);
      }
    }

    removeAllDockings();
    group.addRoots(createdRoots);
    const usedRoots = new Set(cabinetPlan.map(cabinet => cabinet.RootElement));
    for (const existing of getExistingCabinets()) {
      if (!usedRoots.has(existing.RootElement) && !createdRoots.includes(existing.RootElement)) {
        removeCabinet(existing.RootElement);
      }
    }
    if (!buildDockings()) {
      return;
    }

    // Adjust the attributes from the table
    applyBlueprintAttributeAdjustments(cabinetPlan);

    if (fillCompleteWall && anchor && plannedGroupPosition) {
      group.setRepositioningData({
        posGroup: plannedGroupPosition,
        posRotationY: originalGroupPosition.rotationY ?? 0,
        rootId: anchor._id,
        rootRelPos: [0, 0, 0],
        rootRelRotationY: 0
      });
    }
  };

  //====================================================================
  // Blueprint logic
  //====================================================================

  const adjustGroupWidthToBlueprint = (): void => {

    // Stop if the user doesn't want to adjust the group
    if (group.mod_GroupWidthAdjustment === 'KeepArticleConfiguration') {
      return;
    }

    // Calculate the target width for the group based on the adjustment setting
    const targetWidth = getTargetGroupWidth();
    if (targetWidth <= 0) {
      return;
    }

    // Read the blueprint table for the group based on the generation logic and target width
    const blueprintResult = GlobalFunc.find_GroupBlueprint(
      group.mod_GroupGenerationLogic,
      targetWidth,
      variant
    );
    if (!blueprintResult.Success) {
      alert(blueprintResult.ErrorText);
      return;
    }

    variant = blueprintResult.Variant;

    // Call the function to rebuild the group based on the blueprint
    rebuildGroupFromBlueprint(blueprintResult.Items, targetWidth);
  };

  //====================================================================
  // Main execution: Adjust the group width to match the blueprint
  //====================================================================

  adjustGroupWidthToBlueprint();
  return variant;

}