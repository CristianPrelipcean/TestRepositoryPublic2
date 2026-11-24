const order: { items?: unknown; Items?: unknown } = od;
const items = order.items ?? order.Items;
const pendingItems = Array.isArray(items) ? [...items] : [];
while (pendingItems.length > 0) {
  const item = pendingItems.pop();
  if (item === null || typeof item !== "object") continue;

  const children = item.items ?? item.Items;
  if (Array.isArray(children)) {
    for (const child of children) pendingItems.push(child);
  }

  const type = item.type ?? item.Type;
  const attachments = item.additionalData ?? item.AdditionalData;
  if ((type !== "Part" && type !== "Board") || !Array.isArray(attachments)) continue;
  for (const attachment of attachments) {
    if (attachment === null || typeof attachment !== "object") continue;
    const categoryKey = "category" in attachment ? "category" : "Category";
    if (attachment[categoryKey] === "SVG") attachment[categoryKey] = "PartDrawing";
  }
}

this.createFileEntry(result, "order-data.json", JSON.stringify(od, null, 2), "application/json");
