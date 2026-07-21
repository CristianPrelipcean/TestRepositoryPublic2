  logInfo("adjust with success from group orchestrator.");

  let lastDockedRoot = this.roots[0].root;

  // for (let i = 1; i <= 4; i++) {
    const newArticle = this.createArticle('lilcab');
    if (newArticle) {
      this.addRoots(newArticle);

      let r1 = newArticle[0].root;
      if (r1 instanceof OD_M_shape01) {
        r1.generateWorktop = false;
        r1.height = 640;
      }

      // dock on the floor
      this.addDocking(lastDockedRoot, Dock.RightBottom, r1, Dock.LeftBottom, DockMode.StartStart, [600, 0, 0], 0);

      // lastDockedRoot = r1;
    }

    const newArticle2 = this.createArticle('lilcab');
    if (newArticle2) {
      this.addRoots(newArticle2);

      let r2 = newArticle2[0].root;
      if (r2 instanceof OD_M_shape01) {
        r2.generateWorktop = false;
        r2.height = 640;
      }

      // dock on the wall
      this.addDocking(lastDockedRoot, Dock.LeftTop, r2, Dock.RightTop, DockMode.StartStart, [600, 1800, 0], 0);
    }
  // }