  logInfo("group orchestrator log msg.")
  logInfo("x:" + this.getArticlePos().x);
  logInfo("y:" + this.getArticlePos().y);
  logInfo("z:" + this.getArticlePos().z);
  logInfo("rotationY:" + this.getArticlePos().rotationY);

  if (this.roots.length > 0) {
    const articlePos = this.getArticlePos();
    const positioningData = {
      posGroup: [articlePos.x, articlePos.y, articlePos.z],
      posRotation: articlePos.rotationY,
      rootId: this.roots[0].root._id,
      rootRelPos: [100,100,100],
      rootRelRotation: 45
    };
    this.setRepositioningData(positioningData);
  }