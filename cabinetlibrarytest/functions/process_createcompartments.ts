process_CreateCompartments (module: any) {

  
	// ============================================================================
	// 1. Types and interfaces
	// ============================================================================

	/**
	 * Defines the orientation of a division inside a compartment.
	 *
	 * - Horizontal: creates a bottom and a top compartment.
	 * - Vertical: creates a left and a right compartment.
	 */
	type DivisionOrientation =
        | "Horizontal"
        | "Vertical";

	/**
	 * Represents the complete cabinet configuration.
	 *
	 * The cabinet dimensions define the bounds of the root compartment.
	 * All other compartments and their dimensions are derived from the
	 * divisions applied to the root compartment and its descendants.
	 */
	interface Cabinet {
        width: number; // Overall cabinet width.
        height: number; // Overall cabinet height. 
        depth: number; // Overall cabinet depth. 
        rootCompartmentId: string; //ID of the initial compartment representing the entire cabinet volume.
        compartments: Record<string, Compartment>; // Collection of all compartments, indexed by compartment ID. Includes: the root compartment / compartments that have already been divided / current leaf compartments
        divisions: Record<string, Division>; //Collection of all divisions, indexed by division ID.
	}


	/**
	 * Represents a compartment within the cabinet.
	 *
	 * A compartment does not store its dimensions or position. Those values
	 * are calculated from the cabinet dimensions and the chain of divisions
	 * leading to the compartment.
	 */
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

	/**
	 * Represents the calculated position and dimensions of a compartment.
	 *
	 * These values are derived at runtime and are not stored in the
	 * cabinet configuration.
	 *
	 * Coordinate system:
	 * - x = 0 is the left side of the cabinet.
	 * - y = 0 is the bottom of the cabinet.
	 * - x increases from left to right.
	 * - y increases from bottom to top.
	 */
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

	/**
     * Describes the leaf compartment found at a global cabinet position.
     *
     * Coordinate system:
     * - originX is the global position of the compartment's left edge.
     * - originY is the global position of the compartment's bottom edge.
     */
    interface FoundCompartment {
        compartmentId: string;
        width: number;
        height: number;
        depth: number;
        originX: number;
        originY: number;
    }


	/**
	 * Defines the information required to insert a new division.
	 *
	 * Unlike the stored Division interface, this input uses global cabinet
	 * coordinates. The parent compartment and local division position are
	 * determined automatically.
	 */
	interface AddDivisionInput {
        id: string; // Unique ID to assign to the new division.
        orientation: DivisionOrientation; // Orientation of the new shelf or divider.
        x: number; // Global horizontal insertion coordinate.
        y: number; // Global vertical insertion coordinate.
        thickness: number; // Physical thickness of the shelf or divider.
	}


	// ============================================================================
	// 2. Helper functions
	// ============================================================================

	/**
	 * Determines whether a global point is inside the supplied bounds.
	 *
	 * The left and bottom edges are included.
	 * The right and top edges are excluded to prevent a boundary point
	 * from belonging to two adjacent compartments.
	*/
	function isPointInsideBounds(x: number, y: number, bounds: CompartmentBounds ): boolean {
        return (
            x >= bounds.x &&
            x < bounds.x + bounds.width &&
            y >= bounds.y &&
            y < bounds.y + bounds.height
        );
	}

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
            throw new Error(`Error 179: Vertical division '${division.id}' does not fit inside ` + `compartment '${division.parentCompartmentId}'.`);
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
            throw new Error(`Error 234: Horizontal division '${division.id}' does not fit inside ` + `compartment '${division.parentCompartmentId}'.` );
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
     * Finds the current leaf compartment containing the supplied global point.
     *
     * The search starts at the root compartment and recursively follows the
     * child compartment containing the supplied position.
     *
     * Returns:
     * - compartmentId: ID of the leaf compartment;
     * - width: calculated compartment width;
     * - height: calculated compartment height;
     * - depth: calculated compartment depth;
     * - originX: global position of the compartment's left edge;
     * - originY: global position of the compartment's bottom edge.
     *
     * Returns undefined when:
     * - the point is outside the cabinet;
     * - the point falls within the thickness of an existing division.
     *
     * Throws an error when the cabinet structure contains an invalid
     * compartment or division reference.
     */
    function findCompartmentAtPosition(cabinet: Cabinet, x: number, y: number ): FoundCompartment | undefined {
        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            throw new Error("The compartment search coordinates must be finite numbers.");
        }

        const rootBounds: CompartmentBounds = {
            x: 0,
            y: 0,
            width: cabinet.width,
            height: cabinet.height,
            depth: cabinet.depth
        };

        function findRecursive(compartmentId: string, bounds: CompartmentBounds ): FoundCompartment | undefined {
            const compartment = cabinet.compartments[compartmentId];

            if (!compartment) {
                throw new Error(`Compartment '${compartmentId}' does not exist.`);
            }

            if (!isPointInsideBounds(x, y, bounds)) {
                return undefined;
            }

            /*
             * A compartment without a division is an available
             * leaf compartment.
             */
            if (!compartment.divisionId) {
                return {
                    compartmentId: compartment.id,
                    width: bounds.width,
                    height: bounds.height,
                    depth: bounds.depth,
                    originX: bounds.x,
                    originY: bounds.y
                };
            }

            const division = cabinet.divisions[compartment.divisionId];

            if (!division) {
                throw new Error( `Division '${compartment.divisionId}' does not exist.`);
            }

            if (division.parentCompartmentId !== compartment.id) {
                throw new Error(`Division '${division.id}' references parent ` + `'${division.parentCompartmentId}', but it is assigned ` + `to compartment '${compartment.id}'.` );
            }

            const {firstBounds, secondBounds} = calculateChildBounds(bounds, division);

            if (
                firstBounds &&
                division.firstCompartmentId &&
                isPointInsideBounds(x, y, firstBounds)
            ) {
                return findRecursive(division.firstCompartmentId, firstBounds );
            }

            if (
                secondBounds &&
                division.secondCompartmentId &&
                isPointInsideBounds(x, y, secondBounds)
            ) {
                return findRecursive(division.secondCompartmentId, secondBounds );
            }

            /*
             * Neither child contains the point.
             *
             * This means that the point is:
             * - inside the physical division thickness; or
             * - inside a compartment completely occupied by the division.
             */
            return undefined;
        }

        return findRecursive(cabinet.rootCompartmentId, rootBounds);
    }

	/**
     * Validates whether a new division can be added to the selected compartment.
     *
     * The validation ensures that:
     * - the division ID and orientation are valid;
     * - the coordinates and thickness are finite numbers;
     * - the physical thickness fits inside the parent compartment;
     * - the effective position is inside the parent compartment;
     * - child compartment IDs correspond to real remaining spaces;
     * - all newly generated IDs are unique.
     *
     * The thickness is never reduced. If the requested position would cause the
     * division to exceed the parent compartment, addDivision adjusts the position
     * before calling this validation.
     */
    function validateDivisionInput(cabinet: Cabinet, input: AddDivisionInput, parentBounds: CompartmentBounds, effectivePosition: number, firstCompartmentId: string | undefined, secondCompartmentId: string | undefined): void {
        if (!input.id) {
            throw new Error("A division ID is required.");
        }

        if (input.orientation !== "Horizontal" && input.orientation !== "Vertical" ) {
            throw new Error(`Division '${input.id}' has an invalid orientation.`);
        }

        if (!Number.isFinite(input.x) || !Number.isFinite(input.y)) {
            throw new Error(`Division '${input.id}' coordinates must be finite numbers.`);
        }

        if (!Number.isFinite(input.thickness) || input.thickness <= 0) {
            throw new Error(`Division '${input.id}' thickness must be a finite number ` + `greater than zero.`);
        }

        if (cabinet.divisions[input.id]) {
            throw new Error(`Division '${input.id}' already exists.`);
        }

        const availableSize = input.orientation === "Vertical" ? parentBounds.width : parentBounds.height;

        /*
        * The physical thickness cannot be reduced.
        *
        * If the thickness is larger than the complete parent compartment,
        * no position adjustment can make the division fit.
        */
        /*
        if (input.thickness > availableSize) {
            throw new Error(`${input.orientation} division '${input.id}' cannot fit inside ` + `the selected compartment. Physical thickness: ` + `${input.thickness}, available size: ${availableSize}.` );
        }
        */

        if (!Number.isFinite(effectivePosition)) {
            throw new Error( `The calculated effective position of division ` + `'${input.id}' is invalid.` );
        }

        /*
        if (effectivePosition < 0 || effectivePosition + input.thickness > availableSize) {
            throw new Error(`${input.orientation} division '${input.id}' does not fit ` + `inside the selected compartment. Effective position: ` + `${effectivePosition}, thickness: ${input.thickness}, ` + `available size: ${availableSize}.` );
        }
        */

        const firstSize = effectivePosition;

        const secondSize = availableSize - effectivePosition - input.thickness;

        /*
        * A compartment ID must exist if and only if real available
        * space exists on that side of the physical division.
        */
        if (firstSize > 0 && !firstCompartmentId) {
            throw new Error(`Division '${input.id}' requires a first compartment.`);
        }

        if (secondSize > 0 && !secondCompartmentId) {
            throw new Error(`Division '${input.id}' requires a second compartment.`);
        }

        if (firstSize === 0 && firstCompartmentId) {
            throw new Error(`Division '${input.id}' must not create a zero-sized ` + `first compartment.`);
        }

        if (secondSize === 0 && secondCompartmentId) {
            throw new Error(`Division '${input.id}' must not create a zero-sized ` + `second compartment.`);
        }

        if (firstCompartmentId && secondCompartmentId && firstCompartmentId === secondCompartmentId) {
            throw new Error(`Division '${input.id}' generated duplicate compartment IDs.`);
        }

        if (firstCompartmentId && cabinet.compartments[firstCompartmentId]) {
            throw new Error(`Compartment '${firstCompartmentId}' already exists.`);
        }

        if (secondCompartmentId && cabinet.compartments[secondCompartmentId]) {
            throw new Error(`Compartment '${secondCompartmentId}' already exists.`);
        }
    }


	// ============================================================================
	// 3 - Public Functions
	// ============================================================================
	/**
	 * Creates an empty cabinet containing one root compartment.
	 *
	 * The root compartment represents the complete internal cabinet space.
	 * Its bounds are derived from the cabinet dimensions and are not stored
	 * directly on the compartment.
	*/
	function createCabinet(width: number, height: number, depth: number): Cabinet {
        if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(depth)) {
            throw new Error("Cabinet dimensions must be finite numbers.");
        }

        if (width <= 0 || height <= 0 || depth <= 0) {
            throw new Error( "Cabinet dimensions must be greater than zero.");
        }

        const rootCompartmentId = "root";

        return {
            width,
            height,
            depth,
            rootCompartmentId,
            compartments: {
                        root: {
                            id: "root",
                            name: "Root"
                        }
                    },
            divisions: {}
        };
    }

	/**
     * Adds a division at the specified global cabinet coordinate.
     *
     * The global coordinate identifies the current leaf compartment and the
     * preferred insertion position inside that compartment.
     *
     * The division thickness represents a fixed physical dimension and is never
     * reduced.
     *
     * If the requested position would cause the division to extend beyond the
     * top or right side of the parent compartment, the position is moved toward
     * the bottom or left until the complete thickness fits.
     *
     * Examples:
     *
     * Horizontal:
     * parent height = 1000
     * requested position = 800
     * thickness = 500
     * effective position = 500
     *
     * Vertical:
     * parent width = 600
     * requested position = 500
     * thickness = 200
     * effective position = 400
     *
     * If the physical thickness is greater than the complete available size,
     * the division cannot be inserted and an error is thrown.
     */
    function addDivision(cabinet: Cabinet, input: AddDivisionInput ): Division {
        /*
        * Validate fundamental input values before searching for the
        * compartment.
        */
        if (!input.id) {
            throw new Error("A division ID is required.");
        }

        if (input.orientation !== "Horizontal" && input.orientation !== "Vertical") {
            throw new Error(`Division '${input.id}' has an invalid orientation.`);
        }

        if (!Number.isFinite(input.x) || !Number.isFinite(input.y)) {
            throw new Error(`Division '${input.id}' coordinates must be finite numbers.`);
        }

        if (!Number.isFinite(input.thickness) || input.thickness <= 0) {
            throw new Error(`Division '${input.id}' thickness must be a finite number ` + `greater than zero.`);
        }

        if (cabinet.divisions[input.id]) {
            throw new Error(`Division '${input.id}' already exists.`);
        }

        /*
        * Find the current available leaf compartment using the original
        * global insertion coordinate.
        */
        const found = findCompartmentAtPosition(cabinet, input.x, input.y );

        if (!found) {
            throw new Error(`No available compartment was found at position ` + `(${input.x}, ${input.y}) for division '${input.id}'. ` + `The position may be outside the cabinet, inside an ` + `existing division, or inside a fully occupied compartment.`);
        }

        const parentCompartment = cabinet.compartments[found.compartmentId];

        if (!parentCompartment) {
            throw new Error(`Compartment '${found.compartmentId}' does not exist.`);
        }

        if (parentCompartment.divisionId) {
            throw new Error(`Compartment '${parentCompartment.id}' has already ` + `been divided or occupied.`);
        }

        const parentBounds: CompartmentBounds = {
            x: found.originX,
            y: found.originY,
            width: found.width,
            height: found.height,
            depth: found.depth
        };

        /*
        * Convert the requested global insertion coordinate to a local
        * position inside the selected compartment.
        */
        const requestedPosition = input.orientation === "Vertical" ? input.x - parentBounds.x : input.y - parentBounds.y;

        const availableSize = input.orientation === "Vertical" ? parentBounds.width : parentBounds.height;

        if (!Number.isFinite(requestedPosition)) {
            throw new Error(`The calculated position of division '${input.id}' is invalid.`);
        }

        /*
        * The insertion point itself must belong to the parent compartment.
        *
        * The bottom and left boundaries are valid.
        * The top and right boundaries are excluded.
        */
        if (requestedPosition < 0 || requestedPosition >= availableSize) {
            throw new Error(`${input.orientation} division '${input.id}' has an invalid ` + `requested position. Local position: ${requestedPosition}, ` + `available size: ${availableSize}.`);
        }

        /*
        * A fixed physical component cannot fit if its thickness is larger
        * than the complete available dimension.
        */
        /*
        if (input.thickness > availableSize) {
            throw new Error(`${input.orientation} division '${input.id}' cannot fit inside ` + `compartment '${parentCompartment.id}'. Physical thickness: ` + `${input.thickness}, available size: ${availableSize}.`);
        }
        */

        /*
        * Calculate the latest possible starting position at which the
        * complete physical thickness still fits.
        *
        * Horizontal:
        * this is the highest possible position.
        *
        * Vertical:
        * this is the rightmost possible position.
        */
        let maximumValidPosition = availableSize - input.thickness;
        //const maximumValidPosition = Math.max(0,availableSize - input.thickness);
        if (maximumValidPosition < 0) { //It does not fit, so we do not adjust the position
            maximumValidPosition = requestedPosition;
        }
        /*
        * Preserve the requested position when the component already fits.
        *
        * Otherwise move it toward the bottom or left until its complete
        * thickness is inside the parent compartment.
        */
        const effectivePosition = Math.min(requestedPosition, maximumValidPosition);

        const wasPositionAdjusted = effectivePosition !== requestedPosition;

        /*
        * Calculate the remaining usable spaces using the fixed physical
        * thickness and the corrected position.
        */
        const firstSize = effectivePosition;

        const secondSize = availableSize - effectivePosition - input.thickness;

        const firstSuffix = input.orientation === "Vertical" ? "left" : "bottom";

        const secondSuffix = input.orientation === "Vertical" ? "right" : "top";

        /*
        * Generate a child compartment only if real usable space remains
        * on that side of the division.
        */
        const firstCompartmentId: string | undefined = firstSize > 0 ? `${parentCompartment.id}_${firstSuffix}` : undefined;

        const secondCompartmentId: string | undefined = secondSize > 0 ? `${parentCompartment.id}_${secondSuffix}` : undefined;

        validateDivisionInput(
            cabinet,
            input,
            parentBounds,
            effectivePosition,
            firstCompartmentId,
            secondCompartmentId
        );

        /*
        * Store the effective position and the original requested position.
        *
        * The physical thickness remains unchanged.
        */
        const division: Division = {
            id: input.id,
            parentCompartmentId: parentCompartment.id,
            orientation: input.orientation,
            position: effectivePosition,
            requestedPosition,
            thickness: input.thickness,
            wasPositionAdjusted,
            firstCompartmentId,
            secondCompartmentId
        };

        /*
        * Create only compartments with a size greater than zero.
        */
        if (firstCompartmentId) {
            cabinet.compartments[firstCompartmentId] = {
                id: firstCompartmentId,
                name: firstCompartmentId
            };
        }

        if (secondCompartmentId) {
            cabinet.compartments[secondCompartmentId] = {
                id: secondCompartmentId,
                name: secondCompartmentId
            };
        }

        /*
        * Store the division and mark the parent as divided or occupied.
        *
        * This also applies when the division occupies the complete parent
        * and therefore creates no child compartments.
        */
        cabinet.divisions[input.id] = division;

        parentCompartment.divisionId = division.id;

        return division;
    }


	// ============================================================================
	// 4 - Implementation
	// ============================================================================

    // Get the FreeSpace and StartPosition
    const CarcaseSpaceDimension = JSON.parse(module.mod_CarcaseSpaceDimension[0]);

    // First create the cabinet
    const cabinet = createCabinet(CarcaseSpaceDimension.WidthFreeSpace, CarcaseSpaceDimension.HeightFreeSpace, CarcaseSpaceDimension.DepthFreeSpace);

    // Add divisions

    if (Array.isArray(module.m)) {
        const modules = module.m as any[];

        let counterCO = 0;
        let counterID = 0;

        modules.forEach((p, index) => {

            //////////// If there is a shelfadjMultiple ////////////

            if (p instanceof OD_M_me_ShelfadjMultiple01) {
                // Add the shelfadjMultiple
                const heightPosition = Math.max(p.mod_ShelfadjGroupPositionY ?? 0,0);
                let compartmentOfInsertion = findCompartmentAtPosition(cabinet, p.mod_ShelfadjGroupPositionX ?? 0, heightPosition);

                p.mod_Width = compartmentOfInsertion?.width ?? 0;
                p.mod_Depth = compartmentOfInsertion?.depth ?? 0;
                p.mod_ShelfadjPartParentName = "Equipment_Door";
                if (module.mod_ModuleName == "mf_RackArea") {
                    p.mod_ShelfadjPartParentName = "Equipment_RackArea";
                }
                p.mod_ShelfadjPartParentType = module.mod_DoorType ?? "All";
                p.mod_CarcaseSpaceDimension.push(module.mod_CarcaseSpaceDimension[0]);
                p.mod_FreeSpaceY = compartmentOfInsertion?.height ?? 0;
                p.mod_FreeSpaceStartPosY = compartmentOfInsertion?.originY ?? 0;
                const VertDividerInfoList = JSON.parse(module.mod_VertDividerInfoList?.[0] ?? "{}");
                const vertDividerType = VertDividerInfoList.Type ?? "Automatic";
                p.mod_VertDividerType = vertDividerType;

                p.mod_VertDividerPosition = VertDividerInfoList.PosX + VertDividerInfoList.DimX / 2 - CarcaseSpaceDimension.WidthFreeStartPos;
                p.mod_CarcaseId = module.mod_CarcaseId;

                // SetOrigin of the child
                p.setOrigin(compartmentOfInsertion?.originX + CarcaseSpaceDimension.WidthFreeStartPos - module.mod_Originpos[0], compartmentOfInsertion?.originY + CarcaseSpaceDimension.HeightFreeStartPos - module.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - module.mod_Originpos[2]);

                // Create new compartments
                addDivision(cabinet, {
                    id: index + "_ShelfAdjustable",
                    orientation: "Horizontal",
                    x: p.mod_ShelfadjGroupPositionX ?? 0,
                    y: heightPosition,
                    thickness: p.mod_Height ?? 0
                });

                
            }


            //////////// If there is a Clothing Organizer ////////////
            
            else if (p instanceof OD_M_me_ClothingOrganizer01) {
                // Add the Clothing Organizer
                let compartmentOfInsertion = findCompartmentAtPosition(cabinet, p.mod_ClothingOrganizerWidthPosition ?? 0, p.mod_ClothingOrganizerHeightPosition ?? 0);
                counterCO++;
                const compartmentheight = compartmentOfInsertion?.height ?? 0;
                p.mod_Width = compartmentOfInsertion?.width ?? 0;
                p.mod_Depth = compartmentOfInsertion?.depth ?? 0;
                p.mod_Height = compartmentheight;
                p.mod_ClothingOrganizerId = module.mod_FrontId + "_CO_" + counterCO;
                p.mod_CarcaseId = module.mod_CarcaseId;
                p.mod_Originpos.push(compartmentOfInsertion?.originX ?? 0);
                p.mod_Originpos.push(compartmentOfInsertion?.originY ?? 0);

                // SetOrigin of the child
                p.setOrigin(compartmentOfInsertion?.originX + CarcaseSpaceDimension.WidthFreeStartPos - module.mod_Originpos[0], compartmentOfInsertion?.originY + CarcaseSpaceDimension.HeightFreeStartPos - module.mod_Originpos[1] + (p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0), CarcaseSpaceDimension.DepthFreeStartPos - module.mod_Originpos[2]);

                // Calculate the space of the ClothingOrganizer (thickness)
                const clothingOrganizerInstallationDimensions = GlobalFunc.find_ClothingOrganizerInstallationDimensions(p.mod_ClothingOrganizerDesign!);
                let thicknessClothingOrganizer = clothingOrganizerInstallationDimensions[0].ClothingOrganizerInstallationMinHeight ?? 0
                thicknessClothingOrganizer += p.mod_ShelffixedTop ? (p.mod_ShelffixedTopDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
                thicknessClothingOrganizer += p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;

                // Create new compartments
                if (clothingOrganizerInstallationDimensions[0].BlocksSpaceInHeight ?? false) {
                    addDivision(cabinet, {
                        id: index + "_ClothingOrganizer",
                        orientation: "Horizontal",
                        x: p.mod_ClothingOrganizerWidthPosition ?? 0,
                        y: p.mod_ClothingOrganizerHeightPosition ?? 0,
                        thickness: thicknessClothingOrganizer
                    });
                }
            }


            //////////// If there is a Inner Drawers ////////////
            
            else if (p instanceof OD_M_me_InnerDrawerGroup) {
                // Add the Inner Drawers
                
                let compartmentOfInsertion = findCompartmentAtPosition(cabinet, p.mod_InnerDrawerWidthPosition ?? 0, p.mod_InnerDrawerHeightPosition ?? 0);
                counterID++;

                if (!compartmentOfInsertion) {
                    throw new Error("Compartment not found");
                }

                const compartmentHeight = compartmentOfInsertion?.height! ?? 0;
                const compartmentOriginY = compartmentOfInsertion?.originY! ?? 0;

                p.mod_Width = compartmentOfInsertion?.width ?? 0;
                p.mod_Depth = compartmentOfInsertion?.depth ?? 0;
                p.mod_Height = compartmentHeight;
                p.mod_FreeSpaceStartPosY = compartmentOriginY;
                p.mod_InnerDrawerId = module.mod_FrontId + "_ID_" + counterID;
                p.mod_CarcaseId = module.mod_CarcaseId;
                
                // SetOrigin of the child
                p.setOrigin(compartmentOfInsertion?.originX + CarcaseSpaceDimension.WidthFreeStartPos - module.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - module.mod_Originpos[1] + (p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0), CarcaseSpaceDimension.DepthFreeStartPos - module.mod_Originpos[2]);

                let innerDrawerThickness;
                if ( p.mod_InnerDrawerLayoutStrategy =="DefinedGroupHeight") { // if the strategy is DefinedGroupHeight
                    innerDrawerThickness = p.mod_InnerDrawerGroupHeight ?? 0;  // then the customer defines the inner drawer "block" height in the attribute mod_InnerDrawerGroupHeight
                    innerDrawerThickness += p.mod_ShelffixedTop ? (p.mod_ShelffixedTopDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
                    innerDrawerThickness += p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
                }
                else {
                    innerDrawerThickness = compartmentHeight + compartmentOriginY - p.mod_InnerDrawerHeightPosition!; // else the height will be the complete available space for the inner drawer block (reduced from the insertion point inside the space)
                    innerDrawerThickness += p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
                };
                    
                // Create new compartments
                addDivision(cabinet, {
                    id: index + "_InnerDrawer",
                    orientation: "Horizontal",
                    x: p.mod_InnerDrawerWidthPosition ?? 0,
                    y: p.mod_InnerDrawerHeightPosition ?? 0,
                    thickness: innerDrawerThickness
                });
            }


            //////////// If there is a Vert Divider ////////////
            
            else if (p instanceof OD_M_me_Vertdivider01) {
                // Add the divider
                let compartmentOfInsertion = findCompartmentAtPosition(cabinet, p.mod_VertDividerPosition ?? 0, p.mod_VertDividerPositionY ?? 0);
                p.mod_Width = compartmentOfInsertion?.width ?? 0;
                p.mod_Depth = compartmentOfInsertion?.depth ?? 0;
                p.mod_Height = compartmentOfInsertion?.height ?? 0;
                p.mod_VertDividerType = "MiddleSide";
                p.mod_CarcaseId = module.mod_CarcaseId;

                // SetOrigin of the child
                p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - module.mod_Originpos[0], compartmentOfInsertion?.originY + CarcaseSpaceDimension.HeightFreeStartPos - module.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - module.mod_Originpos[2]);

                // Create new compartments
                addDivision(cabinet, {
                    id: index + "_VertDivider",
                    orientation: "Vertical",
                    x: p.mod_VertDividerPosition ?? 0,
                    y: p.mod_VertDividerPositionY ?? 0,
                    thickness: p.mod_SidepanelmiddleThk ?? p.g.basic_SidepanelmiddleThk // Needs to be adjusted if the VertDividerType is not MiddleSide
                });
            }


            //////////// If there is a Fixed Shelf ////////////
            
            else if (p instanceof OD_M_me_Shelffixed01) {
                // Add the divider
                let compartmentOfInsertion = findCompartmentAtPosition(cabinet, p.mod_ShelffixedPosX ?? 0, p.mod_ShelffixedPosY ?? 0);
                p.mod_Width = compartmentOfInsertion?.width ?? 0;
                p.mod_Depth = compartmentOfInsertion?.depth ?? 0;
                p.mod_Height = compartmentOfInsertion?.height ?? 0;
                p.mod_CarcaseId = module.mod_CarcaseId;

                // SetOrigin of the child
                p.setOrigin(compartmentOfInsertion?.originX + CarcaseSpaceDimension.WidthFreeStartPos - module.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - module.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - module.mod_Originpos[2]);

                // Create new compartments
                addDivision(cabinet, {
                    id: index + "_ShelfFixed",
                    orientation: "Horizontal",
                    x: p.mod_ShelffixedPosX ?? 0,
                    y: p.mod_ShelffixedPosY ?? 0,
                    thickness: p.mod_ShelffixedThk ?? p.g.basic_ShelffixedThk
                });
            }
        });
    }
    
    return JSON.stringify(cabinet);



}