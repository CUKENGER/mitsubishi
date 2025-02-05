import { Injectable } from '@nestjs/common';
import { iQService, tListItem, tQData } from '@api/api-types';
import { QCreatorService } from '../q-creator.service';
import { BaseApiService } from '../base-api.service';
import { AxiosService } from '@core/axios.service';
import { CoreService } from '@core/core.service';

@Injectable()
export class QNodesService implements iQService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly baseApiService: BaseApiService,
    private readonly qCreatorService: QCreatorService,
    private readonly coreService: CoreService,
  ) { }

  async run(qData: tQData) {
    const url = `/${qData.vin}/subgroups`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const nodes = response?.data ?? [];
    console.log('nodes', nodes);
    const lists: tListItem[] = nodes.map((node) => ({
      title: node.name,
      code: node.code,
      q: this.qCreatorService.createQ({
        method: 'getNode',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { 
          nodeId: node.code, 
          nodeTitle: node.name 
        },
      }),
    }));

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      success: true,
      lang: this.coreService.lang(),
      result: { lists },
    };
  }
}
