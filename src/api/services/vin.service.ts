import { Injectable } from '@nestjs/common';
import { AxiosService } from '@core/axios.service';
import { CoreService } from '@core/core.service';
import { QCreatorService } from '@api/services/q-creator.service';
import { BaseApiService } from '@api/services/base-api.service';
import { tVehicle } from '@api/api-types';

@Injectable()
export class VinService {
  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly axiosService: AxiosService,
    private readonly coreService: CoreService,
    private readonly qCreatorService: QCreatorService,
  ) {}

  async run(vin: string) {
    const url = `/vehicle-data/${vin}`;
    const response = await this.axiosService.get(
      // this.baseApiService.urlCatalog(url),
      `http://mmcasa-dev.apcloud.local/api/asa/ru${url}`,
      { flagException: false },
    );

    const responseVehicle = response?.data ?? null;
    if (responseVehicle === null) {
      return {
        resultCode: this.baseApiService.RESULT_CODE_VIN_NOT_FOUND,
        success: false,
        lang: this.coreService.lang(),
        result: null,
      };
    }

    const vehicle: tVehicle = {
      ...responseVehicle,
      qMainGroup: this.qCreatorService.createQ({
        method: 'getMainGroup',
        vin: responseVehicle.vin,
        vehicleId: responseVehicle.vehicleId,
      }),
    };

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      success: true,
      lang: this.coreService.lang(),
      result: { ...vehicle },
    };
  }
}
