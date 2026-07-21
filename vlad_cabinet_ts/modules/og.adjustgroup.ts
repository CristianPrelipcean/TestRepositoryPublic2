  logInfo("adjust with success from group orchestrator.");

  let lastDockedRoot = this.roots[0].root;

  for (let i = 0; i < 4; i++){
    const newArticle = this.createArticle('lilcab');
    if (newArticle) {
      this.addRoots(newArticle);

      let r1 = newArticle[0].root;
      // if (r1 instanceof OD_M_shape01) {
      //   r1.height = 640;
      // }

      //this.addDocking(this.roots[0].root, Dock.LeftBottom, r1, Dock.RightBottom);
      if (i % 2 === 0) {
        // dock on the floor
        this.addDocking(lastDockedRoot, Dock.LeftBottom, r1, Dock.RightBottom, DockMode.EndStart, [600 * i, 0, 0], 0);
      }
      else {
        // dock on the wall
        this.addDocking(lastDockedRoot, Dock.LeftTop, r1, Dock.RightTop, DockMode.EndStart, [ 600 * i, 1800, 0], 0);
        lastDockedRoot = r1;
      }
      
    }
    else {
      logError("article not found");
    }
  }

  
