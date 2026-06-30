getAllTotalPrice(item: OM.Base): number | undefined {
    const prices: OM.Price[] = [];
    function traverse(item2?: OM.Base) {
      if (item2 instanceof OM.Price && item2.priceType === OM.PriceTypeEnum.Total) {
        prices.push(item2);
        return;  // We do not have parts inside parts
      }
      if (item2?.items) {
        for (const child of item2.items) {
          traverse(child);
        }
      }
    }
    traverse(item);
    if (prices.length === 0) {
      return undefined;
    }
    return prices.reduce((sum, price) => sum + (price.totalPrice ?? 0), 0);
  }