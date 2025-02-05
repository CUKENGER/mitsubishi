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
  ) {}

  #createLists(nodes, qData) {
    const lists = nodes.map((node) => {
      const path = node.diagram.illustrationPath;
      return {
        title: node.name,
        code: `${nodes.main_group_code}-${node.code}`,
        q: this.qCreatorService.createQ({
          vin: qData.vin,
          vehicleId: qData.vehicleId,
          method: 'getNode',
          data: { nodeId: node.code, nodeTitle: node.name },
        }),
        qImage: this.qCreatorService.createQ({
          vin: qData.vin,
          vehicleId: qData.vehicleId,
          method: 'getImage',
          data: { name: path },
        })
      };
    });
    return lists;
  }

  async run(qData: tQData) {
    const url = `/${qData.vin}/subgroups`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const nodes = response?.data ?? [];
    const path = nodes.diagram;
    console.log('path', path);
    console.log('nodes', nodes);
    const lists: tListItem[] = this.#createLists(nodes, qData);

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      success: true,
      lang: this.coreService.lang(),
      result: { lists },
    };
  }
}
