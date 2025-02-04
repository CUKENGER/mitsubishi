export type Optional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

export type TEroror = {
  message: string;
};

export type TErorors = {
  debugAxios?: any[];
  errors: TEroror[];
  statusCode: number;
  timestamp: string;
  data?: any;
  path: string;
};

export type TResult = {
  result: any;
  success: boolean;
};

export type TResponse = TErorors | TResult;
