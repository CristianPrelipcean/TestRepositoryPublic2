getAllGroups(item: OM.Base): OM.Group[] {
    const groups: OM.Group[] = [];
    function traverse(item2?: OM.Base) {
      if (item2 instanceof OM.Group) {
        groups.push(item2);
        return;  // We do not have groups inside groups
      }
      if (item2?.items) {
        for (const child of item2.items) {
          traverse(child);
        }
      }
    }
    traverse(item);
    return groups;
  }