process_StorageunitLightConstruction(m: parent, retTop: any, retBtm: any) {

  let librarySolution = true;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    // We only have Led's if the System is different from NoLight
    if (m.mod_LightSystem != 'NoLight') {
      let lightPartPosHeight: number = 0; //Position in Height of the part that receives the Light
      let lightPartPosWidth: number = 0; //Position in Width of the part that receives the Light
      let lightPartWidth: number = 0; //Width of the part that receives the Light

      // Get the positions of the TopShelf or BottomShelf to apply the Light's
      if (m.mod_LightPart == 'TopShelf') {
        lightPartPosHeight = retTop.HeightPos;
        lightPartPosWidth = retTop.WidthPos;
        lightPartWidth = retTop.Width;
      }
      else if (m.mod_LightPart == 'BottomShelf') {
        lightPartPosHeight = retBtm.HeightPos;
        lightPartPosWidth = retBtm.WidthPos;
        lightPartWidth = retBtm.Width;
      }
      else {
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 22018', 1);
        logError(ErrorMessage.Message(''));
      }

      let lightArray: number[] = [];
      if (m.mod_LightPosX != "FreePosition") {
        lightArray = GlobalFunc.process_Descriptor(m.mod_LightPosX_matrix.Descriptor!, m.mod_CarcaseWidth); // Process Descriptor into multiple positions
      }
      else {
        if (m.mod_LightPosX1! != 0) { lightArray[0] = m.mod_LightPosX1! };
        if (m.mod_LightPosX2! != 0) { lightArray[1] = m.mod_LightPosX2! };
        if (m.mod_LightPosX3! != 0) { lightArray[2] = m.mod_LightPosX3! };
        if (m.mod_LightPosX4! != 0) { lightArray[3] = m.mod_LightPosX4! };
        if (m.mod_LightPosX5! != 0) { lightArray[4] = m.mod_LightPosX5! };
      }
      let l: number = 0;

      if (m.mod_LightSystem_matrix.Length != 0) // It's like a Spot
      {
        while (l < lightArray.length) //Do a While and insert multiple Lights of type Spot
        {

          // Add the module
          let LightSystem = m.addOD_M_mc_LightSystem01();
          // Set values to the attributes of the child
          LightSystem.mod_Height = m.mod_LightSystem_matrix.Depth;
          LightSystem.mod_Depth = m.mod_LightSystem_matrix.Width;
          LightSystem.mod_Width = m.mod_LightSystem_matrix.Length;
          // setOrigin
          LightSystem.setOrigin(lightArray[l] - m.mod_LightSystem_matrix.Width / 2, lightPartPosHeight, m.mod_CarcaseDepth - m.mod_LightSystem_matrix.Width / 2 - m.mod_LightPosY);
          l++
        }
      }
      else // It's like a Led Strip
      {
        let minPosition: number = lightArray[0] 					// Start Position of LedStrip
        let maxPosition: number = lightArray[lightArray.length - 1] 	// Final Position of LedStrip
        // Add the module
        let LightSystem = m.addOD_M_mc_LightSystem01();
        // Set values to the attributes of the child
        LightSystem.mod_Height = m.mod_LightSystem_matrix.Depth;
        LightSystem.mod_Depth = m.mod_LightSystem_matrix.Width;
        let minInsertPointX: number = 0;
        if (lightPartWidth > maxPosition - minPosition) {
          LightSystem.mod_Width = maxPosition - minPosition;
          minInsertPointX = minPosition;
        }
        else {
          LightSystem.mod_Width = lightPartWidth;
          minInsertPointX = lightPartPosWidth;
        }

        // setOrigin
        LightSystem.setOrigin(minInsertPointX, lightPartPosHeight, m.mod_CarcaseDepth - m.mod_LightSystem_matrix.Width / 2 - m.mod_LightPosY);
      }
    }
  }

  //##########################################################################################
  // Custom solutions (User Exit)
  //##########################################################################################

  else {


  }
}