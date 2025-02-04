import { Injectable } from '@nestjs/common';
import { iQService, tListItem, tQData } from '@api/api-types';
import { AxiosService } from '@core/axios.service';
import { BaseApiService } from '../base-api.service';
import { QCreatorService } from '../q-creator.service';
import { CoreService } from '@core/core.service';
@Injectable()
export class QGroupsService implements iQService {
  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly axiosService: AxiosService,
    private readonly qCreatorService: QCreatorService,
    private readonly coreService: CoreService,
  ) {}

  async OtherRun() {
    throw new Error('Method not implemented.');
  }

  async run(qData: tQData) {
    const url = `/main-groups/${qData.vehicleId}`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const groups = response?.data ?? [];
    const lists: tListItem[] = groups.map((group) => ({
      title: group.title,
      code: group.code,
      q: this.qCreatorService.createQ({
        method: 'getNodes',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { groupId: group.id },
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
