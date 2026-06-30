addPriceForPosition(pos: OM.Position, g: IGlobalVars, priceFactor: number): boolean {
    // Returns true, if a price was added
    function extractNumberFromString(input: string): number {
      // Remove all non-digit characters from the string
      const digitsOnly = input.replace(/\D/g, '');
      // Convert the resulting string to a number
      const result = Number(digitsOnly);
      // Return the number (or NaN if no digits were found)
      return isNaN(result) ? 0 : result;
  }
    
    let price = extractNumberFromString(pos.articleNumber ?? '');
    if (price === 0) {
      price = g.basicFallbackPrice;
    }
    // Add the price to the position
    let p = new OM.Price();
    p.currency = g.basicCurrency;
    p.unitPrice = price * priceFactor;
    p.totalPrice = p.unitPrice * pos.quantity;
    p.priceType = OM.PriceTypeEnum.Total;
    pos.items ??= [];
    pos.items.push(p);

  return true;
}