import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Optional, TEroror, TErorors, TResponse } from './response-types';

function formatResponse(
  responseError: Optional<TErorors, 'timestamp'>,
): TResponse {
  if (!responseError.timestamp)
    responseError.timestamp = new Date().toISOString();
  const timestamp = responseError.timestamp
    ? responseError.timestamp
    : new Date().toISOString();
  return { ...responseError, timestamp };
}

@Catch(HttpException)
@Injectable({ scope: Scope.REQUEST })
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseException = exception.getResponse() as TEroror;

    console.error('ERROR: ', exception.message);

    let errors;
    if (responseException?.message) {
      errors = [{ message: responseException.message }];
    }

    const body: TErorors = formatResponse({
      errors,
      statusCode: status,
      data: {
        body: request.body,
        query: request.query,
      },
      path: request.url,
    }) as TErorors;

    if (exception instanceof BadRequestException) {
      return response.status(200).json(body);
    }

    if (exception instanceof BadGatewayException) {
      body.statusCode = 500;
      return response.status(200).json(body);
    }

    if (exception instanceof UnauthorizedException) {
      return response.status(401).json(body);
    }

    response.status(200).json({ result: {} });
  }
}

export function validationFormat(host: ArgumentsHost, formattedErrors: object) {
  const ctx = host.switchToHttp();
  const request = ctx.getRequest<Request>();
  // const response = ctx.getResponse<Response>();
  let errors;
  if (formattedErrors && Array.isArray(formattedErrors)) {
    errors = [];
    formattedErrors.forEach((message) => {
      errors.push({ message });
    });
  }

  const body: TErorors = formatResponse({
    errors,
    statusCode: 400,
    path: request.url,
  }) as TErorors;

  // response
  //   .status(400)
  //   .json(body);

  return body;
}
