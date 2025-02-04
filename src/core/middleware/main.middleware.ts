import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MainMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const lang: string = req.headers['accept-language'];
    const requestData = { lang };
    req['requestData'] = requestData;
    next();
  }
}
