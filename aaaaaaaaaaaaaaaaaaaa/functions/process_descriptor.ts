process_Descriptor(inputDescriptor: string, inputNumber: number): number[] {

  //====================================================================
  // Helper: Evaluate expression
  //====================================================================

  function evaluateExpression(expr: string): { dim: number, x: number } {

    //------------------------------------------------------------------
    // Guard
    //------------------------------------------------------------------

    if (expr.includes("(") || expr.includes(")")) {
      throw new Error("Parentheses are not supported");
    }

    //------------------------------------------------------------------
    // Initialize values
    //------------------------------------------------------------------

    let dim = 0;
    let x = 0;

    const tokens = expr.match(/[+-]?[^+-]+/g) || [];

    //------------------------------------------------------------------
    // Evaluate tokens
    //------------------------------------------------------------------

    tokens.forEach(token => {
      let sign = 1;

      if (token.startsWith("-")) {
        sign = -1;
        token = token.substring(1);
      }
      else if (token.startsWith("+")) {
        token = token.substring(1);
      }

      token = token.trim();

      //----------------------------------------------------------------
      // Determine multiplier
      //----------------------------------------------------------------

      let multiplier = 1;

      const multMatch = token.match(/^(\d+(\.\d+)?)\*(.+)$/);

      if (multMatch) {
        multiplier = parseFloat(multMatch[1]);
        token = multMatch[3].trim();

        if (isNaN(multiplier)) {
          throw new Error(`Invalid multiplier in "${expr}"`);
        }
      }

      //----------------------------------------------------------------
      // Determine absolute or weighted value
      //----------------------------------------------------------------

      if (token.toLowerCase().endsWith("mm")) {
        const value = parseFloat(token.slice(0, -2));

        if (isNaN(value)) {
          throw new Error(`Invalid mm value: ${token}`);
        }

        dim += sign * multiplier * value;
      }
      else {
        const value = parseFloat(token);

        if (isNaN(value)) {
          throw new Error(`Invalid numeric value: ${token}`);
        }

        x += sign * multiplier * value;
      }
    });

    return { dim, x };
  }

  //====================================================================
  // Main calculation
  //====================================================================

  const dimArray: number[] = [];
  const xArray: number[] = [];
  const resultArray: number[] = [];

  try {

    //------------------------------------------------------------------
    // Split descriptor and evaluate segments
    //------------------------------------------------------------------

    const segments = inputDescriptor.split(/[_:]/);

    segments.forEach(segment => {
      const res = evaluateExpression(segment);

      dimArray.push(res.dim);
      xArray.push(res.x);
    });

    //------------------------------------------------------------------
    // Calculate descriptor totals
    //------------------------------------------------------------------

    const dimTotal = dimArray.reduce((a, b) => a + b, 0);
    const xTotal = xArray.reduce((a, b) => a + b, 0);

    let xUnit = 0;

    if (xTotal === 0) {
      if (dimTotal !== inputNumber) {
        throw new Error(`Descriptor mismatch: ${inputDescriptor} / ${inputNumber}`);
      }
    }
    else {
      xUnit = (inputNumber - dimTotal) / xTotal;
    }

    //------------------------------------------------------------------
    // Calculate division positions
    //------------------------------------------------------------------

    let tempAcum = 0;

    for (let i = 0; i < segments.length - 1; i++) {
      const value = tempAcum + dimArray[i] + xArray[i] * xUnit;

      if (value >= inputNumber) {
        resultArray[i] = inputNumber;
        break;
      }

      resultArray[i] = value;
      tempAcum = value;
    }

  }

  //====================================================================
  // Error handling and return result
  //====================================================================

  catch (error: any) {
    logError("process_Descriptor: " + error.message);
  }

  return resultArray;
}