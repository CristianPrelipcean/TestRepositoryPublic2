
  let targetCount = this.mod_ArticleCount;
  if (targetCount > 15) {
    targetCount = 15;
  }
  if (this.roots.length <= 0) {
    logError("At least one root is needed!");
    return;
  }
  if (this.roots.length >= targetCount) {
    // remove too much elements
    this.roots.splice(targetCount);
    // Seal is needed, so roomle gets the docking vectors also in this result and need not to call it twice...
    this.roots.forEach(root => {
      if (root.root) {
        // TODO: Check if all modules have the seal method
        root.root.seal();
      }
    });
    return;
  }

  const articles = ["DMF_BottomUnit_001", "DMF_BottomUnit_002", "DMF_BottomUnit_003", "DMF_BottomUnit_004", "DMF_BottomUnit_005", "DMF_BottomUnit_006", "DMF_BottomUnit_007", "DMF_BottomUnit_008", "DMF_BottomUnit_009", "DMF_BottomUnit_010", "DMF_BottomUnit_011", "DMF_BottomUnit_012", "DMF_BottomUnit_013", "DMF_BottomUnit_014","DMF_BottomUnit_015",]
 
  for (let i = this.roots.length; i < targetCount; i++) {
    const articleId = articles.at(i)!;
    let newArticle = this.createArticle(articleId);
    if (newArticle) {
      // Add the new article to this group
      this.addRoots(newArticle);

      let r1 = newArticle[0].root;
      //if (r1 instanceof OD_M_mr_StorageunitSingle) {
      //  r1.mod_Height = 720;
      //  r1._forcedInputAttributes = ["mod_Height"];
      //  let r1ro = r1.seal();  // calls "afterDataCompletion", returns the read-only module
      //}

      // Add some docking information
      this.addDocking(this.roots[i-1].root, Dock.LeftBottom, r1, Dock.RightBottom);

    } else {
      logError("Article not found");
    }
  }

  // Seal is needed, so roomle gets the docking vectors also in this result and need not to call it twice...
  this.roots.forEach(root => {
    if (root.root) {
      // TODO: Check if all modules have the seal method
      root.root.seal();
    }
  });