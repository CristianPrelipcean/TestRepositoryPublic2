  logInfo("adjust with success from group orchestrator.");
  const newArticle = this.createArticle('tests');
  if (newArticle) {
    this.addRoots(newArticle);

    let r1 = newArticle[0].root;
    if (r1 instanceof OD_M_shape01) {
      r1.height = 1548;
    }

    //this.addDocking(this.roots[0].root, Dock.LeftBottom, r1, Dock.RightBottom);
    this.addDocking(this.roots[0].root, Dock.LeftBottom, r1, Dock.RightBottom, DockMode.StartStart, [0, 500, 0], 0);
  }
  else {
    logError("article not found");
  }
