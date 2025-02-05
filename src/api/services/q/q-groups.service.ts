import { Injectable } from '@nestjs/common';
import { iQService, tQData } from '@api/api-types';
import { AxiosService } from '@core/axios.service';
import { BaseApiService } from '../base-api.service';
import { QCreatorService } from '../q-creator.service';
import { CoreService } from '@core/core.service';

@Injectable()
export class QGroupsService implements iQService {
  private readonly areas = [
    {
      code: 'E',
      name: 'engine',
      title: 'Двигатель',
    },
    {
      code: 'PT',
      name: 'powertrain',
      title: 'Силовой агрегат',
    },
    {
      code: 'B',
      name: 'body',
      title: 'Кузов',
    },
    {
      code: 'EL',
      name: 'electrical',
      title: 'Электрика',
    },
  ];
  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly axiosService: AxiosService,
    private readonly qCreatorService: QCreatorService,
    private readonly coreService: CoreService,
  ) { }

  async OtherRun() {
    throw new Error('Method not implemented.');
  }

  #getImages(data) {
    if (!data) return;
    const path = data.diagram?.illustration_path;
    const hotspots = data.diagram?.hotspots;

    let images = [];
    hotspots.map((hotspot) => {
      const name = hotspot.name;
      const qImage = this.qCreatorService.createQ({
        method: 'getImage',
        vin: data.vin,
        data: { name, path },
      });
      const image = {
        name,
        qImage,
      };
      images.push(image);
    });
    return images;
  }

  #createGroups(groups, qData, images) {
    return groups.map((group) => {
      const qValue = this.qCreatorService.createQ({
        method: 'getNodes',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { groupId: group.code },
      });
      let qImage = null;
      if (images) {
        const index = images.findIndex((i) => (i.name = group.code));
        qImage = images[index].qImage;
      }
      return {
        title: group.name,
        code: group.code,
        q_main_group: qValue,
        q: qValue,
        major_group_name: group.major_group_name,
        qImage: qImage,
      };
    });
  }

  #createAreas(qData: tQData) {
    return this.areas.map((area) => {
      const qValue = this.qCreatorService.createQ({
        method: 'getNodes',
        vin: qData.vin,
        vehicleId: qData.vehicleId,
        data: { groupId: area.code },
      });
      const qImage = this.qCreatorService.createQ({
        method: 'getImage',
        vin: qData.vin,
        data: { name: area.code },
      });
      return {
        q: qValue,
        q_main_group: qValue,
        code: area.code,
        title: area.title,
        qImage: qImage
      }
    });
  }

  async run(qData: tQData) {
    const url = `/${qData.vin}/main-groups`;
    const response = await this.axiosService.get(
      this.baseApiService.urlCatalog(url),
      { flagException: false },
    );

    const images = this.#getImages(response.data);
    const groups = response?.data?.main_groups ?? [];
    const lists = this.#createGroups(groups, qData, images);

    let listsArea = this.#createAreas(qData);

    let listsGroup = [
      {
        tab: 1,
        title: this.coreService.t('groups'),
        lists,
      },
      {
        tab: 2,
        title: this.coreService.t('areas'),
        lists: listsArea,
      },
    ];

    return {
      resultCode: this.baseApiService.RESULT_CODE_OK,
      lists_group: listsGroup,
    };
  }
}
