  if (!this.orderData) {
    logError("Order data is missing!");
    return;
  }

  let allPartsToOptimize: OM.Part[] = [];
  let needsBOMData = false;

  let groups = GlobalFunc.getAllGroups(this.orderData!);
  for (const grp of groups) {
    const positions = GlobalFunc.getAllPositions(grp);

    // check if we have already the BOM data present...
    for (const pos of positions) {
      // Only expect ConfigurationPositions here
      if (pos instanceof OM.ConfigurationPosition) {
        // Check if this position needs really BOM or if it can be calculated directly
        if (GlobalFunc.addPriceFromTable(pos, this.g) === true) {
          // We have already the price data without needing BOM data
          continue;
        }

        // Check if we need BOM data or intelliDivide data
        if (this.g.basicNeedsBOM || this.g.basicNeedsID) {
          const parts = GlobalFunc.getAllParts(pos);
          if (parts.length === 0) {
            logWarning("We need BOM data to calculate prices correctly.");
            needsBOMData = true;
            continue;
          }

          if (this.g.basicNeedsID) {
            // Add the parts to the list
            allPartsToOptimize = allPartsToOptimize.concat(parts);
          }
        }
      }
    }

    if (needsBOMData === true) {
      grp.needsBOMData = true;
      // Skip further processing and wait until BOM data is available
      continue;
    }
  }  // foreach groups

  if (needsBOMData === true) {
    return;  // wait for BOM data
  }

  // Check if we need intelliDivide or if we have the data already
  if (this.g.basicNeedsID && allPartsToOptimize.length > 0) {
    // Check if we have already the intelliDivide data present...
    const materialAndProcessingPosition = GlobalFunc.getMaterialAndProcessingPosition(this.orderData);
    if (!materialAndProcessingPosition) {
      // Return a new Group with the MaterialAndProcessing position
      var idGrp = new OM.Group();
      this.orderData.items.push(idGrp);
      idGrp.id = uuidv4();
      idGrp.name = "Material & Processing";
      const idPos = new OM.Position();
      idGrp.items.push(idPos);
      idPos.id = uuidv4();
      idPos.isHidden = true;
      idPos.name = "Material & Processing";
      idPos.positionType = OM.PositionTypeEnum.MaterialAndProcessing;

      // Add all the parts
      idPos.items ??= [];
      idPos.items = idPos.items.concat(allPartsToOptimize);

      // We need to wait for the next run to have the data available
      logInfo(`intelliDivide data is missing, added Material & Processing position (${allPartsToOptimize.length} parts).`);
      return;
    }

    // Check if we have error messages from intelliDivide and log them
    const idMessages = materialAndProcessingPosition.items?.filter(item => item instanceof OM.ErrorInfo) as OM.ErrorInfo[] | undefined;
    if (idMessages && idMessages.length > 0) {
      for (const msg of idMessages) {
        if (msg.category === "Error" || msg.category === "Fatal") {
          logError(`intelliDivide error: ${msg.text}`);
        } else if (msg.category === "Warning") {
          logWarning(`intelliDivide warning: ${msg.text}`);
        } else {
          logInfo(`intelliDivide info: ${msg.text}`);
        }
      }

      // We cannot calculate an accurate price if we have errors from intelliDivide, so we stop here and wait until the errors are resolved

      // We can still generate the position numbers...
      GlobalFunc.generatePositionNumbers(this.orderData!, this.g);
      return;
    }

    // Create positions based on the data from intelliDivide
    GlobalFunc.createMaterialAndProcessingPosition(materialAndProcessingPosition, this.orderData, this.g);
  } else {
    // Calculate the prices for all positions where we do not needintelliDivide data

    let priceFactor = 1.0;  // by default we take the normal price
    if (this.g.basicNeedsBOM) {
      // Use the new price factor if we need BOM data
      priceFactor = this.g.basicBOMPriceFactor;
    }

    let groups = GlobalFunc.getAllGroups(this.orderData!);
    for (const grp of groups) {
      const positions = GlobalFunc.getAllPositions(grp);

      // check if we have already the BOM data present...
      for (const pos of positions) {
        // Only expect ConfigurationPositions here
        if (pos instanceof OM.ConfigurationPosition) {
          if (GlobalFunc.addPriceFromTable(pos, this.g) !== true) {
            // Create a fallback price
            GlobalFunc.addPriceForPosition(pos, this.g, priceFactor);
          }
        }
      }
    }
  }

  // Generate the position numbers for all positions (also the ones we have generated now)
  GlobalFunc.generatePositionNumbers(this.orderData!, this.g);

  // Calculate the group prices and the total price for the order
  GlobalFunc.calculateFinalPrices(this.orderData!, this.g);