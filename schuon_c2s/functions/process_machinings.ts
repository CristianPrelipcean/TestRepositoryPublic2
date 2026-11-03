process_Machinings(inputString:string): [string, number , number, string, string, number, number] [] {

  // Excample String
  // let CompleteString: string = 'DrillV_10_11_Back_Top@10_42|20_84&DrillV_20_32_Back_Top@32_64|32_64_96'

  // Initialize variables
  let CompleteString: string = inputString;
  let tempMachinings = CompleteString.split("&", 99);
  let m: number=0;
  let tx: number=0;
  let ty: number=0;
  let numberMachining: number=0;
  let Machinings: [string, number , number, string, string, number, number] []=[];
  let temp:any;
  let temp1:any;
  let temp2:any;
  let temp2_1:any;
  let temp2_2:any
  
  // Cycle to split the string and push the machinings to an array of machinings
  while ((tempMachinings[m] ? tempMachinings[m]: 0) != 0)
  {
    // Split the 2 sides of a Machining separated with @
    temp=tempMachinings[m].split("@", 2);
    // Split the first side of a Machining to get its values
    temp1 = temp[0].split("_",5);
    // Split the second side of a Machining to get its values
    temp2 = temp[1].split("|",2);
      // Split from the first side to get X coordinates
      temp2_1 = temp2[0].split("_",99);
      // Split from the seconde side to get Y coordinates
      temp2_2 = temp2[1].split("_",99);
    
    tx=0;
    while ((temp2_1[tx] ? temp2_1[tx]: 0) != 0)
    {
      ty=0
      while ((temp2_2[ty] ? temp2_2[ty]: 0) != 0)
      {
        Machinings.push([temp1[0],parseFloat(temp1[1]),parseFloat(temp1[2]), temp1[3], temp1[4], parseFloat(temp2_1[tx]), parseFloat(temp2_2[ty])]);
        numberMachining++
        ty++
      }
      tx++
    }
    m++
  }

  // Return the machining information
  return Machinings;
}