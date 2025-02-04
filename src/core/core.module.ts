import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { CoreService } from './core.service';
import { AxiosService } from '@core/axios.service';
import * as path from 'path';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [CoreService, AxiosService],
  exports: [CoreService, AxiosService],
  imports: [
    HttpModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'ru',
        // formatter: (template: string) => template,
        loaderOptions: {
          path: path.join(__dirname, '../i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        AcceptLanguageResolver,
        // new HeaderResolver(['accept-language']),
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
