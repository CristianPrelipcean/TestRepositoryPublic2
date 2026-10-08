process_FillerHardware(m: parent, Width: number, Height: number, WidthPos:number, HeightPos: number, FrontOrientation: string) {

  //====================================================================
  // Initialize variables
  //====================================================================
  interface iFillerHardwareInfo {
    Object: string[];
    ConnectionSide: string[];
    PosY: number[];
    PosX: number[];
    HardwareItem: string[];
	  ProcessingItem: string[];
	  GraphicItem: string[];
  }

  let fillerHardwareInfo: iFillerHardwareInfo = {
    Object: [],
    ConnectionSide: [],
    PosY: [],
    PosX: [],
    HardwareItem: [],
	  ProcessingItem: [],
    GraphicItem: []
  };

  //====================================================================
  // Calculate FrontOverlay
  //====================================================================

  let frontOverlay = GlobalFunc.calc_FrontOverlay(m, Width, Height, WidthPos, HeightPos, FrontOrientation);

  //====================================================================
  // Get FillerHardwareSettings
  //====================================================================

  let fillerHardwareSettings = GlobalFunc.find_FillerHardwareSettings(m.mod_TypeElement, m.mod_FillerType, m.mod_FillerHardware, Height, Width, m.mod_FingergripTopType, m.mod_FingergripBtmType);

  //====================================================================
  // forEach fillerHardwareSettings calculate output
  //====================================================================

  fillerHardwareSettings.forEach(fillerHardwareSetting => {

    //====================================================================
    // Identify Vertical or Horizontal connection and validate overlay
    //====================================================================
    let connectionLength = 0;
    let connectionSide = '';
    let validOverlay = false;
    if (fillerHardwareSetting.ObjectFrontPosition == 'Side') {
      if (m.mod_Direction == 'Right') {
        connectionLength = frontOverlay.RightThk ? Height : 0;
        connectionSide = 'Right';
        validOverlay = frontOverlay.RightThk ? true : false;
      }
      else if (m.mod_Direction == 'Left') {
        connectionLength = frontOverlay.LeftThk ? Height : 0;
        connectionSide = 'Left';
        validOverlay = frontOverlay.LeftThk ? true : false;
      }
    }
    else if (fillerHardwareSetting.ObjectFrontPosition == 'Top') {
      connectionLength = frontOverlay.TopThk ? Width : 0;
      connectionSide = 'Top';
      validOverlay = frontOverlay.TopThk ? true : false;
    }
    else if (fillerHardwareSetting.ObjectFrontPosition == 'Btm') {
      connectionLength = frontOverlay.BottomThk ? Width : 0;
      connectionSide = 'Btm';
      validOverlay = frontOverlay.BottomThk ? true : false;
    }

 
    if (validOverlay) {

      //====================================================================
      // Process Descriptor
      //====================================================================

      let descriptorPositions = GlobalFunc.process_Descriptor(fillerHardwareSetting.Descriptor!, connectionLength);

      descriptorPositions.forEach(descriptorPosition => {
        fillerHardwareInfo.Object.push(fillerHardwareSetting.Object!);
        fillerHardwareInfo.ConnectionSide.push(connectionSide);
        let hardwareObjectInfo = GlobalFunc.find_ObjectMapping(fillerHardwareSetting.Object!)
        
		    fillerHardwareInfo.HardwareItem.push(hardwareObjectInfo.HardwareItem!);
		    fillerHardwareInfo.ProcessingItem.push(hardwareObjectInfo.ProcessingItem!);
        fillerHardwareInfo.GraphicItem.push(hardwareObjectInfo.GraphicItem!);
		
        switch (connectionSide) {
          case 'Right':
            fillerHardwareInfo.PosY.push(descriptorPosition);
            fillerHardwareInfo.PosX.push(fillerHardwareSetting.ObjectInsertionReference == 'PartShortInside' ? Width - frontOverlay.Right! : Width - frontOverlay.Right! + frontOverlay.RightThk! / 2);
            break;
          case 'Left':
            fillerHardwareInfo.PosY.push(descriptorPosition);
            fillerHardwareInfo.PosX.push(fillerHardwareSetting.ObjectInsertionReference == 'PartShortInside' ? frontOverlay.Left! : frontOverlay.Left! - frontOverlay.LeftThk! / 2);
            break
          case 'Top':
            fillerHardwareInfo.PosY.push(fillerHardwareSetting.ObjectInsertionReference == 'PartShortInside' ? Height - frontOverlay.Top! : Height - frontOverlay.Top! + frontOverlay.TopThk! / 2);
            fillerHardwareInfo.PosX.push(descriptorPosition);
            break
          case 'Btm':
            fillerHardwareInfo.PosY.push(fillerHardwareSetting.ObjectInsertionReference == 'PartShortInside' ? frontOverlay.Bottom! : frontOverlay.Bottom! - frontOverlay.BottomThk! / 2);
            fillerHardwareInfo.PosX.push(descriptorPosition);
            break
        }
      })
    }
  })




  return fillerHardwareInfo;
}