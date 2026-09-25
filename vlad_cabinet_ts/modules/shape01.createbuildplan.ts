logInfo("Matrix-Values: " + JSON.stringify(this.width_matrix));

var res = this.ct_Custom_Table_03.find(p => p.in_integerFieldIn === 89)!;
res.func3(this);

var corpus = this.add000_Corpus(0,0,0,0,0,0);
this.createPartGroup("corpus", corpus);

var spl = this.add101_SidePanelLeft(0, 0, 0, this.sidePanelThickness, this.height, this.depth);
this.assignPartGroup("corpus", spl);

var spr = this.add102_SidePanelRight(this.width - this.sidePanelThickness, 0, 0, 
  this.sidePanelThickness, this.height, this.depth);
this.assignPartGroup("corpus", spr);

this.add120_BottomShelf(this.sidePanelThickness, 0, 0, 
  this.width- (2*this.sidePanelThickness), this.sidePanelThickness, this.depth);

this.add124_RailHorizontalFront(this.sidePanelThickness, this.height-this.sidePanelThickness, 0, 
  this.width - (2 * this.sidePanelThickness), this.sidePanelThickness, this.depth / 8);

this.add125_RailHorizontalBack(this.sidePanelThickness, this.height-this.sidePanelThickness, this.depth - (this.depth / 8),
  this.width - (2 * this.sidePanelThickness), this.sidePanelThickness, this.depth / 8)

this.add140_Backwall(0, 0, this.depth,
  this.width, this.height, 8);
logInfo("script updated via postman");
//abcda