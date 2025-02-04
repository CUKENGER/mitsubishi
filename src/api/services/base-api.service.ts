import { Injectable } from '@nestjs/common';
import { CoreService } from '@core/core.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseApiService {
  readonly RESULT_CODE_OK: number = 200;
  readonly RESULT_CODE_VIN_NOT_FOUND: number = 404;
  readonly RESULT_CODE_VIN_NOT_CORRECT: number = 410;
  readonly RESULT_CODE_500: number = 500;
  readonly RESULT_CODE_CATALOG_DISABLED: number = 503;
  readonly RESULT_CODE_CATALOG_TIME_OUT: number = 1002;
  readonly RESULT_CODE_NOT_DATA: number = 1001;

  #baseUrl;
  constructor(
    private readonly coreService: CoreService,
    private readonly configService: ConfigService,
  ) {
    this.#baseUrl = this.configService.get('URL_CATALOG');
  }

  urlCatalog(url: string): string {
    const lang = this.coreService.lang();
    return `${this.#baseUrl}/${lang}${url}`;
  }
}
