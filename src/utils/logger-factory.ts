export interface Logger {
  trace(obj: Object, ...params: Array<any>): void;
  debug(obj: Object, ...params: Array<any>): void;
  info(obj: Object, ...params: Array<any>): void;
  error(obj: Object, ...params: Array<any>): void;
}

export class LoggerFactory {
  public static getLogger(loggerName: string): Logger {
    return {
      loggerName,
      trace(obj: Object, ...params: Array<any>): void {
        LoggerFactory.log(obj, params);
      },
      debug(obj: Object, ...params: Array<any>): void {
        LoggerFactory.log(obj, params);
      },
      info(obj: Object, ...params: Array<any>): void {
        LoggerFactory.log(obj, params);
      },
      error(obj: Object, ...params: Array<any>): void {
        LoggerFactory.log(obj, params);
      },
    } as Logger;
  }

  private static log(obj: Object, params: Array<any>) {
    if (console) {
      console.log(obj, params);
    }
  }
}
