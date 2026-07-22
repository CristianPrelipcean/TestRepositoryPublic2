// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: Create Zip-file for all pMPR-files
//
// Description:
// Create Zip-file
//
// Revisions:
// 
//===================================================

// Order Row Data
ol.forEach(p =>{
  // Zip all the Mpr-files
  var bo = this.createBomOutputCreate_Mpr(p.bomEntries);
  bo.forEach((value,key) => {
    result.set(p.orderLineNo + "_" + key, value);
  })
})