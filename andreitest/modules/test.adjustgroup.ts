  const newArticle = this.createArticle(this.articleIds[1])!; // create a new article. can use the articleids or the name directly
  this.addRoot(newArticle[0]); //iirc, we currently have only one root per article. add the article to the result
  this.addDocking(this.roots[0].root, Dock.LeftBottom, this.roots[1].root, Dock.RightBottom); // connect the initial root from its left bottom to the newly created article's root
  