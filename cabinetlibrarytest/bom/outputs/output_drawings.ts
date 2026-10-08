// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: Create Zip-file for all part drawings
//
// Description:
// Create Zip-file
//
// Revisions:
// 
//===================================================

// Order Row Data
ol.forEach(p =>{

  // Zip all the drawings
  var bo = this.createBomOutputCreate_Drawing(p.bomEntries);
  bo.forEach((value,key) => {
    result.set(p.orderLineNo + "_" + key, value);
  })
});