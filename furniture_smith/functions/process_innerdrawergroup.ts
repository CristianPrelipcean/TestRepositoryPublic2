process_InnerDrawerGroup(m: any) {
  const createDefaultResult = (): {
    IsComplete: boolean;
    Drawers: {
      Index: number;
      ConstructionId: string;
      DepthType: string;
      HeightType: string;
      PosX: number;
      PosY: number;
      PosZ: number;
      DimZ: number;
      DimY: number;
      DimX: number;
    }[];
    Fronts: {
      Index: number;
      PosX: number;
      PosY: number;
      PosZ: number;
      DimZ: number;
      DimY: number;
      DimX: number;
    }[];
    Spacers: {
      Index: number;
      Side: string;
      SpacerType: string;
      Model3D: undefined | undefined[];
      Color: string;
      PosX: number| number[];
      PosY: number| number[];
      PosZ: number| number[];
      DimX: number| number[];
      DimY: number| number[];
      DimZ: number | number[];
    }[];
  } => ({
    IsComplete: false,
    Drawers: [],
    Fronts: [],
    Spacers: []
  });

  const innerDrawerInfo = createDefaultResult();

  // Variable definition
    let freeSpaceWidth = m.mod_Width;
    let freeSpaceHeight = m.mod_Height;
    let freeSpaceDepth = m.mod_Depth;
    let drawerFrontThickness = 0;
    
    let spacerDistanceLeft = 0;
    let spacerDistanceRight = 0;
    let drawerSpaceWidth = 0;
    let drawerSpaceDepth = 0;
    let drawerSpaceHeight = 0;
    let drawerDepthType = "";
    let layoutStategy = m.mod_InnerDrawerLayoutStrategy;
    let insertionStartHeight = m.mod_InnerDrawerHeightPosition;
    let targetHeight = 0;
    let spacing = 0;
    let drawerBoxHeight = 0;
    let drawerBoxDepth = 0;
    let spacerFrontOffset = 0;
    let spacerLengthLeft = 0;
    let spacerLengthRight = 0;
    let spacerHeightLeft = 0;
    let spacerHeightRight = 0;
    let spacerObjectLeft = "";
    let spacerObjectRight = "";
    let spacer3dModelLeft;
    let spacer3dModelRight;
    let spacerHeightType = "";
    let spacerOffsetY = 0;
    let spacerOffsetZ = 0;
    let frontGapLeft = 0;
  let frontGapRight = 0;
  let hingeType = m.parent.mod_HingeType;
      
  try {
    let doorDirection = m.parent.mod_DoorDirection
    if (doorDirection == "Both") {
      doorDirection = "LeftRight"
    }

    if (hingeType == undefined || doorDirection == undefined) {
      hingeType = "None";
      doorDirection = "None";
    };

    // Get front information from tab_InnerDrawerFrontMapping table
    let innerDrawerFront = GlobalFunc.find_InnerDrawerFrontMapping(m.mod_DrawerBoxDesign, m.mod_DrawerBoxProgram, m.mod_InnerDrawerFrontRule);

    if (!innerDrawerFront) {
      throw new Error('No inner drawer front mapping found.');
    };

    // Get spacer information from tab_InnerDrawerFrontMapping table
    let innerDrawerSpacer = GlobalFunc.find_InnerDrawerSpacerMapping(hingeType, doorDirection, "Inset"/*m.parent.mod_FrontOverlay*/, m.mod_InnerDrawerSpacerRule);
    let spacerModule: string;

    if (!innerDrawerSpacer) {
      throw new Error('No inner drawer spacer mappig found.');
    } else {
      spacerModule = innerDrawerSpacer!.SpacerModule!;
      spacerObjectLeft = innerDrawerSpacer!.ObjectLeft!;
      spacerObjectRight = innerDrawerSpacer!.ObjectRight!;
      frontGapLeft = innerDrawerSpacer!.FrontGapLeft!;
      frontGapRight = innerDrawerSpacer!.FrontGapRight!;
    };

    // Calculate the EffectiveSpace
    if (innerDrawerFront && innerDrawerSpacer) {
      drawerFrontThickness = innerDrawerFront.FrontThickness!
      spacerDistanceLeft = innerDrawerSpacer.DistanceLeft!;
      spacerDistanceRight = innerDrawerSpacer.DistanceRight!;
      drawerSpaceWidth = freeSpaceWidth - spacerDistanceLeft - spacerDistanceRight
      drawerSpaceDepth = freeSpaceDepth - m.mod_InnerDrawerFrontOffset - m.mod_InnerDrawerRearOffset - drawerFrontThickness

      if (layoutStategy == "DefinedGroupHeight") {
        targetHeight = m.mod_InnerDrawerGroupHeight;
        drawerSpaceHeight = (targetHeight - (m.mod_InnerDrawerFrontGapTop + m.mod_InnerDrawerSpacing) * m.mod_InnerDrawerCount) / m.mod_InnerDrawerCount;
      } else if (layoutStategy == "FixedSpacing") {
        targetHeight = freeSpaceHeight - m.mod_InnerDrawerFrontGapTop - (insertionStartHeight - m.mod_FreeSpaceStartPosY);
        drawerSpaceHeight = (targetHeight - (m.mod_InnerDrawerFrontGapTop + m.mod_InnerDrawerSpacing) * m.mod_InnerDrawerCount) / m.mod_InnerDrawerCount;
      } else {
        targetHeight = freeSpaceHeight - m.mod_InnerDrawerFrontGapTop - (insertionStartHeight - m.mod_FreeSpaceStartPosY);
        drawerSpaceHeight = (targetHeight - m.mod_InnerDrawerFrontGapTop * m.mod_InnerDrawerCount) / m.mod_InnerDrawerCount;
      };
    };

    // Calculate available Height for the Drawers
      let drawerSpace = 0;
    if (layoutStategy == "FillAvailableSpace" || layoutStategy == "DefinedGroupHeight") {
      drawerSpace = m.mod_InnerDrawerCount * drawerSpaceHeight
      let freeSpace = targetHeight - drawerSpace

      if (freeSpace < 0) {
        throw new Error('Freespace is to small to insert inner drawer group');
      }; 
        
      if (m.mod_InnerDrawerCount > 1) {
        spacing = freeSpace / (m.mod_InnerDrawerCount - 1);
      };
      } else{
        spacing = m.mod_InnerDrawerSpacing;
    };
      
    //Get spacer construction information
    if (m.mod_InnerDrawerSpacerRule === "ManufacturerBoardSpacer") {

    let spacerConstruction = GlobalFunc.find_SpacerConstruction(spacerModule) 

      if (!spacerConstruction) {
        throw new Error('No spacer construction found.');
      } else {
        spacerFrontOffset = spacerConstruction!.FrontOffset!
        spacerHeightType = spacerConstruction!.HeightType!

        if (spacerConstruction.LengthType == "FixedLength") {
          spacerLengthLeft = spacerConstruction.FixedLength;
          spacerLengthRight = spacerConstruction.FixedLength;
        } else {
          spacerLengthLeft = freeSpaceDepth - m.mod_InnerDrawerFrontOffset - m.mod_InnerDrawerRearOffset - spacerFrontOffset - innerDrawerFront.FrontThickness!
          spacerLengthRight = freeSpaceDepth - m.mod_InnerDrawerFrontOffset - m.mod_InnerDrawerRearOffset - spacerFrontOffset - innerDrawerFront.FrontThickness!
        };

        if (spacerConstruction.HeightType == "FixedHeight") {
          spacerHeightLeft = spacerConstruction.FixedHeight;
          spacerHeightRight = spacerConstruction.FixedHeight;
        } else {
          spacerHeightLeft = drawerSpaceHeight - m.mod_InnerDrawerFrontGapTop - m.mod_InnerDrawerFrontGapBottom;
          spacerHeightRight = drawerSpaceHeight - m.mod_InnerDrawerFrontGapTop - m.mod_InnerDrawerFrontGapBottom;
        };
      }
    } else {

      if (doorDirection == "Left") {
        let objectMappingLeft = GlobalFunc.find_ObjectMapping(spacerObjectLeft)
        let graphicMappingLeft = GlobalFunc.find_GraphicLibraryMapping(objectMappingLeft.GraphicItem!);

      graphicMappingLeft.forEach((Item => {
        let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
        if (retGraphicLib && graphicFile) {
          spacer3dModelLeft = graphicFile.Model3D;
          spacerLengthLeft = retGraphicLib.DimensionZ;
          spacerHeightLeft = retGraphicLib.DimensionY;
          spacerOffsetY = retGraphicLib.InsertionPointY;
          spacerOffsetZ = retGraphicLib.InsertionPointZ;
          }
        })
      )
      } else if (doorDirection == "Right") {
        let objectMappingRight = GlobalFunc.find_ObjectMapping(spacerObjectRight)
        let graphicMappingRight = GlobalFunc.find_GraphicLibraryMapping(objectMappingRight.GraphicItem!);


      graphicMappingRight.forEach((Item => {
        let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
        if (retGraphicLib && graphicFile) {
          spacer3dModelRight = graphicFile.Model3D;
          spacerLengthRight = retGraphicLib.DimensionZ;
          spacerHeightRight = retGraphicLib.DimensionY;
          spacerOffsetY = retGraphicLib.InsertionPointY;
          spacerOffsetZ = retGraphicLib.InsertionPointZ;
          }
        })
      )
      } else {
        let objectMappingLeft = GlobalFunc.find_ObjectMapping(spacerObjectLeft)
        let graphicMappingLeft = GlobalFunc.find_GraphicLibraryMapping(objectMappingLeft.GraphicItem!);

        graphicMappingLeft.forEach((Item => {
          let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
          if (retGraphicLib && graphicFile) {
            spacer3dModelLeft = graphicFile.Model3D;
            spacerLengthLeft = retGraphicLib.DimensionZ;
            spacerHeightLeft = retGraphicLib.DimensionY;
            spacerOffsetY = retGraphicLib.InsertionPointY;
            spacerOffsetZ = retGraphicLib.InsertionPointZ;
          }
        })
        )

        let objectMappingRight = GlobalFunc.find_ObjectMapping(spacerObjectRight)
        let graphicMappingRight = GlobalFunc.find_GraphicLibraryMapping(objectMappingRight.GraphicItem!);


        graphicMappingRight.forEach((Item => {
          let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
          if (retGraphicLib && graphicFile) {
            spacer3dModelRight = graphicFile.Model3D;
            spacerLengthRight = retGraphicLib.DimensionZ;
            spacerHeightRight = retGraphicLib.DimensionY;
          }
        })
        )
      }
    }

    // if (insertionStartHeight + targetHeight > freeSpaceHeight) {
    //   throw new Error('freespace is to small for inner drawer group');
    // };

    // Get DrawerBox information
    //Variable definition
    let dbColor = ""
    let dbHeight = ""
    let dbWeight = ""

    // Calculate color of the box
    if (m.mod_DrawerBoxColor == 'Automatic') {
      dbColor = GlobalFunc.find_DrawerBoxColorMapping(m.mod_HardwareColor).DrawerBoxColor!;
    }
    else {
      dbColor = m.mod_DrawerBoxColor;
    }

    let DimensionInfo = GlobalFunc.find_DrawerBoxDimensionMapping(m.mod_DrawerBoxDesign, m.mod_DrawerBoxProgram, dbColor, drawerSpaceDepth, drawerSpaceHeight)

    if (!DimensionInfo) {
      throw new Error('No DrawerBox dimension mapping found');
    };

    // Calculate depth of the box
    if (m.mod_DrawerBoxDepthType == 'Automatic') {
      drawerDepthType = DimensionInfo.DepthType!;
    }
    else {
      drawerDepthType = m.mod_DrawerBoxDepthType;
    }

    // Calculate height of the box
    if (m.mod_DrawerBoxHeightType == 'Automatic') {
      dbHeight = DimensionInfo.HeightType!;
    }
    else {
      dbHeight = m.mod_DrawerBoxHeightType;
    }

    // Calculate weight of the box, not implemented yet
    if (m.mod_DrawerBoxWeightType == 'Automatic'){
      dbWeight = GlobalFunc.find_DrawerBoxWeightTypeSettings(m.mod_TypeElement, m.mod_FrontWidth, m.mod_FrontHeight, drawerDepthType, dbHeight, m.mod_PartgroupDrawerWeight).DrawerBoxWeightType!;
    }
    else{
    	dbWeight = m.mod_DrawerBoxWeightType;
    }

    //---------------Mapping and reading data from tables---------------

    // DrawerBoxMapping
    let dbObject = GlobalFunc.find_DrawerBoxMapping(m.mod_DrawerBoxDesign, m.mod_DrawerBoxProgram, dbColor, drawerDepthType, dbHeight, "Standard"/*dbWeight*/, "Handle"/*m.mod_OpeningType)*/);
    if (!dbObject) {
      throw new Error('No drawer box mapping found');
    }

    // DrawerBox Construction
    let dbConstruction = GlobalFunc.find_DrawerBoxConstruction(dbObject.ConstructionId!)
    if (!dbConstruction) {
      throw new Error('No information for drawer box construction found');
    };

    if (dbConstruction) {
      drawerBoxHeight = dbConstruction.BlockSpaceHeight;
      drawerBoxDepth = dbConstruction.BlockSpaceDepth;
    }
    
 
    let currentPosition; 

    // Checks if InnerDrawer Group fits into available space or if there is collision between fronts
    if (insertionStartHeight + m.mod_InnerDrawerFrontGapBottom >= 0) {
      currentPosition = insertionStartHeight
    } else if (insertionStartHeight - m.mod_InnerDrawerFrontGapBottom < 0) {
      const errorMessage = GlobalFunc.find_ErrorList('Error 40013', 1);
      logError(errorMessage.Message(' Inner Drawer Group Height position is too short; The bottom front of the inner drawer group collides with the base panel.'));
      return innerDrawerInfo
    } else if (insertionStartHeight < 0) {
      const errorMessage = GlobalFunc.find_ErrorList('Error 40013', 1);
      logError(errorMessage.Message(' The height of the inner drawer unit must not be a negative value'));
      return innerDrawerInfo
    }

    if (m.mod_InnerDrawerFrontGapLeft < 0 || m.mod_InnerDrawerFrontGapRight < 0) {
      const errorMessage = GlobalFunc.find_ErrorList('Error 40013', 1);
      logError(errorMessage.Message(' The width of the drawer front is greater than the width of the freespace — Check the gap settings'));
      return innerDrawerInfo
    }
    
   // Calculate Inner Drawers:
    for (let i = 0; i < m.mod_InnerDrawerCount; i++) {

      // Add drawer information
      let drawerPosX;

      if (doorDirection == "Right") {
        drawerPosX = freeSpaceWidth - drawerSpaceWidth / 2 - spacerDistanceRight;
      } else {
        drawerPosX = drawerSpaceWidth / 2 + spacerDistanceLeft;
      };

      let spacerPosY;
      if (spacerHeightType == "FrontHeight") {
        spacerPosY = currentPosition + m.mod_InnerDrawerFrontGapBottom
      } else {
        spacerPosY = currentPosition
      }
      

      const drawer = {
        Index: i,
        ConstructionId: dbObject.ConstructionId!,
        DepthType: drawerDepthType,
        HeightType: dbHeight,
        PosX: drawerPosX,
        PosY: currentPosition,
        PosZ: freeSpaceDepth - m.mod_InnerDrawerFrontOffset - drawerFrontThickness,
        DimZ: drawerBoxDepth,
        DimY: drawerBoxHeight,
        DimX: drawerSpaceWidth,
      };
      innerDrawerInfo.Drawers.push(drawer)

      // Add front information
      
      const front = {
        Index: i,
        PosX: frontGapLeft,
        PosY: currentPosition + m.mod_InnerDrawerFrontGapBottom,
        PosZ: freeSpaceDepth - m.mod_InnerDrawerFrontOffset - drawerFrontThickness,
        DimZ: drawerFrontThickness,
        DimY: drawerSpaceHeight ,
        DimX: freeSpaceWidth - frontGapLeft - frontGapRight,
      }

      const newStart = front.PosY;
      const newEnd = newStart + front.DimY ;
      
      for (let j = 0; j < innerDrawerInfo.Fronts.length; j++) {
        const existing = innerDrawerInfo.Fronts[j];
        const existStart = existing.PosY;
        const existEnd = existing.PosY + existing.DimY ;

        if (!(newEnd <= existStart || newStart >= existEnd)) {
          // Gefundene Überschneidung: hier kannst du anpassen, was passieren soll
   	    const errorMessage = GlobalFunc.find_ErrorList('Error 40013', 1);
        logError(errorMessage.Message(" Collision Between Two Fronts  -  Check the Gap Settings"));
        return innerDrawerInfo;
        }
      }

      innerDrawerInfo.Fronts.push(front)

      // add spacer information

      if (doorDirection == "Left") {
        const spacer = {
          Index: i,
          Side: "Left",
          SpacerType: m.mod_InnerDrawerSpacerRule,
          Model3D: spacer3dModelLeft,
          Color: "",
          PosX: 0,
          PosY: spacerPosY + spacerOffsetY,
          PosZ: freeSpaceDepth - drawerFrontThickness - m.mod_InnerDrawerFrontOffset - spacerLengthLeft - spacerFrontOffset + spacerOffsetZ,
          DimX: spacerDistanceLeft,
          DimY: spacerHeightLeft,
          DimZ: spacerLengthLeft,
        }
        innerDrawerInfo.Spacers.push(spacer)
      } else if (doorDirection == "Right") {
        const spacer = {
          Index: i,
          Side: "Right",
          SpacerType: m.mod_InnerDrawerSpacerRule,
          Model3D: spacer3dModelRight,
          Color: "",
          PosX: freeSpaceWidth - spacerDistanceRight,
          PosY: spacerPosY + spacerOffsetY,
          PosZ: freeSpaceDepth - drawerFrontThickness - m.mod_InnerDrawerFrontOffset - spacerLengthRight - spacerFrontOffset + spacerOffsetZ,
          DimX: spacerDistanceRight,
          DimY: spacerHeightRight,
          DimZ: spacerLengthRight,
        }
        innerDrawerInfo.Spacers.push(spacer)
      } else if (doorDirection == "LeftRight") {
        const spacer = {
          Index: i,
          Side: "LeftRight",
          SpacerType: m.mod_InnerDrawerSpacerRule,
          Model3D: [spacer3dModelLeft, spacer3dModelRight],
          Color: "",
          PosX: [0, freeSpaceWidth - spacerDistanceRight],
          PosY: [spacerPosY + spacerOffsetY, spacerPosY + spacerOffsetY],
          PosZ: [freeSpaceDepth - drawerFrontThickness - m.mod_InnerDrawerFrontOffset - spacerLengthLeft - spacerFrontOffset + spacerOffsetZ,
                freeSpaceDepth - drawerFrontThickness - m.mod_InnerDrawerFrontOffset - spacerLengthRight - spacerFrontOffset + spacerOffsetZ],
          DimX: [spacerDistanceLeft, spacerDistanceRight],
          DimY: [spacerHeightLeft, spacerHeightRight],
          DimZ: [spacerLengthLeft, spacerLengthRight],
        }
        innerDrawerInfo.Spacers.push(spacer)

      }
      currentPosition += drawerSpaceHeight + spacing
    };

    /// Errors
  } catch (error) {

	let text = '';
	if (error instanceof Error) {
		text = error.message;
	} 
	else if (typeof error === 'string') {
		text = error;
	}
	  const errorMessage = GlobalFunc.find_ErrorList('Error 40013', 1);
	  logError(errorMessage.Message(text));
    return innerDrawerInfo;
  }


  innerDrawerInfo.IsComplete = true;
  return innerDrawerInfo;
}