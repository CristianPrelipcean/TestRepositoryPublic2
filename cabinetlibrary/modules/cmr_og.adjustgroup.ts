  logInfo("adjust with success from group orchestrator.");

  let lastDockedRoot = this.roots[0].root;
  const newArticle = this.createArticle('basic_Cabinet_006_fix_errors');
  if (newArticle) {
    this.addRoots(newArticle);

    let r1 = newArticle[0].root;
    // if (r1 instanceof OD_M_mr_StorageunitSingle) {

    // }

    // dock on the wall
    this.addDocking(lastDockedRoot, Dock.RightTop, r1, Dock.LeftTop, DockMode.StartStart, [0, 1500, 0], 0);
  }

  const newArticle2 = this.createArticle('basic_Cabinet_006_fix_errors');
  if (newArticle2) {
    this.addRoots(newArticle2);

    let r2 = newArticle2[0].root;
    // if (r2 instanceof OD_M_mr_StorageunitSingle) {

    // }

    // dock on the floor
    this.addDocking(lastDockedRoot, Dock.RightBottom, r2, Dock.LeftBottom, DockMode.StartStart, [0, 0, 0], 0);
  }