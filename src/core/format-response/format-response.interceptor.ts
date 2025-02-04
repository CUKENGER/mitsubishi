import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class FormatResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        const ctx = executionContext.switchToHttp();
        const request = ctx.getRequest<Request>();
        if (request['_errors']) {
          return {
            success: false,
            errors: request['_errors'],
          };
        }

        if (value?.params) delete value.params;
        let res: any = { success: true, result: value };
        if (value?.errors) res = { success: false, errors: value.errors };
        return res;
      }),
    );
  }
}
