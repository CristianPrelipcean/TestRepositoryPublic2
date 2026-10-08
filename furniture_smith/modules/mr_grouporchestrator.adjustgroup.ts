
  //====================================================================
  // Guard
  //====================================================================

  if (this.roots.length <= 0) {
    logError("At least one root is needed!");
    return;
  }

  //====================================================================
  // Attributes for the presettings
  //====================================================================

  // Reminder of the presetting relevant attributes
  let frontColor: string | undefined;
  let carcaseColor: string | undefined;
  let carcaseOutsideColor: string | undefined;
  let frontProgram: string | undefined;
  let handleDesign: string | undefined;
  let handlePos: string | undefined;

  //====================================================================
  // Read the group settings and calculate the variant for the generation
  //====================================================================

  interface GroupGenerationInformation {
    GenerationMethod: string;
    HeightAdjustment: string;
    WidthAdjustment: string;
    VisibleSideSolution: string;
    Width: number;
    Height: number;
    WallDistance: number;
    Variant: string;
  }

  let previousInformation: GroupGenerationInformation | undefined;

  // Find previous group generation information
  for (const rootElement of this.roots) {
    const module = rootElement.root;
    
    if (!(module instanceof OD_M_mr_StorageunitSingle)) {
      continue;
    }

    // Read presetting relevant attributes
    frontColor = module.mod_FrontColor;
    carcaseColor = module.mod_CarcaseColor;
    carcaseOutsideColor = module.mod_CarcaseOutsideColor;
    frontProgram = module.mod_FrontProgram;
    handleDesign = module.mod_HandleDesign;
    handlePos = module.mod_HandlePosType;

    if (!module.mod_GroupGenerationStatus) {
      continue;
    }

    try {
      previousInformation = JSON.parse(module.mod_GroupGenerationStatus) as GroupGenerationInformation;
      break;
    } catch {
      continue;
    }
  }

  // Check if group settings have changed
  const settingsChanged =
    previousInformation === undefined ||
    previousInformation.GenerationMethod !== this.mod_GroupGenerationLogic ||
    previousInformation.HeightAdjustment !== this.mod_GroupHeightAdjustment ||
    previousInformation.WidthAdjustment !== this.mod_GroupWidthAdjustment ||
    previousInformation.VisibleSideSolution !== this.mod_VisibleSideSolution ||
    previousInformation.Width !== this.mod_GroupWidth ||
    previousInformation.Height !== this.mod_GroupHeight ||
    previousInformation.WallDistance !== this.mod_CarcaseDistanceWall;

  // Determine variant
  let variant = "Type01";

  if (previousInformation !== undefined) {
    const match = /^Type(\d+)$/.exec(previousInformation.Variant);

    if (match) {
      if (settingsChanged) {
        variant = previousInformation.Variant;
      }
      else {
        const nextVariant = Number(match[1]) + 1;
        variant = `Type${nextVariant.toString().padStart(2, "0")}`;
      }
    }
  }

  // Create new generation information
  const groupData: GroupGenerationInformation = {
    GenerationMethod: this.mod_GroupGenerationLogic,
    HeightAdjustment: this.mod_GroupHeightAdjustment,
    WidthAdjustment: this.mod_GroupWidthAdjustment,
    VisibleSideSolution: this.mod_VisibleSideSolution,
    Width: this.mod_GroupWidth,
    Height: this.mod_GroupHeight,
    WallDistance: this.mod_CarcaseDistanceWall,
    Variant: variant
  };
   
  //====================================================================
  // Helpers
  //====================================================================
   
  // Helper to force an attribute to be considered as input for a module
  const forceAttribute = (module: OD_M_mr_StorageunitSingle, attribute: string): void => {
    module._forcedInputAttributes ??= [];

    if (!module._forcedInputAttributes.includes(attribute)) {
      module._forcedInputAttributes.push(attribute);
    }
  };

  // Helper to convert table value to dataformat of attribute
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

  //====================================================================
  // Group width adjustment
  //====================================================================

  // Reset forced attributes once before all adjustments
  for (const rootElement of this.roots) {
    const module = rootElement.root;

    if (module instanceof OD_M_mr_StorageunitSingle) {
      module._forcedInputAttributes = [];
    }
  }

  // Execute the blueprint table
  variant = GlobalFunc.process_GroupWidthFromBlueprint(this, variant);

  //====================================================================
  // Group height adjustment
  //====================================================================

  // Apply the adjustment to the attributes
  const applyAttributeAdjustment = (module: OD_M_mr_StorageunitSingle, adjustmentId: string): void => {
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

      const attributeValue = convertAttributeValue(adjustment.AttributeValue, adjustment.AttributeType);
      if (attributeValue === undefined) {
        continue;
      }

      (module as any)[attributeId] = attributeValue;
      forceAttribute(module, attributeId);
    }
  };

  // Execute the height adjustment
  const setHeightAdjustment = (module: OD_M_mr_StorageunitSingle): void => {

    // find the height adjusment rule
    const articleId = module._articleId ?? "";
    const elementType = module.mod_TypeElement ?? "";
    const heightAdjustmentMode = this.mod_GroupHeightAdjustment;  
    const rule = GlobalFunc.find_HeightAdjustmentRule(elementType, articleId, heightAdjustmentMode);

    // No rule means: no height adjustment and no attributes
    if (!rule) {
      return;
    }

    // Apply attributes from the rule, even if height adjustment is not active
    if (rule.AdjustmentId) {
      applyAttributeAdjustment(module, rule.AdjustmentId);
    }

    // Disable the height adjustment if the rule does not allow it
    if (rule.ActivateHeightAdjustment !== true) {
      module.mod_AutomaticHeightAdjustment = false;
      module.mod_UseGroupHeight = false;
      forceAttribute(module, 'mod_AutomaticHeightAdjustment');
      forceAttribute(module, 'mod_UseGroupHeight');
      return;
    }

    // Room height adjustment uses the existing automatic adjustment
    if (heightAdjustmentMode === 'UseRoomHeight') {
      module.mod_AutomaticHeightAdjustment = true;
      module.mod_UseGroupHeight = false;
      forceAttribute(module, 'mod_AutomaticHeightAdjustment');
      forceAttribute(module, 'mod_UseGroupHeight');
    }

    // Group height adjustment is calculated later in PREPARECONTEXT
    if (heightAdjustmentMode === 'UseGroupHeight') {
      module.mod_AutomaticHeightAdjustment = false;
      module.mod_GroupHeight = this.mod_GroupHeight;
      module.mod_UseGroupHeight = true;
      forceAttribute(module, 'mod_AutomaticHeightAdjustment');
      forceAttribute(module, 'mod_UseGroupHeight');
      forceAttribute(module, 'mod_GroupHeight');
    } 
  };

  //====================================================================
  // Solution for the visible cabinet sides
  //====================================================================

  const setVisibleSideSolution = (module: OD_M_mr_StorageunitSingle): void => {
    let automaticType: string | undefined;

    if (this.mod_VisibleSideSolution === 'Upright') {
      automaticType = 'AddUpright';
    }
    else if (this.mod_VisibleSideSolution === 'FinishedSide') {
      automaticType = 'AddFinishedSide';
    }

    if (!automaticType) {
      return;
    }

    module.mod_CarcaseVisLeftAutomaticType = automaticType;
    module.mod_CarcaseVisRightAutomaticType = automaticType;

    forceAttribute(module, 'mod_CarcaseVisLeftAutomaticType');
    forceAttribute(module, 'mod_CarcaseVisRightAutomaticType');
  };

  //====================================================================
  // Cycle through the cabinets in the group (core logic)
  //====================================================================

  // Core logic
  for (const rootElement of this.roots) {
    const module = rootElement.root;

    // Guard
    if (!(module instanceof OD_M_mr_StorageunitSingle)) {
      continue;
    }

    // Height adjustment
    setHeightAdjustment(module);

    // Visible side solution
    setVisibleSideSolution(module);

    // Move the cabinets from the wall
    module.mod_CarcaseDistanceWall = this.mod_CarcaseDistanceWall;
    forceAttribute(module, 'mod_CarcaseDistanceWall');

    // Calculate carcase height
    GlobalFunc.calc_PrepareContextCarcaseHeight(module);

    // Store the generation groupGenerationInformatiodatan
    groupData.Variant = variant;
    module.mod_GroupGenerationStatus = JSON.stringify(groupData);  ;
    forceAttribute(module, 'mod_GroupGenerationStatus');

    // Set Presetting relevant attributes
    if (frontColor) {
      module.mod_FrontColor = frontColor;
      forceAttribute(module, 'mod_FrontColor');
    }

    if (carcaseColor) {
      module.mod_CarcaseColor = carcaseColor;
      forceAttribute(module, 'mod_CarcaseColor');
    }

    if (carcaseOutsideColor) {
      module.mod_CarcaseOutsideColor = carcaseOutsideColor;
      forceAttribute(module, 'mod_CarcaseOutsideColor');
    }

    if (frontProgram) {
      module.mod_FrontProgram = frontProgram;
      forceAttribute(module, 'mod_FrontProgram');
    }

    if (handleDesign) {
      module.mod_HandleDesign = handleDesign;
      forceAttribute(module, 'mod_HandleDesign');
    }

    if (handlePos) {
      module.mod_HandlePosType = handlePos;
      forceAttribute(module, 'mod_HandlePosType');
    }  
    
    frontColor = module.mod_FrontColor;
    carcaseColor = module.mod_CarcaseColor;
    carcaseOutsideColor = module.mod_CarcaseOutsideColor;
    frontProgram = module.mod_FrontProgram;
    handleDesign = module.mod_HandleDesign;
    handlePos = module.mod_HandlePosType;  
  }
  
  //====================================================================
  // Seal all roots so Roomle gets the docking vectors in this result
  //====================================================================
  
  for (const rootElement of this.roots) {
    rootElement.root?.seal();
  }
  