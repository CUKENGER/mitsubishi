import { Injectable } from '@nestjs/common';
import { iQService, tNode, tQData } from '@api/api-types';
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

  async run(qData: tQData) {
    const url = `/${qData.vin}/search-catalog`
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false, params: {query: qData.data.nodeTitle} },
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
      ...nodeData.subgroups[0],
      qGroup: this.qCreatorService.createQ({
        method: 'getNodes',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { groupId: nodeData.subgroups[0].code },
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
