calc_FrontOversize(m: any, front: string = "All", type: string = "None"): { OversizeLeft: number; OversizeRight: number; OversizeTop: number; OversizeBottom: number; } {

	// Define Variables
	//----------------------------------------------------------
	let osLeft = 0;
	let osRight = 0;
	let osTop = 0;
	let osBtm = 0;

	// Oversize on bottom side
	//----------------------------------------------------------
	if (m.mod_FirstFront && m.mod_FrontOversizeBtm > 0) {
		if (front === 'fliplift' && type !== 'DF') {
			osBtm = m.mod_FrontOversizeBtm + m.mod_FrontPosStart;
		} 
		else if (front !== 'fliplift') {
			osBtm = m.mod_FrontOversizeBtm + m.mod_FrontPosStart;
		}
	}

  // Oversize on top side
  //----------------------------------------------------------
  if(m.mod_LastFront && m.mod_FrontOversizeTop > 0){
		if (front === 'fliplift' && !['FHF', 'UF'].includes(type)) {
			osTop = m.mod_FrontOversizeTop + m.mod_FrontGapHorTop;
		}
		else if (front !== 'fliplift') {
			osTop = m.mod_FrontOversizeTop + m.mod_FrontGapHorTop;
		}	  
  }

  // Oversize on left side
  //----------------------------------------------------------
  if(front === 'door' && type != 'Left' && m.mod_FrontOversizeLeft > 0){
		osLeft = m.mod_FrontOversizeLeft + m.mod_FrontGapVert / 2;
  }
  else if (front !== 'door' && m.mod_FrontOversizeLeft > 0){
		osLeft = m.mod_FrontOversizeLeft + m.mod_FrontGapVert / 2;
  }
  
  // Oversize on right side
  //----------------------------------------------------------
  if(front === 'door' && type != 'Right' && m.mod_FrontOversizeRight > 0){
  	osRight = m.mod_FrontOversizeRight + m.mod_FrontGapVert / 2;
  }
	else if (front !== 'door' && m.mod_FrontOversizeRight > 0){
		osRight = m.mod_FrontOversizeRight + m.mod_FrontGapVert / 2;
  }
  
  // Return the values
  //----------------------------------------------------------
  return {
    OversizeLeft: osLeft,
    OversizeRight: osRight,
    OversizeTop: osTop,
    OversizeBottom: osBtm,
  };
}