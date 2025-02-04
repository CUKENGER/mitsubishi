import { Injectable } from '@nestjs/common';

import { encode, decode } from 'js-base64';
import { tQData } from '@api/api-types';

/**
 * Класс отвечает за создание / чтение Q
 */
@Injectable()
export class QCreatorService {
  /**
   * Создает q на основе объекта
   * @param data
   */
  createQ(data: any): string {
    let strQ: string;
    try {
      data.type = 'offline';
      const text: string = JSON.stringify(data);
      return encode(text).replaceAll('/', '__').replaceAll('+', '--');
    } catch (e) {
      if (e instanceof Error) console.log('error - ', e.message);
    }

    return strQ;
  }

  /**
   * Расшифровывает q, возращает объект
   * @param str
   */
  readQ(str: string): tQData {
    try {
      const text = decode(str.replaceAll('__', '/').replaceAll('--', '+'));
      return JSON.parse(text) as tQData;
    } catch (e) {
      if (e instanceof Error) console.log('error - ', e.message);
    }
  }
}
