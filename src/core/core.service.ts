import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CoreService {
  constructor(private readonly i18n: I18nService) {}

  t(str: string): string {
    return this.i18n.t(str, { lang: I18nContext.current().lang });
  }
  lang(): string {
    return I18nContext.current().lang;
  }
}
