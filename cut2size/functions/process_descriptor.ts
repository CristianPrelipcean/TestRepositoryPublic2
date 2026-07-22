process_Descriptor(inputDescriptor:string, inputNumber:number): number[] {
  
  // Initialize variables
  let splittedDescriptor = inputDescriptor.split("_", 99);
  let temp: string='0';
  let dimArray: number[] = [];
  let xArray: number[] = [];
  let resultArray: number[] = [];
  let z: number=0;
  let l: number=0;
  
  // Cycle to split the Descriptor
  splittedDescriptor.forEach(s => {
	dimArray[z] = 0
	xArray[z] = 0
	let splittedDescriptor1 = s.split("+", 99);
	splittedDescriptor1.forEach( q => {
		let splittedDescriptor2 = q.split("-", 99);
		splittedDescriptor2.forEach( w => {
			if (w.substring(w.length-2) == 'mm')
			{
				if (splittedDescriptor2.length >1) 
					{ dimArray[z]=dimArray[z]-parseFloat(w.substring(0,w.length-2)); }
				else
					{ dimArray[z]=dimArray[z] + parseFloat(w.substring(0,w.length-2)); }
			}
			else
				{ xArray[z]=xArray[z] + parseFloat(w); }
		})
	})
	z++
  })

  // Initialize variables
  let dimTotal = dimArray.reduce((a, b) => a + b, 0);
  let xTotal = xArray.reduce((a, b) => a + b, 0);
  let xUnit = (inputNumber - dimTotal) / xTotal
  let tempAcum: number=0;

  // Cycle 
  for(l=0; l<z-1; l++)
  {
    resultArray[l]=0;
	resultArray[l] = tempAcum + dimArray[l] + xArray[l]*xUnit;
    tempAcum = resultArray[l];
  }

  // Return Information
  return resultArray;
}