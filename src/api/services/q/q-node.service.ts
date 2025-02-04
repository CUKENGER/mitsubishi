import { Injectable } from '@nestjs/common';
import { iQService, tNode } from '@api/api-types';
import { AxiosService } from '@core/axios.service';
import { BaseApiService } from '../base-api.service';
import { QCreatorService } from '../q-creator.service';
import { CoreService } from '@core/core.service';
@Injectable()
export class QNodeService implements iQService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly baseApiService: BaseApiService,
    private readonly qCreatorService: QCreatorService,
    private readonly coreService: CoreService,
  ) {}

  async run(qData: any) {
    const url = `/node/${qData.vehicleId}/${qData.data.nodeId}`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const nodeData = response?.data ?? null;
    if (nodeData === null) {
      return {
        resultCode: this.baseApiService.RESULT_CODE_NOT_DATA,
        success: false,
        lang: this.coreService.lang(),
        result: null,
      };
    }

    const node: tNode = {
      ...nodeData,
      qGroup: this.qCreatorService.createQ({
        method: 'getNodes',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { groupId: nodeData.groupId },
      }),
    };

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      success: true,
      lang: this.coreService.lang(),
      result: { node },
    };
  }
}
