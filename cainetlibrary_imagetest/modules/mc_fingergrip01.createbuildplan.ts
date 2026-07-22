
     // Jiri Polcar

    // Helper function to draw the fingergrip shapes.
    // They are obsolete at the moment, but you can call them to re-generate the SVGs for the table.
    const drawFingergripSvg = (postype: string, type: string, matrix: any): any => {
      const data = {
        top: 0,
        btm: 0,
        t: 10,
        fr: 0,
        bk: 0,
        depth: 0,
        height: 0,
        svg: '',
      }

      if (postype === 'Top') {
        data.top = matrix.LShapeHeight!;
        data.bk = - matrix.LShapeDepth!;
      }
      else if (postype === 'Middle') {
        data.top = matrix.CShapeHeight / 2;
        data.btm = - matrix.CShapeHeight / 2;
        data.bk = - matrix.CShapeDepth
      }
      else {
        logError('Fingergrip postype not supported: ' + postype + '. Using fallback size values.');
        data.top = 100;
        data.bk = -100;
      }

      if (postype === 'Top' && type === 'Wood') {
        // L Shape
        data.svg = `<path d="
          M ${data.fr} ${data.btm} 
          L ${data.bk} ${data.btm} 
          L ${data.bk} ${data.top} 
          L ${data.bk + data.t} ${data.top} 
          L ${data.bk + data.t} ${data.btm + data.t} 
          L ${data.fr} ${data.btm + data.t} 
          Z"/>`;
      }
      else if (postype === 'Middle' && type === 'Wood') {
        // C Shape        
        data.svg = `<path d="
          M ${data.fr} ${data.btm} 
          L ${data.bk} ${data.btm} 
          L ${data.bk} ${data.top} 
          L ${data.fr} ${data.top} 
          L ${data.fr} ${data.top - data.t} 
          L ${data.bk + data.t} ${data.top - data.t} 
          L ${data.bk + data.t} ${data.btm + data.t} 
          L ${data.fr} ${data.btm + data.t} 
          Z"/>`;
      }
      else if (postype === 'Top' && type === 'Metal') {

        const e = 1; // the starting notch length
        const sR = 2; // the radius of the small circle (at the starting notch)
        const bR = 10; // the major radius
        const t = 1; // thickness
        const bRr = bR + t; // major radius on the outside
        const sRr = sR - t; // small radius on the outside

        // full
        data.svg = `<path d="
        M ${data.fr} ${data.btm}
        L ${data.fr} ${data.btm + e}
        A ${sR} ${sR} 0 0 1 ${data.fr - sR} ${data.btm + e + sR}
        L ${data.bk + bR + t} ${data.btm + e + sR}
        A ${bR} ${bR} 0 0 0 ${data.bk + t} ${data.btm + e + bR}
        L ${data.bk + t} ${data.top}
        L ${data.bk} ${data.top}
        L ${data.bk} ${data.btm + e + sR + bRr}
        A ${bRr} ${bRr} 0 0 1 ${data.bk + bRr} ${data.btm + e + sRr}
        L ${data.fr - t - sRr} ${data.btm + e + sRr}
        A ${sRr} ${sRr} 0 0 0 ${data.fr - t} ${data.btm + e}
        L ${data.fr - t} ${data.btm}   
          Z
          "/>`;

        // no back
        data.svg = `<path d="
          M ${data.fr} ${data.btm}
          L ${data.fr} ${data.btm + e}
          A ${sR} ${sR} 0 0 1 ${data.fr - sR} ${data.btm + e + sR}
          L ${data.bk + bR + t} ${data.btm + e + sR}
          A ${bR} ${bR} 0 0 0 ${data.bk + t} ${data.btm + e + bR}
          L ${data.bk + t} ${data.top}
          L ${data.bk} ${data.top}
          L ${data.bk} ${data.btm}
            Z
            "/>`;
      }
      else if (postype === 'Middle' && type === 'Metal') {

        const e = 1; // the starting notch length
        const sR = 2; // the radius of the small circle (at the starting notch)
        const bR = 10; // the major radius
        const t = 1; // thickness
        const bRr = bR + t; // major radius on the outside
        const sRr = sR - t; // small radius on the outside

        // full
        data.svg = `<path d="
        M ${data.fr} ${data.btm}
        L ${data.fr} ${data.btm + e}
        A ${sR} ${sR} 0 0 1 ${data.fr - sR} ${data.btm + e + sR}
        L ${data.bk + bR + t} ${data.btm + e + sR}
        A ${bR} ${bR} 0 0 0 ${data.bk + t} ${data.btm + e + bR}
        L ${data.bk + t} ${data.top - e - sR - bR}
        A ${bR} ${bR} 0 0 0 ${data.bk + bR + t} ${data.top - e - sR}
        L ${data.fr - sR} ${data.top - e - sR}
        A ${sR} ${sR} 0 0 1 ${data.fr} ${data.top - e}
        L ${data.fr} ${data.top}
        L ${data.fr - t} ${data.top}
        L ${data.fr - t} ${data.top - e}
        A ${sRr} ${sRr} 0 0 0 ${data.fr - t - sRr} ${data.top - e - sRr}
        L ${data.bk + bRr} ${data.top - e - sRr}
        A ${bRr} ${bRr} 0 0 1 ${data.bk} ${data.top - e - sR - bRr}
        L ${data.bk} ${data.btm + e + sR + bRr}
        A ${bRr} ${bRr} 0 0 1 ${data.bk + bRr} ${data.btm + e + sRr}
        L ${data.fr - t - sRr} ${data.btm + e + sRr}
        A ${sRr} ${sRr} 0 0 0 ${data.fr - t} ${data.btm + e}
        L ${data.fr - t} ${data.btm}   
          Z
          "/>`;

        // no back
        data.svg = `<path d="
          M ${data.fr} ${data.btm}
          L ${data.fr} ${data.btm + e}
          A ${sR} ${sR} 0 0 1 ${data.fr - sR} ${data.btm + e + sR}
          L ${data.bk + bR + t} ${data.btm + e + sR}
          A ${bR} ${bR} 0 0 0 ${data.bk + t} ${data.btm + e + bR}
          L ${data.bk + t} ${data.top - e - sR - bR}
          A ${bR} ${bR} 0 0 0 ${data.bk + bR + t} ${data.top - e - sR}
          L ${data.fr - sR} ${data.top - e - sR}
          A ${sR} ${sR} 0 0 1 ${data.fr} ${data.top - e}
          L ${data.fr} ${data.top}
          L ${data.bk} ${data.top}
          L ${data.bk} ${data.btm}
          Z
          "/>`;
      }
      else {
        logError('Fingergrip not supported combination of FingergripType ' + type + ' and FingergripPostype ' + postype + '. Using fallback rectangle fingergrip shape.');
        data.svg = `<path d="
        M ${data.fr} ${data.btm} 
        L ${data.bk} ${data.btm} 
        L ${data.bk} ${data.top} 
        L ${data.fr} ${data.top}
        Z"/>`;
      }

      data.depth = data.fr - data.bk;
      data.height = data.top - data.btm;
      data.svg = `<svg>${data.svg}</svg>`;
      return data;
    }

    let depth;
    let height;
    let svg;
    if (this.mod_FingergripPostype === 'Top') {
      height = (this.mod_FingergripType_matrix.LShapeHeight ?? 0);
      depth = (this.mod_FingergripType_matrix.LShapeDepth ?? 0);
      svg = this.mod_FingergripType_matrix.LShapeSVG || null;
    }
    else if (this.mod_FingergripPostype === 'Middle') {
      height = (this.mod_FingergripType_matrix.CShapeHeight ?? 0) / 2 - (this.mod_FingergripType_matrix.CShapeHeight ?? 0) / 2;
      depth = (this.mod_FingergripType_matrix.CShapeDepth ?? 0)
      svg = this.mod_FingergripType_matrix.CShapeSVG || null;
    }
    else {
      height = 10;
      depth = 10;
      svg = null;
      logError('Fingergrip of FingergripPostype "' + this.mod_FingergripPostype + '" not supported. Using fallback rectangle fingergrip shape.');
    }

    const fingegrip = this.addpart_FingergripMiddle(0, 0, 0, this.mod_FingergripLength, height, depth);
    
    let shapePart = false;
    if (svg) {
      fingegrip.extrude(svg, 'x');
      shapePart = true
    }

    // Add the texture
    GlobalFunc.process_AddMaterial(fingegrip, 'fingergrip', this.mod_FingergripColor, this.mod_FingergripColor, this.mod_FingergripColor, this.mod_FingergripColor, 'none', false, shapePart);
