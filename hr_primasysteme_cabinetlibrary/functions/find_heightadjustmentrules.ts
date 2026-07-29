find_HeightAdjustmentRule(ElementType: string, ArticleId: string, HeightAdjustmentMode: string): ICT_tab_HeightAdjustmentRules {

    // Wildcard parameters
    let WildcardParams: any = {
        in_TypeElement: ElementType,
        in_ArticleId: ArticleId
    };

    // Fixed parameters
    let FixedParams: any = {
        in_HeightAdjustmentMode: HeightAdjustmentMode
    };

    // Range parameters
    let RangeParams: any = {};

    // Return multiple rows or a single row
    let UniqueOutput = true;

    // Call the function and return the value
    let retVal = GlobalFunc.process_BasicTableQuery(
        ct_tab_HeightAdjustmentRules,
        WildcardParams,
        FixedParams,
        RangeParams,
        UniqueOutput
    );

    if (retVal == undefined) {
        let Text = ElementType + '-' + ArticleId + '-' + HeightAdjustmentMode;
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 15006', 1);
        logError(ErrorMessage.Message(Text));
    }

    return retVal;

}