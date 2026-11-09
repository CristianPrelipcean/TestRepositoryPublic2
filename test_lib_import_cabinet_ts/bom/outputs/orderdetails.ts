      const simpleSvg = (title: string) =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120">` +
        `<rect x="10" y="10" width="180" height="100" fill="none" stroke="#333" stroke-width="2"/>` +
        `<text x="100" y="65" font-family="Arial" font-size="14" text-anchor="middle">${title}</text>` +
        `</svg>`;

      if(od.additionalData == null) {
        od.additionalData = [];
      }

      if (flags.bom == true) {
        let filename = uuidv4();
        this.createFileEntry(result, filename, simpleSvg('BOM drawings'), 'image/svg+xml');
        od.additionalData.push({name: filename, type: OM.AdditionalDataTypeEnum.Image} as OM.AdditionalDataEntity);

        filename = uuidv4();
        this.createFileEntry(result, filename, 'bom data information');
        od.additionalData.push({name: filename, type: OM.AdditionalDataTypeEnum.Unknown} as OM.AdditionalDataEntity);
      }
      if (flags.partDrawings == true) {
        let filename = uuidv4();
        this.createFileEntry(result, filename, simpleSvg('Part drawings'), 'image/svg+xml');
        od.additionalData.push({name: filename, type: OM.AdditionalDataTypeEnum.Image} as OM.AdditionalDataEntity);
      }
      if (flags.partProcessings == true) {
        let filename = uuidv4();
        this.createFileEntry(result, filename, simpleSvg('Part processings'), 'image/svg+xml');
        od.additionalData.push({name: filename, type: OM.AdditionalDataTypeEnum.Image} as OM.AdditionalDataEntity);
      }
      if (flags.roomDrawings == true) {
        let filename = uuidv4();
        this.createFileEntry(result, filename, simpleSvg('Room drawings'), 'image/svg+xml');
        od.additionalData.push({name: filename, type: OM.AdditionalDataTypeEnum.Image} as OM.AdditionalDataEntity);
      }

      od.addresses?.push({city: "Test City"} as OM.Address);
      od.quantityOfArticles = 123;
      od.items.push({material: "test material", quantity: 23, type: OM.TypeEnum.EdgeBandType} as OM.Board);