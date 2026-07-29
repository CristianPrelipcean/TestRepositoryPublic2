process_GroupWidthFromBlueprint(group: any): void {

  //====================================================================
  // Generic Helpers
  //====================================================================

  // Define the structure for blueprint cabinet information
  type BlueprintCabinetInfo = {
    Item: any;
    RootElement: any;
    Module: OD_M_mr_StorageunitSingle;
    Reused: boolean;
  };

  // Define the structure for existing cabinet information
  type ExistingCabinetInfo = {
    ArticleId: string;
    RootElement: any;
    Module: OD_M_mr_StorageunitSingle;
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
    if (group.mod_GroupWidthAdjustment === 'UseWallWidth') {
      const currentGroupWidth = getCurrentGroupWidth();

      const groupContext = GlobalFunc.process_GetGroupContextInformation(
        group.roomData,
        group.getArticlePos(),
        currentGroupWidth
      );

      if (groupContext.DataComplete) {
        return currentGroupWidth + groupContext.Right - 80;
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
      applyAttributeAdjustment(cabinet.Module, cabinet.Item.AdjustmentId);
    }
  };

  //====================================================================
  // Helper Blueprint rebuild
  //====================================================================

  const rebuildGroupFromBlueprint = (blueprintItems: any[], targetWidth: number): void => {

    // Remove all existing dockings before rebuilding the group
    removeAllDockings();

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

    // Function to get all existing cabinets in the group
    const getExistingCabinets = (): ExistingCabinetInfo[] => {
      const result: ExistingCabinetInfo[] = [];

      for (const rootElement of group.roots) {
        const module = rootElement.root;

        if (!(module instanceof OD_M_mr_StorageunitSingle)) {
          continue;
        }

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

      group.addRoots(newArticle);

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
      const adjustedWidth = calculateAdjustedWidth();

      // Get all existing cabinets in the group
      const existingCabinets = getExistingCabinets();
      const availableByArticleId = new Map<string, ExistingCabinetInfo[]>();
      const usedRootElements = new Set<any>();

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
        let module: OD_M_mr_StorageunitSingle;
        let reused = false;

        if (existing) {
          rootElement = existing.RootElement;
          module = existing.Module;
          reused = true;
        }
        else {
          rootElement = createCabinet(articleId);

          if (!rootElement?.root || !(rootElement.root instanceof OD_M_mr_StorageunitSingle)) {
            alert("Cannot create article. Position=" + item.Position + ", ArticleId=" + articleId);
            return undefined;
          }

          module = rootElement.root;
        }

        usedRootElements.add(rootElement);

        applyBlueprintWidth(module, item, adjustedWidth);
        rootsByPosition.set(item.Position, rootElement);

        result.push({
          Item: item,
          RootElement: rootElement,
          Module: module,
          Reused: reused,
        });
      }

      // Remove any existing cabinets that were not reused in the new blueprint plan
      for (const existing of existingCabinets) {
        if (!usedRootElements.has(existing.RootElement)) {
          removeCabinet(existing.RootElement);
        }
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

      if (!myRoot?.root || !neighbourRoot?.root) {
        return undefined;
      }

      if (neighbourDockingVector === undefined || myDockingVector === undefined) {
        return undefined;
      }

      return { myRoot: myRoot.root, neighbourRoot: neighbourRoot.root, myDockingVector, neighbourDockingVector, };
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

        group.addDocking( docking.neighbourRoot, docking.neighbourDockingVector, docking.myRoot, docking.myDockingVector);
      }

      return true;
    };

    //====================================================================
    // Blueprint rebuild execution
    //====================================================================

    // Build the cabinet plan based on the blueprint items and existing cabinets
    const cabinetPlan = buildCabinetPlan();
    if (!cabinetPlan) {
      return;
    }

    // Remove all existing dockings and building new ones
    removeAllDockings();
    buildDockings();

    // Adjust the attributes from the table
    applyBlueprintAttributeAdjustments(cabinetPlan);
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
      targetWidth
    );
    if (!blueprintResult.Success) {
      alert(blueprintResult.ErrorText);
      return;
    }

    // Call the function to rebuild the group based on the blueprint
    rebuildGroupFromBlueprint(blueprintResult.Items, targetWidth);
  };

  //====================================================================
  // Main execution: Adjust the group width to match the blueprint
  //====================================================================

  adjustGroupWidthToBlueprint();
}