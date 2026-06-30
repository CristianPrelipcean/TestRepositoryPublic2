getAllParts(item: OM.Base): OM.Part[] {
    const parts: OM.Part[] = [];
    function traverse(item2?: OM.Base) {
      if (item2 instanceof OM.Part) {
        parts.push(item2);
        return;  // We do not have parts inside parts
      }
      if (item2?.items) {
        for (const child of item2.items) {
          traverse(child);
        }
      }
    }
    traverse(item);
    return parts;
  }