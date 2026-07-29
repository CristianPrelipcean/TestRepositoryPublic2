process_HardwareBom(Elem: any, Part: any, ElementType: string, ElementCategory: string, ParentId: string, HardwareId: string, Quantity: number = 1 ) {
    try {
        
        //================================================================
        // Function input
        /**
         * Elem - bomout_Group object
         * Part - part object
         * ElementType - Type of the Bom-Element (will be checked in order output) 
         * ElementCategory - ProductionSite Category (to split the orders for different production sites)
         * ParentId - Id of the parent to create the hierarchy
         * HardwareId - HardwareId for the HardwareLibraryMapping
         * Quantity - Optional - provided via the part when the acumulation of quantities is done before the BOM calculation (Example: PantryPullout baskets)
         * Length - Optional - provided via the part when we want to override the length from the hardware (example: Wall Rail for hangers - The dimension of the fitting might be 2000mm but it's cuttable and in the cabinet we will use the provided Length in ther BOM)
        */


        // Filter function to get all the hardware elements for the Hardware
        let HardwareElements = GlobalFunc.find_HardwareLibraryMapping(HardwareId);

        // Cycle to add all hardware elements to the BOM
        HardwareElements.forEach(info => {
            let elem = Elem.addbomout_Hardware();
            let BOMInfo = GlobalFunc.find_HardwareLibrary(info.SupplierArticleNumber!, info.Supplier!);
            let BOMName = GlobalFunc.find_PartSettings(Part._partId);

            elem.bom_ElementType = ElementType;
            elem.bom_ElementCategory = ElementCategory;
            elem.bom_Supplier = info.Supplier;
            elem.bom_SupplierArticle = info.SupplierArticleNumber;
            elem.bom_Description1 = BOMInfo.Description;
            elem.bom_Description2 = BOMInfo.Description2;
            elem.bom_Length = BOMInfo.Length;
            elem.bom_Width = BOMInfo.Width;
            elem.bom_Thk = BOMInfo.Thickness;
            elem.bom_Color = BOMInfo.Color;
            elem.bom_Weight = BOMInfo.Weight;
            elem.bom_Name = BOMName.BomPartDescription;
            elem.bom_Type = Part._partId;
            elem.bom_PartId = Part._id;
            elem.bom_ParentId = ParentId;
            elem.bom_Qty = info.BomQty * Quantity;
            elem.bom_Program = Part.pa_Program ?? "";
        })
    }
    //====================================================================
    // Handle the errors
    //====================================================================

    catch (error: any) {
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 40012', 1);
        logError(ErrorMessage.Message(error.message));
    }

}