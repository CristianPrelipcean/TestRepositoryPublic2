calc_LeafCompartments(compartmentsInformation: string) {





  // ============================================================================
  // 1. Types and interfaces
  // ============================================================================

  /**
   * Represents the calculated dimensions and global reference point
   * of a leaf compartment.
   *
   * Coordinate system:
   * - originX is measured from the cabinet's left edge.
   * - originY is measured from the cabinet's bottom edge.
   * - originZ is measured from the cabinet's depth reference.
   *
   * Currently, compartments are divided only in width and height,
   * so originZ is always zero.
   */
  interface LeafCompartmentBounds {
      compartmentId: string;
      name?: string;

      width: number;
      height: number;
      depth: number;

      originX: number;
      originY: number;
      originZ: number;
  }

  type DivisionOrientation =
        | "Horizontal"
        | "Vertical";
        
  interface Cabinet {
        width: number; // Overall cabinet width.
        height: number; // Overall cabinet height. 
        depth: number; // Overall cabinet depth. 
        rootCompartmentId: string; //ID of the initial compartment representing the entire cabinet volume.
        compartments: Record<string, Compartment>; // Collection of all compartments, indexed by compartment ID. Includes: the root compartment / compartments that have already been divided / current leaf compartments
        divisions: Record<string, Division>; //Collection of all divisions, indexed by division ID.
  }

  interface Compartment {
        id: string; // Unique identifier of the compartment.
        name?: string; // Optional user-friendly name.
        divisionId?: string; // ID of the division applied to this compartment. When undefined, the compartment is a leaf compartment and can receive a new division.
  }

  interface Division {
        id: string; // Unique identifier of the division. 
        parentCompartmentId: string; // ID of the compartment being divided. 
        orientation: DivisionOrientation; // Orientation of the division: Horizontal: represents a shelf / Vertical: represents a vert divider.
        position: number; //Effective Local position of the division inside the parent compartment. Horizontal: measured from the bottom of the parent / Vertical: measured from the left side of the parent. This position can differ from requestedPosition when the division would otherwise extend beyond the parent compartment.
        requestedPosition: number; //Original local position calculated from the global insertion coordinate before adjustment.
        thickness: number; // Fixed physical thickness of the division.
        wasPositionAdjusted: boolean; //Indicates that the requested position had to be moved so that the complete division thickness fits inside the compartment.
        firstCompartmentId?: string;
        secondCompartmentId?: string;
    }

  interface CompartmentBounds {
        x: number; // Global horizontal position of the compartment's left edge.
        y: number; // Global vertical position of the compartment's bottom edge.
        width: number; //Calculated compartment width.
        height: number; // Calculated compartment height.
        depth: number;  // Calculated compartment depth.
  }

  interface DivisionChildBounds {
        firstBounds?: CompartmentBounds;
        secondBounds?: CompartmentBounds;
  }



  // ============================================================================
  // 2. Helper functions
  // ============================================================================

  /**
   * Calculates the bounds of the two child compartments created by
   * a division.
   *
   * The orientation determines whether the available width or height
   * is divided.
  */
  function calculateChildBounds(parentBounds: CompartmentBounds, division: Division): DivisionChildBounds {
    if (division.orientation === "Vertical") {
        return calculateVerticalChildBounds(
            parentBounds,
            division
        );
    }

    return calculateHorizontalChildBounds(
        parentBounds,
        division
    );
  }

  /**
   * Calculates the child bounds created by a vertical division.
   *
   * The division position is measured from the parent's left edge:
   *
   * - firstBounds represents the left compartment;
   * - secondBounds represents the right compartment.
  */
  function calculateVerticalChildBounds(parent: CompartmentBounds, division: Division ): DivisionChildBounds {
        const firstWidth = division.position;

        const secondWidth = parent.width - division.position - division.thickness;
        /*
        if (
            !Number.isFinite(division.position) ||
            !Number.isFinite(division.thickness) ||
            division.position < 0 ||
            division.thickness <= 0 //|| secondWidth < 0
        ) {
            throw new Error(`Vertical division '${division.id}' does not fit inside ` + `compartment '${division.parentCompartmentId}'.`);
        }
        */
        const firstBounds: CompartmentBounds | undefined =
            firstWidth > 0
                ? {
                    x: parent.x,
                    y: parent.y,
                    width: firstWidth,
                    height: parent.height,
                    depth: parent.depth
                }
                : undefined;

        const secondBounds: CompartmentBounds | undefined =
            secondWidth > 0
                ? {
                    x:
                        parent.x +
                        division.position +
                        division.thickness,

                    y: parent.y,
                    width: secondWidth,
                    height: parent.height,
                    depth: parent.depth
                }
                : undefined;

        return {
            firstBounds,
            secondBounds
        };
    }

  /**
   * Calculates the child bounds created by a horizontal division.
   *
   * The division position is measured from the parent's bottom edge:
   *
   * - firstBounds represents the bottom compartment;
   * - secondBounds represents the top compartment.
  */
  function calculateHorizontalChildBounds(parent: CompartmentBounds, division: Division ): DivisionChildBounds {
        const firstHeight = division.position;

        const secondHeight = parent.height - division.position - division.thickness;
        /*
        if (
            !Number.isFinite(division.position) ||
            !Number.isFinite(division.thickness) ||
            division.position < 0 ||
            division.thickness <= 0 //|| secondHeight < 0
        ) {
            throw new Error(`Horizontal division '${division.id}' does not fit inside ` + `compartment '${division.parentCompartmentId}'.` );
        }
        */
        const firstBounds: CompartmentBounds | undefined =
            firstHeight > 0
                ? {
                    x: parent.x,
                    y: parent.y,
                    width: parent.width,
                    height: firstHeight,
                    depth: parent.depth
                }
                : undefined;

        const secondBounds: CompartmentBounds | undefined =
            secondHeight > 0
                ? {
                    x: parent.x,

                    y:
                        parent.y +
                        division.position +
                        division.thickness,

                    width: parent.width,
                    height: secondHeight,
                    depth: parent.depth
                }
                : undefined;

        return {
            firstBounds,
            secondBounds
        };
    }


  /**
   * Calculates the dimensions and global reference point of every
   * available leaf compartment in the cabinet.
   *
   * A leaf compartment is a compartment without a divisionId.
   *
   * A compartment containing a division that occupies its complete
   * available space is not returned because it is considered occupied,
   * even when that division has no child compartments.
   *
   * The function also validates:
   * - compartment references;
   * - division references;
   * - division parent references;
   * - child compartment references;
   * - circular compartment references.
   */
  function calculateLeafCompartments(cabinet: Cabinet ): LeafCompartmentBounds[] {
      if (!cabinet) {
          throw new Error("A cabinet is required.");
      }

      if (!Number.isFinite(cabinet.width) || !Number.isFinite(cabinet.height) || !Number.isFinite(cabinet.depth) ) {
          throw new Error("Cabinet dimensions must be finite numbers.");
      }

      if (cabinet.width <= 0 || cabinet.height <= 0 || cabinet.depth <= 0 ) {
          throw new Error("Cabinet dimensions must be greater than zero.");
      }

      if (!cabinet.rootCompartmentId) {
          throw new Error("The cabinet does not define a root compartment ID.");
      }

      const rootBounds: CompartmentBounds = {
          x: 0,
          y: 0,
          width: cabinet.width,
          height: cabinet.height,
          depth: cabinet.depth
      };

      const leafCompartments: LeafCompartmentBounds[] = [];

      /*
      * Contains the compartments currently being traversed.
      * It detects circular references such as:
      *
      * root -> root_left -> root
      */
      const activePath = new Set<string>();

      /*
      * Contains all compartments already reached from the root.
      * A compartment should never be the child of multiple divisions.
      */
      const visitedCompartments = new Set<string>();


      function calculateRecursive(
          compartmentId: string,
          bounds: CompartmentBounds
      ): void {

          const compartment = cabinet.compartments[compartmentId];

          if (!compartment) {
              throw new Error(`Compartment '${compartmentId}' does not exist.`);
          }

          if (compartment.id !== compartmentId) {
              throw new Error(`Compartment dictionary key '${compartmentId}' does not ` + `match the compartment ID '${compartment.id}'.`);
          }

          if (activePath.has(compartmentId)) {
              throw new Error(`Circular compartment reference detected at ` + `'${compartmentId}'.` );
          }

          if (visitedCompartments.has(compartmentId)) {
              throw new Error(`Compartment '${compartmentId}' is referenced by more ` + `than one division.`);
          }

          if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y) || !Number.isFinite(bounds.width) || !Number.isFinite(bounds.height) || !Number.isFinite(bounds.depth) ) {
              throw new Error( `The calculated bounds of compartment ` + `'${compartmentId}' are invalid.` );
          }

          if (bounds.width <= 0 || bounds.height <= 0 || bounds.depth <= 0 ) {
              throw new Error(`Compartment '${compartmentId}' has invalid dimensions. ` + `Width: ${bounds.width}, ` + `height: ${bounds.height}, ` + `depth: ${bounds.depth}.` );
          }

          visitedCompartments.add(compartmentId);

          /*
          * A compartment without a division is an available leaf.
          */
          if (!compartment.divisionId) {
              leafCompartments.push({
                  compartmentId: compartment.id,
                  name: compartment.name,

                  width: bounds.width,
                  height: bounds.height,
                  depth: bounds.depth,

                  originX: bounds.x,
                  originY: bounds.y,
                  originZ: 0
              });

              return;
          }

          const division = cabinet.divisions[compartment.divisionId];

          if (!division) {
              throw new Error(`Division '${compartment.divisionId}' assigned to ` + `compartment '${compartment.id}' does not exist.` );
          }

          if (division.id !== compartment.divisionId) {
              throw new Error( `Division dictionary reference ` + `'${compartment.divisionId}' does not match division ID ` + `'${division.id}'.` );
          }

          if (division.parentCompartmentId !== compartment.id) {
              throw new Error( `Division '${division.id}' references parent ` + `'${division.parentCompartmentId}', but it is assigned ` + `to compartment '${compartment.id}'.` );
          }

          const {
              firstBounds,
              secondBounds
          } = calculateChildBounds(bounds, division);

          /*
          * The existence of calculated bounds and compartment IDs
          * must match.
          */
          if (firstBounds && !division.firstCompartmentId) {
              throw new Error(`Division '${division.id}' creates available space on ` + `its first side but does not reference a first compartment.` );
          }

          if (!firstBounds && division.firstCompartmentId) {
              throw new Error( `Division '${division.id}' references first compartment ` + `'${division.firstCompartmentId}', but the first side ` + `has no available space.` );
          }

          if (secondBounds && !division.secondCompartmentId) {
              throw new Error(`Division '${division.id}' creates available space on ` + `its second side but does not reference a second compartment.` );
          }

          if (!secondBounds && division.secondCompartmentId) {
              throw new Error( `Division '${division.id}' references second compartment ` + `'${division.secondCompartmentId}', but the second side ` + `has no available space.` );
          }

          activePath.add(compartmentId);

          try {
              if (firstBounds && division.firstCompartmentId) {
                  calculateRecursive( division.firstCompartmentId, firstBounds);
              }

              if (secondBounds && division.secondCompartmentId) {
                  calculateRecursive( division.secondCompartmentId, secondBounds );
              }

              /*
              * When neither child exists, the division occupies the
              * complete compartment.
              *
              * Nothing is added to leafCompartments because this
              * compartment is occupied and cannot receive another division.
              */
          } finally {
              activePath.delete(compartmentId);
          }
      }


      calculateRecursive( cabinet.rootCompartmentId, rootBounds );

      return leafCompartments;
  }

  // ============================================================================
  // 3 - Implementation
  // ============================================================================

  return (JSON.stringify(calculateLeafCompartments(JSON.parse(compartmentsInformation))));


}