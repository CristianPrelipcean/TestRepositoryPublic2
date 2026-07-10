calculateFinalPrices(orderData: OM.OrderDetails, g: IGlobalVars): void {
  // Calculate the group prices
  let orderTotalPrice: number = 0;
  const groups = GlobalFunc.getAllGroups(orderData);
  let error: OM.ErrorInfo = {
    text: "Bogdan error test",
    category: "Error",
    items: [],
    type: OM.TypeEnum.ErrorInfoType
  }

  // orderData.items.push(error)


  for (const grp of groups) {
    const totalPrice = GlobalFunc.getAllTotalPrice(grp);
    if (totalPrice) {
      let grpTotalPrice = new OM.Price();
      grpTotalPrice.priceType = OM.PriceTypeEnum.Total;
      grpTotalPrice.currency = g.basicCurrency;
      grpTotalPrice.totalPrice = totalPrice;
      grp.items.push(grpTotalPrice);

      orderTotalPrice += totalPrice;
    }
  }

  // Add order total price
  if (orderTotalPrice > 0) {
    let netTotalPrice = new OM.Price();
    netTotalPrice.priceType = OM.PriceTypeEnum.NetTotal;
    netTotalPrice.totalPrice = orderTotalPrice;
    netTotalPrice.currency = g.basicCurrency;
    orderData.items.push(netTotalPrice);
  }

  // Add shipping costs
  if (g.basicShippingCosts > 0) {
    orderTotalPrice += g.basicShippingCosts;
    let shippingPrice = new OM.Price();
    shippingPrice.priceType = OM.PriceTypeEnum.Shipping;
    shippingPrice.totalPrice = g.basicShippingCosts;
    shippingPrice.currency = g.basicCurrency;
    orderData.items.push(shippingPrice);
  }

  if (g.basicTaxRate > 0 && orderTotalPrice > 0) {
    const taxAmount = orderTotalPrice * (g.basicTaxRate / 100);
    orderTotalPrice += taxAmount;

    let taxPrice = new OM.Price();
    taxPrice.priceType = OM.PriceTypeEnum.Tax;
    taxPrice.totalPrice = taxAmount;
    taxPrice.currency = g.basicCurrency;
    taxPrice.notes = `${g.basicTaxRate}%`;
    orderData.items.push(taxPrice);
  }

  // Add total price
  if (orderTotalPrice > 0) {
    let totalPrice = new OM.Price();
    totalPrice.priceType = OM.PriceTypeEnum.Total;
    totalPrice.totalPrice = orderTotalPrice;
    totalPrice.currency = g.basicCurrency;
    orderData.items.push(totalPrice);
  }
}