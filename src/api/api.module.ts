import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { VinService } from './services/vin.service';
import { BaseApiService } from '@api/services/base-api.service';
import { QCreatorService } from '@api/services/q-creator.service';
import { QNodesService } from './services/q/q-nodes.service';
import { QNodeService } from './services/q/q-node.service';
import { QGroupsService } from './services/q/q-groups.service';
import { QService } from './services/q.service';

@Module({
  controllers: [ApiController],
  providers: [
    VinService,
    BaseApiService,
    QCreatorService,
    QNodesService,
    QNodeService,
    QGroupsService,
    QService,
  ],
})
export class ApiModule {}
