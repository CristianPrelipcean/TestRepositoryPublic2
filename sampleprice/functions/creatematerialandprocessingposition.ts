createMaterialAndProcessingPosition(idPos: OM.Position, orderData: OM.OrderDetails, g: IGlobalVars): void {
    idPos.items ??= [];
    // get the results
    const boards = idPos.items.filter(item => item instanceof OM.Board && item.type === "Board") as OM.Board[];
    const edgeBands = idPos.items.filter(item => item instanceof OM.EdgeBand) as OM.EdgeBand[];
    const offcuts = idPos.items.filter(item => item instanceof OM.Offcut) as OM.Offcut[];
    logInfo(`intelliDivide data found: ${boards.length} boards, ${edgeBands.length} edge bands, ${offcuts.length} offcuts.`);

    // Create a new group for the boards as PricePositions
    if (boards.length > 0) {
      var boardsGrp = new OM.Group();
      orderData.items.push(boardsGrp);
      boardsGrp.name = "Boards";
      boardsGrp.groupType = OM.GroupTypeEnum.OptimizationBoards;
      boardsGrp.items = [];

      // Map the boards to a price position
      for (const board of boards) {
        var pos = new OM.Position();
        boardsGrp.items.push(pos);
        pos.positionType = OM.PositionTypeEnum.PriceGenerated;
        pos.name = board.material;
        pos.width = board.length;
        pos.depth = board.width;
        pos.height = board.thickness;
        pos.quantity = board.quantity;
        // Add the price item
        let price = new OM.Price();
        price.currency = g.basicCurrency;
        price.unitPrice = ((board.length ?? 1) * (board.width ?? 1)) / 1000;
        price.totalPrice = price.unitPrice * board.quantity;
        price.priceType = OM.PriceTypeEnum.Total;
        pos.items = [price];
      }
    }

    if (edgeBands.length > 0 && orderData.includeEdgeBands === true) {
      var edgeBandsGrp = new OM.Group();
      orderData.items.push(edgeBandsGrp);
      edgeBandsGrp.name = "Edge Bands";
      edgeBandsGrp.groupType = OM.GroupTypeEnum.OptimizationEdgeBands;
      edgeBandsGrp.items = [];

      // Map the edge bands to a price position
      for (const edgeBand of edgeBands) {
        var pos = new OM.Position();
        edgeBandsGrp.items.push(pos);
        pos.positionType = OM.PositionTypeEnum.PriceGenerated;
        pos.name = edgeBand.material;
        pos.width = edgeBand.length;
        pos.depth = edgeBand.thickness;
        pos.height = edgeBand.height;
        pos.quantity = edgeBand.coilQuantity ?? 1;
        // Add the price item
        let price = new OM.Price();
        price.currency = g.basicCurrency;
        price.unitPrice = (edgeBand.length ?? 1) / 1000;
        price.totalPrice = price.unitPrice * (edgeBand.coilQuantity ?? 1);
        price.priceType = OM.PriceTypeEnum.Total;
        pos.items = [price];
      }
    }

    if (offcuts.length > 0 && orderData.includeOffcuts === true) {
      var offcutGrp = new OM.Group();
      orderData.items.push(offcutGrp);
      offcutGrp.name = "Offcuts";
      offcutGrp.groupType = OM.GroupTypeEnum.OptimizationOffcuts;
      offcutGrp.items = [];

      // Map the offcuts to a price position
      for (const offcut of offcuts) {
        var pos = new OM.Position();
        offcutGrp.items.push(pos);
        pos.positionType = OM.PositionTypeEnum.PriceGenerated;
        pos.name = offcut.material;
        pos.width = offcut.length;
        pos.depth = offcut.thickness;
        pos.quantity = offcut.quantity;
      }
    }
  }