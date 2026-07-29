ue_Fliplift(m: IFuncParents_mc_FlipliftHardware01){

	//========================================================================
	// Interfaces to create the outputs
	//========================================================================

	// Interface for the sections
	interface hardwareElement {
		Model3D?: any;
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		ConstructionPosX: number;
		ConstructionPosY: number;
		ConstructionPosZ: number;
		ConstructionDimY: number;
		ConstructionPart: string;
		Identifier: string;
		ProcessingId: string;
		HardwareId: string;
	}

	interface addOnData {
		PushToOpen: boolean;
		Hinges: boolean;
		OpeningAngle: number;
		FlipliftHardwareType: string;
		HingeClass: string;
	}

	interface FlipliftElement {
		Direction: string; 
		Data: hardwareElement;
	}
  
	interface FlipliftInfo {
		CarcaseElements: FlipliftElement[];
		FrontElements: FlipliftElement[];
		MechanismElements: FlipliftElement[];
		AddOnData: addOnData;
	}

	// Function to set the attributes
	function setValueshardwareElement(): hardwareElement {
		let updatedSection: hardwareElement = {
			Model3D: undefined,
			DimX: 0,
			DimY: 0,
			DimZ: 0,
			PosX: 0,
			PosY: 0,
			PosZ: 0,
			ConstructionPosX: 0,
			ConstructionPosY: 0,
			ConstructionPosZ: 0,
			ConstructionDimY: 0,
			ConstructionPart: 'None',
			Identifier: 'None',
			ProcessingId: 'None',
			HardwareId: 'None',
		};
		return updatedSection;
	}

	function setValuesaddOnData(): addOnData{
		let updatedSection : addOnData = {
			PushToOpen: false,
			Hinges: false,
			OpeningAngle: 0,
			FlipliftHardwareType: "",
			HingeClass: ""
		};
		return updatedSection;
	}

	let retFlipliftInfo: FlipliftInfo = {
		CarcaseElements: [],
		FrontElements: [],
		MechanismElements: [],
		AddOnData: setValuesaddOnData()
	};

	// Variables
	let sequence: string;
	let hardwareType: string;
	let flipliftColor: string | undefined = m.mod_FlipliftHardwareColor;

	//========================================================================
	// Main code
  //========================================================================
  
  try {

    //---------------Fliplift settings--------------------------------

    const isAutomatic = m.mod_FlipliftHardwareType === 'Automatic';

    let retSettings = GlobalFunc.find_FlipliftSettings(
      m.mod_FlipliftType,
      m.mod_Width,
      m.mod_Depth,
      m.mod_Height,
      m.mod_OpeningType,
      isAutomatic ? '' : m.mod_FlipliftHardwareType,
      !isAutomatic
    );

    // Set the values
    sequence = retSettings.Sequence!;
    hardwareType = retSettings.FlipliftHardwareType!;
    retFlipliftInfo.AddOnData.Hinges = retSettings.Hinges!;
    retFlipliftInfo.AddOnData.PushToOpen = retSettings.PushToOpen!;
    retFlipliftInfo.AddOnData.FlipliftHardwareType = retSettings.FlipliftHardwareType!;

    //---------------Weight type mapping------------------------------

    let retWeightType = GlobalFunc.find_FlipliftWeightTypeMapping(m.mod_FlipliftType, hardwareType, m.mod_Height);	
    let frontWeight = m.mod_FrontpanelWeightCalculations[0] ?? 0;
    let handleWeight = (m.mod_HandleWeightCalculations[0] ?? 0) / 1000;
    let weightType: number = retWeightType.WeightType(m.mod_Height, frontWeight, handleWeight);

    //---------------Color mapping------------------------------------

    if (flipliftColor === 'Automatic') {
      flipliftColor = GlobalFunc.find_FlipliftColorMapping(m.mod_HardwareColor, hardwareType).FlipliftColor;
    }

    //---------------Hardware mapping---------------------------------

    // Process the direction
    let directionArray = retSettings.Sequence!.split("_");
    let qtyFittings = directionArray.length;

    // Check the weightType if it is per unit or per set
    if (retWeightType.CalculationType == "Single") {
      weightType = weightType / qtyFittings;
    }

    // Cycle for each side (left or right in the carcase)
    directionArray.forEach(direction => {

      // FlipliftMapping
      let retFlipliftMapping = GlobalFunc.find_FlipliftMapping(m.mod_FlipliftType, hardwareType, weightType, direction, m.mod_Height, flipliftColor!);
      retFlipliftInfo.AddOnData.HingeClass = retFlipliftMapping.HingeClass!;
      retFlipliftInfo.AddOnData.OpeningAngle = retFlipliftMapping.OpeningAngle;

      // Construction
      let ObjectMappingCon = GlobalFunc.find_FlipliftConstruction(retFlipliftMapping.ConstructionId!)

      // Carcase Elements
      // ----------------------------

      if (retFlipliftMapping.CarcaseObject && retFlipliftMapping.CarcaseObject !== "None") {

        // ObjectMapping
        let ObjectMapping = GlobalFunc.find_ObjectMapping(retFlipliftMapping.CarcaseObject!)

        // GraphicLibrary
        let retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(ObjectMapping.GraphicItem!);

        retGraphicMapping.forEach((Item) => {
          let retGraphicLib = GlobalFunc.find_GraphicLibrary(Item.Model3DGroupName!);

          // Add a new item to the output
          retFlipliftInfo.CarcaseElements.push({ Direction: direction, Data: setValueshardwareElement() });
          let lastElement = retFlipliftInfo.CarcaseElements[retFlipliftInfo.CarcaseElements.length - 1];

          // Set the values of the item
          lastElement.Data.Model3D = retGraphicLib.Model3D;
          lastElement.Data.DimX = retGraphicLib.DimensionX + retGraphicLib.PartOffsetX;
          lastElement.Data.DimY = retGraphicLib.DimensionY;
          lastElement.Data.DimZ = retGraphicLib.DimensionZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.PosX = retGraphicLib.InsertionPointX + retGraphicLib.PartOffsetX;
          lastElement.Data.PosY = retGraphicLib.InsertionPointY;
          lastElement.Data.PosZ = retGraphicLib.InsertionPointZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.Identifier = retGraphicLib.Identifier!;
          lastElement.Data.ConstructionPosX = 0;
          lastElement.Data.ConstructionPosY = ObjectMappingCon.CarcasePosY;
          lastElement.Data.ConstructionPosZ = ObjectMappingCon.CarcasePosZ;
          lastElement.Data.ConstructionDimY = 0;
          lastElement.Data.ConstructionPart = ObjectMappingCon.CarcaseConnection!;
          lastElement.Direction = direction;
          lastElement.Data.ProcessingId = ObjectMapping.ProcessingItem!;
          lastElement.Data.HardwareId = ObjectMapping.HardwareItem!;
        });
      }

      // Front Elements
      // ----------------------------

      if (retFlipliftMapping.FrontObject && retFlipliftMapping.FrontObject !== "None") {

        // ObjectMapping
        let ObjectMappingF = GlobalFunc.find_ObjectMapping(retFlipliftMapping.FrontObject!)

        // GraphicLibrary
        let retGraphicMappingF = GlobalFunc.find_GraphicLibraryMapping(ObjectMappingF.GraphicItem!);

        retGraphicMappingF.forEach((Item) => {
          let retGraphicLib = GlobalFunc.find_GraphicLibrary(Item.Model3DGroupName!);

          // Add a new item to the output
          retFlipliftInfo.FrontElements.push({ Direction: direction, Data: setValueshardwareElement() });
          let lastElement = retFlipliftInfo.FrontElements[retFlipliftInfo.FrontElements.length - 1];

          // Set the values of the item
          lastElement.Data.Model3D = retGraphicLib.Model3D;
          lastElement.Data.DimX = retGraphicLib.DimensionX + retGraphicLib.PartOffsetX;
          lastElement.Data.DimY = retGraphicLib.DimensionY;
          lastElement.Data.DimZ = retGraphicLib.DimensionZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.PosX = retGraphicLib.InsertionPointX + retGraphicLib.PartOffsetX;
          lastElement.Data.PosY = retGraphicLib.InsertionPointY;
          lastElement.Data.PosZ = retGraphicLib.InsertionPointZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.Identifier = retGraphicLib.Identifier!;
          lastElement.Data.ConstructionPosX = ObjectMappingCon.FrontPosX;
          lastElement.Data.ConstructionPosY = ObjectMappingCon.FrontPosY;
          lastElement.Data.ConstructionPosZ = 0;
          lastElement.Data.ConstructionDimY = 0;
          lastElement.Direction = direction;
          lastElement.Data.ProcessingId = ObjectMappingF.ProcessingItem!;
          lastElement.Data.HardwareId = ObjectMappingF.HardwareItem!;
        });
      }

      // Mechanism Elements
      // ----------------------------

      if (retFlipliftMapping.MechanismObject && retFlipliftMapping.MechanismObject !== "None") {

        // ObjectMapping
        let ObjectMappingM = GlobalFunc.find_ObjectMapping(retFlipliftMapping.MechanismObject!)

        // GraphicLibrary
        let retGraphicMappingM = GlobalFunc.find_GraphicLibraryMapping(ObjectMappingM.GraphicItem!);

        retGraphicMappingM.forEach((Item) => {
          let retGraphicLib = GlobalFunc.find_GraphicLibrary(Item.Model3DGroupName!);

          // Add a new item to the output
          retFlipliftInfo.MechanismElements.push({ Direction: direction, Data: setValueshardwareElement() });
          let lastElement = retFlipliftInfo.MechanismElements[retFlipliftInfo.MechanismElements.length - 1];

          // Set the values of the item
          lastElement.Data.Model3D = retGraphicLib.Model3D;
          lastElement.Data.DimX = retGraphicLib.DimensionX + retGraphicLib.PartOffsetX;
          lastElement.Data.DimY = retGraphicLib.DimensionY;
          lastElement.Data.DimZ = retGraphicLib.DimensionZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.PosX = retGraphicLib.InsertionPointX + retGraphicLib.PartOffsetX;
          lastElement.Data.PosY = retGraphicLib.InsertionPointY;
          lastElement.Data.PosZ = retGraphicLib.InsertionPointZ + retGraphicLib.PartOffsetZ;
          lastElement.Data.Identifier = retGraphicLib.Identifier!;
          lastElement.Data.ConstructionPosX = ObjectMappingCon.MechanismPosX;
          lastElement.Data.ConstructionPosY = ObjectMappingCon.MechanismPosY;
          lastElement.Data.ConstructionPosZ = ObjectMappingCon.MechanismPosZ;
          lastElement.Data.ConstructionDimY = ObjectMappingCon.MechanismDimY;
          lastElement.Direction = direction;
          lastElement.Data.ProcessingId = ObjectMappingM.ProcessingItem!;
          lastElement.Data.HardwareId = ObjectMappingM.HardwareItem!;
        });
      }
    });
    
    //---------------Return data to the module------------------------

    return retFlipliftInfo;

  }
  catch{			
    // The messages are shown from the functions (Not needed here)
    return undefined;
  }
}