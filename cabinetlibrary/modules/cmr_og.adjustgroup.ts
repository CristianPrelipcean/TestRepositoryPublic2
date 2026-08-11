  logInfo("adjust with success from group orchestrator.");

  // const articleName = "basic_Cabinet_006_fix_errors";
  const articleName1 = "basic_Cabinet_007";
  const articleName2 = "basic_Cabinet_008";
  const articleName3 = "basic_Cabinet_009";
  const thisRoot = this.roots[0].root;

  const newArticle = this.createArticle(articleName1);
  if (newArticle) {
    this.addRoots(newArticle);

    let r1 = newArticle[0].root;
    if (r1 instanceof OD_M_mr_StorageunitSingle) {
      r1.mod_Height = 900; // default is 850
    }

    // dock on the wall
    this.addDocking(thisRoot, Dock.RightTop, r1, Dock.LeftTop, DockMode.StartEnd, [0, 1500, 0], 0);
  }
  else {
    logError("Article does not exist!!! " + articleName1);
  }

  const newArticle2 = this.createArticle(articleName2);
  if (newArticle2) {
    this.addRoots(newArticle2);

    let r2 = newArticle2[0].root;

    // dock on the wall
    this.addDocking(thisRoot, Dock.LeftTop, r2, Dock.LeftTop, DockMode.StartStart, [0, 1500, 0], 0);
  }
  else {
    logError("Article does not exist!!! " + articleName2);
  }

  const newArticle3 = this.createArticle(articleName3);
  if (newArticle3) {
    this.addRoots(newArticle3);

    let r3 = newArticle3[0].root;

    // dock on the floor
    this.addDocking(thisRoot, Dock.RightBottom, r3, Dock.LeftBottom, DockMode.EndEnd, [0, 0, 0], 0);
  }
  else {
    logError("Article does not exist!!! " + articleName3);
  }