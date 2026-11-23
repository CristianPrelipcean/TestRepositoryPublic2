find_GroupFillerRule(Coverage: string, Side: string, ElementType: string, ArticleId: string, WallGap: number): ICT_tab_GroupFillerRules | undefined
{
  // Wildcard parameters
  let WildcardParams: any = {
      in_Coverage: Coverage,
      in_Side: Side,
      in_TypeElement: ElementType,
      in_ArticleId: ArticleId
  };

  // Fixed parameters
  let FixedParams: any = {};

  // Range parameters
  let RangeParams: any = {
      Range1: {
          MinAttr: 'in_MinWallGap',
          MaxAttr: 'in_MaxWallGap',
          Value: WallGap
      }
  };

  // Return the first best matching row, following the standard find pattern.
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal: ICT_tab_GroupFillerRules | undefined = GlobalFunc.process_BasicTableQuery(
      ct_tab_GroupFillerRules,
      WildcardParams,
      FixedParams,
      RangeParams,
      UniqueOutput
  );

  // No applicable rule returns undefined; no filler is selected.
  return retVal;

} 