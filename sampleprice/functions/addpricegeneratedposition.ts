addPriceGeneratedPosition(parent: OM.Base, afterItem: OM.Base, g: IGlobalVars): void {
  // ======================================================
  // Helper to insert the subposition in the correct order
  // ======================================================
  function insertAfterItem(parent: OM.Base, afterItem: OM.Base, newItem: OM.Base): void {
    function traverse(item2?: OM.Base) {
      if (item2?.items) {
        for (const child of item2.items) {
          if (child === afterItem) {
            const index = item2.items.indexOf(afterItem);
            item2.items.splice(index + 1, 0, newItem);
            return;
          }
          traverse(child);
        }
      }
    }

    traverse(parent);
  }

  const insertPos = new OM.Position();
  insertPos.id = uuidv4();
  insertPos.articleNumber = "Bonding";
  insertPos.notes = "Bonding information for the above article."
  insertPos.quantity = 1;
  insertPos.positionType = OM.PositionTypeEnum.PriceGenerated;
  insertPos.attributes = [{
    name: "priceattribute",
    value: "pricevalue",
    displayName: "PriceDisplayName",
    displayValue: "PriceDisplayValue",
    category: "PriceAttributes",
    isInput: true
  } ]

  // Insert into correct position after the article
  insertAfterItem(parent, afterItem, insertPos);

  // Add price row to the insert position
  const priceItem = new OM.Price();
  priceItem.priceType = OM.PriceTypeEnum.Total;
  priceItem.currency = g.basicCurrency;
  priceItem.unitPrice = g.basicFallbackPrice / 5;
  priceItem.totalPrice = priceItem.unitPrice * insertPos.quantity;

  insertPos.items.push(priceItem);
}