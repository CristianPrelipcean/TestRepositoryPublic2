process_HardwareColor(hardwareId: string) {

  let retHardwareColor: string | undefined;

  let retHardwareMapping = GlobalFunc.find_HardwareLibraryMapping(hardwareId);
  if (retHardwareMapping) {
    retHardwareMapping.forEach(item => {
      retHardwareColor = GlobalFunc.find_HardwareLibrary(item.SupplierArticleNumber!, item.Supplier!).Color;
    });  
  }

  return retHardwareColor;
}