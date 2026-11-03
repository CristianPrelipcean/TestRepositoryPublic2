  // Front View
  if (this.mod_TypeElement_matrix.PartView == 'FrontView') {
    const c = this.addOD_M_mp_Part();
    c.seal();
    const width = c.mod_Width!;
    const length = c.mod_Length!;
    const thickness = c.mod_Thickness!;
  }
  else if(this.mod_TypeElement_matrix.PartView == 'ShelfView') {
    const c = this.addOD_M_mp_Part();
    c.seal();
    const width = c.mod_Width!;
    const length = c.mod_Length!;
    const thickness = c.mod_Thickness!;
  }
  else {
    const c = this.addOD_M_mp_Part();
    c.seal();
    const width = c.mod_Length!;
    const length = c.mod_Thickness!;
    const thickness = c.mod_Width!;
  }