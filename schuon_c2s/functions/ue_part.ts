ue_Part(m: adc_mr_Part) {


  // Condition for Duo Edges
  if (m.mod_EdgeBackColor_matrix.Custom_Category == "Duo" || m.mod_EdgeFrontColor_matrix.Custom_Category == "Duo" || m.mod_EdgeLeftColor_matrix.Custom_Category == "Duo" || m.mod_EdgeRightColor_matrix.Custom_Category == "Duo") {

    m.addOD_M_cmc_DuoEdges();
  }

}