import { Injectable } from '@nestjs/common';
import { AxiosService } from '@core/axios.service';
import { CoreService } from '@core/core.service';
import { QCreatorService } from '@api/services/q-creator.service';
import { BaseApiService } from '@api/services/base-api.service';
import {
  tAttributesMain,
  tTable,
  tTableHeader,
  tVehicle,
} from '@api/api-types';

interface Catalog {
  catalog_code: string;
  catalog_name: string;
  model_name: string;
  classification_name: string;
}

interface VehicleResponse {
  vin: string;
  catalogs: Catalog[];
  model_year: { year: number };
  prod_date: { year: number; month: number; block_no: number };
  color_codes: { exterior_code: string; interior_code: string };
  options: Array<{ code: string; name: string }>;
  [key: string]: any;
}

@Injectable()
export class VinService {
  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly axiosService: AxiosService,
    private readonly coreService: CoreService,
    private readonly qCreatorService: QCreatorService,
  ) {}

  #formatProductionDate(prodDate: {
    year: number;
    month: number;
    block_no: number;
  }): string {
    if (!prodDate) return null;
    const month = String(prodDate.month).padStart(2, '0');
    const day = String(prodDate.block_no).padStart(2, '0');
    return `${prodDate.year}-${month}-${day}`;
  }

  #getAttributesMain(responseVehicle: VehicleResponse): tAttributesMain[] {
    const keys = [
      'chassis_no',
      'market_code',
      'market_name',
      'catalog_code',
      'repr_model',
      'classification_code',
      'classification_name',
      'vnc',
      'model_year',
      'prod_date',
      'paint_code',
      'color_codes_exterior_code',
      'color_codes_interior_code',
      'option_set_code',
    ];

    const attributes: tAttributesMain[] = keys
      .filter((key) => responseVehicle[key] != null)
      .map((key) => ({ label: key, value: responseVehicle[key], id: key }));

    // modelYear format
    const modelYear = responseVehicle.model_year?.year ?? null;
    const modelYearAttr = {
      label: 'model_year',
      value: modelYear,
      id: 'model_year',
    };
    const modelYearIndex = attributes.findIndex(
      (attr) => attr.label === 'model_year',
    );
    if (modelYearIndex !== -1) {
      attributes[modelYearIndex] = modelYearAttr;
    } else if (modelYear !== null) {
      attributes.push(modelYearAttr);
    }

    // prodDate format
    const prodDate = this.#formatProductionDate(responseVehicle.prod_date);
    const prodDateAttr = {
      label: 'prod_date',
      value: prodDate,
      id: 'prod_date',
    };
    const prodDateIndex = attributes.findIndex(
      (attr) => attr.label === 'prod_date',
    );
    if (prodDateIndex !== -1) {
      attributes[prodDateIndex] = prodDateAttr;
    } else if (prodDate !== null) {
      attributes.push(prodDateAttr);
    }

    return attributes;
  }

  #getAttributesAdv(options: Array<{ code: string; name: string }>): tTable[] {
    if (!options.length) return [];
    const header: tTableHeader[] = [
      { id: 'code', value: 'Code' },
      { id: 'name', value: 'Name' },
    ];
    const data = options.map((option) => ({
      code: option.code,
      name: option.name,
    }));
    return [{ header, data }];
  }

  async run(vin: string) {
    const url = `/vehicle-data/${vin}`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const responseVehicle: VehicleResponse = response?.data ?? null;
    if (!responseVehicle) {
      return {
        resultCode: this.baseApiService.RESULT_CODE_VIN_NOT_FOUND,
        success: false,
        lang: this.coreService.lang(),
        result: null,
      };
    }

    const catalogCode = responseVehicle.catalogs[0]?.catalog_code;
    const catalogIndex = responseVehicle.catalogs.findIndex(
      (catalog) => catalog.catalog_code === catalogCode,
    );
    const catalog = responseVehicle.catalogs[catalogIndex];

    const vehicleId = this.qCreatorService.createQ({
      method: 'getVehicleId',
      vin: responseVehicle.vin,
    });
    const attributesMain = this.#getAttributesMain(responseVehicle);
    const attributesAdv = this.#getAttributesAdv(responseVehicle.options);
    const productionDate = this.#formatProductionDate(
      responseVehicle.prod_date,
    );

    const vehicle: tVehicle = {
      vin: responseVehicle.vin,
      vehicleId,
      name: `${catalog.catalog_name}, ${productionDate}`,
      nameFull: `${catalog.catalog_name} ${catalog.model_name} (${catalog.classification_name})`,
      nameShort: catalog.catalog_name,
      modelName: catalog.catalog_name,
      brandId: 'mitsubishi',
      brandName: 'Mitsubishi',
      qMainGroup: this.qCreatorService.createQ({
        method: 'getMainGroup',
        vin: responseVehicle.vin,
        vehicleId,
      }),
      attributesMain,
      attributesAdv,
    };

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      vehicle,
    };
  }
}
