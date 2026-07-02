process_Descriptor(inputDescriptor:string, inputNumber:number): number[] {
  
  // Initialize variables
  let splittedDescriptor = inputDescriptor.split("_", 99);
  let dimArray: number[] = [];
  let xArray: number[] = [];
  let resultArray: number[] = [];
  let z: number=0;
  let l: number=0;
  
  try {
    // Cycle to split the Descriptor
    splittedDescriptor.forEach(s => {
      dimArray[z] = 0
      xArray[z] = 0
      let splittedDescriptor1 = s.split("+", 99);
      splittedDescriptor1.forEach(q => {
        let splittedDescriptor2 = q.split("-", 99);
        splittedDescriptor2.forEach(w => {
          if (w.substring(w.length - 2) == 'mm') {
            if (splittedDescriptor2.length > 1) { dimArray[z] = dimArray[z] - parseFloat(w.substring(0, w.length - 2)); }
            else { dimArray[z] = dimArray[z] + parseFloat(w.substring(0, w.length - 2)); }
          }
          else { xArray[z] = xArray[z] + parseFloat(w); }
        })
      })
      z++
    })

    // Initialize variables
    let dimTotal = dimArray.reduce((a, b) => a + b, 0);
    let xTotal = xArray.reduce((a, b) => a + b, 0);
    let xUnit: number = 0;
    if (xTotal == 0 && dimTotal == inputNumber) {
      xUnit = (inputNumber - dimTotal);
    }
    else if (xTotal == 0 && dimTotal != inputNumber) {
      let Text = ' Descriptor: ' + inputDescriptor + ' / Dimension: ' + inputNumber;
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 40001', 1)
      //logError(ErrorMessage.Message(Text));
      throw new Error(ErrorMessage.Message(Text)); 
    }
    else {
      xUnit = (inputNumber - dimTotal) / xTotal;
    }
    let tempAcum: number = 0;

    // Cycle 
    for (l = 0; l < z - 1; l++) {
      resultArray![l] = 0;
      if (tempAcum + dimArray[l] + xArray[l] * xUnit >= inputNumber) {
        resultArray![l] = inputNumber;
        l = 9999999;
      }
      else {
        resultArray![l] = tempAcum + dimArray[l] + xArray[l] * xUnit;
      }

      tempAcum = resultArray![l];
    }
  }
  catch (error: any)
  {
      logError('process_Descriptor: ' + error.message);
  }

  // Return Information
  return resultArray!;
}