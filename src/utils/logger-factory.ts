export interface Logger {
  trace(obj: Object, ...params: Array<any>): void;
  debug(obj: Object, ...params: Array<any>): void;
  info(obj: Object, ...params: Array<any>): void;
  error(obj: Object, ...params: Array<any>): void;
}

export interface LoggerFactory {
  getLogger(loggerName: string): Logger;
}
