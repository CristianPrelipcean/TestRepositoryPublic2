process_ShelfadjDivers01(SelfAdjDesign: String, Width: Number, Depth: Number, Height: Number): {
  DatasetComplete: boolean;
  Supplier: string;
  SupplierArticleNumber: string;
} {
  //---------------Initialize return object-----------------------------------

  const result: {
    DatasetComplete: boolean;
    Supplier: string;
    SupplierArticleNumber: string;
  } = {
    DatasetComplete: false,
    Supplier: '',
    SupplierArticleNumber: ''
  };

	
	//---------------Initialize variables---------------------------------------

  //---------------Settings from tab_ShelfDiversMapping--------------------------
  const shelfDiversmapping = GlobalFunc.find_ShelfDiversMapping(SelfAdjDesign, Width,Depth,Height);

  if (!shelfDiversmapping) {
    return result;
  }
  result.Supplier = shelfDiversmapping.Supplier ?? '';
  result.SupplierArticleNumber = shelfDiversmapping.SupplierArticleNumber ?? "";

	//---------------Result is complete-----------------------------------------

	result.DatasetComplete = true;
	return result;
  
}