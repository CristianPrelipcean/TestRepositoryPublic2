  const filename = "this is a testing file name";
  if(od.additionalData == null) {
    od.additionalData = [];
  }
  
  this.createFileEntry(result, filename, "some random but important content", OM.AdditionalDataTypeEnum.SurfaceTexture);
  od.additionalData.push({ name: filename, type: OM.AdditionalDataTypeEnum.SurfaceTexture } as OM.AdditionalDataEntity);

  od.quantityOfArticles = 12313;