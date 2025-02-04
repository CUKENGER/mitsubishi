import { BadRequestException, Injectable } from '@nestjs/common';
import { QGroupsService } from '@api/services/q/q-groups.service';
import { QNodesService } from '@api/services/q/q-nodes.service';
import { QNodeService } from '@api/services/q/q-node.service';
import { QCreatorService } from '@api/services/q-creator.service';
import { iQService, tResult } from '@api/api-types';

@Injectable()
export class QService {
  constructor(
    private readonly qCreatorService: QCreatorService,
    private readonly qGroupsService: QGroupsService,
    private readonly qNodesService: QNodesService,
    private readonly qNodeService: QNodeService,
  ) {}

  async run(q: string): Promise<tResult> {
    const qData = this.qCreatorService.readQ(q);
    console.log(`qData`, qData);
    const method = qData.method;
    console.log(`method`, method);
    let model: iQService;

    switch (method) {
      case 'getNode':
        model = this.qNodeService;
        console.log(`model`, model);
        break;
      case 'getNodes':
        model = this.qNodesService;
        console.log(`model`, model);
        break;
      case 'getMainGroup':
        model = this.qGroupsService;
        console.log(`model`, model);
        break;
      default:
        throw new BadRequestException('Не определена модель');
    }

    const ret = await model.run(qData);
    console.log(`ret`, ret);
    return ret;
  }
}
