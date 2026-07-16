  const articlePos = this.getArticlePos();
  logInfo("group orchestrator log msg.")
  logInfo("x:" + articlePos.x);
  logInfo("y:" + articlePos.y);
  logInfo("z:" + articlePos.z);
  logInfo("rotationY:" + articlePos.rotationY);

  const repositioningData = {
    posGroup: [articlePos.x, articlePos.y, articlePos.z],
    posRotationY: articlePos.rotationY,
    rootId: this.roots[0].root._id,
    rootRelPos: [1.1, 2.2, 3.3],
    rootRelRotationY: 4.4
  };

  this.setRepositioningData(repositioningData);