addPriceFromTable(pos: OM.Position, g: IGlobalVars): boolean {
    // Returns true, if a price was added
    // Try to find the article in the article list, if yes, then add the price directly
    if (pos.articleNumber) {
      const articlePrice = ct_tabArticlePrices.filter(a => a.in_ArticleId === pos.articleNumber);
      if (articlePrice.length > 0) {
        let p = new OM.Price();
        p.currency = g.basicCurrency;
        p.unitPrice = articlePrice[0].Price;
        p.totalPrice = p.unitPrice * pos.quantity;
        p.priceType = OM.PriceTypeEnum.Total;
        pos.items ??= [];
        pos.items.push(p);
        return true;
      }
    }
  return false;
}