import { ConflictException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AxiosService {
  private _axiosConfig: AxiosRequestConfig;
  #DEBUG;
  #baseURL;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this._axiosConfig = {
      timeout: 20000,
    };
    this.#DEBUG = this.configService.get('DEBUG');
    this.#baseURL = this.configService.get('URL_CATALOG');
  }

  addHeader(key, val) {
    this._axiosConfig.headers[key] = val;
  }

  getAxiosConfig() {
    return this._axiosConfig;
  }

  getHttpService() {
    return this.httpService;
  }

  async get(url, options = null): Promise<AxiosResponse> {
    const prms = { url, options };
    return this._axiosMethod(prms);
  }

  async post(url, data, options = null): Promise<AxiosResponse> {
    const prms = { url, data, options, type: 'post' };
    return this._axiosMethod(prms);
  }

  private async _axiosMethod(prms): Promise<AxiosResponse> {
    const url = prms.url ?? null;
    const data = prms.data ?? null;
    let opt = prms.options ?? null;
    const type = prms.type ?? 'get';
    const flagException: boolean = !!(opt.flagException ?? true);

    if (!opt) opt = this.getAxiosConfig();
    const headers = { ...this.getAxiosConfig().headers };

    if (opt.token) {
      headers['Authorization'] = opt.token;
    }

    if (opt.headers) {
      for (const k in opt.headers) {
        if (opt.headers[k]) headers[k.toLowerCase()] = opt.headers[k];
      }
    }
    opt.headers = headers;

    let response: AxiosResponse;

    if (type === 'get') {
      response = (await this.getHttpService()
        .axiosRef.get(url, opt)
        .catch((e) => {
          if (this.#DEBUG) {
            console.log('error: ', e.response.data);
          }
          if (flagException) {
            this.#_NewException(e);
          }
        })) as AxiosResponse;
    } else if (type === 'post') {
      response = (await this.getHttpService()
        .axiosRef.post(url, data, opt)
        .catch((e) => {
          if (this.#DEBUG) {
            console.log('error: ', e.response.data);
          }
          if (flagException) {
            this.#_NewException(e);
          }
        })) as AxiosResponse;
    }
    return response;
  }

  #_NewException(e) {
    let str = `${e.message} (code - ${e.response?.status | e.code})`;
    const errors = e.response?.data.errors;
    if (errors) {
      str = '';
      errors.forEach((err) => {
        str += err.message + '\n';
      });
    }

    throw new ConflictException({
      message: str,
      responseData: { data: e.response?.data },
    });
  }
}
