
  // Create the createPartGroup
  const partGroup = this.addpart_BaseboardGroup(0, 0, 0, 0, 0, 0);

  // We have to provide the Id to all the childs!
  // Actually everything is hard coded and it will not work in the future!
  this.createPartGroup('Baseboard01', partGroup);
  partGroup.pa_BomId = 'Baseboard01';