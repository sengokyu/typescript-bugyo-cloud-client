import { default as bunyan, default as Logger, LoggerOptions } from "bunyan";

const loggerOptions: LoggerOptions = {
  name: "BugyoCloudClient",
};

export class LoggerFactory {
  private static _logger: Logger;

  private static get Logger(): Logger {
    if (!LoggerFactory._logger) {
      LoggerFactory._logger = bunyan.createLogger(loggerOptions);
    }

    return LoggerFactory._logger;
  }

  public static get options(): LoggerOptions {
    return loggerOptions;
  }

  public static getLogger(loggerName: string): Logger {
    return LoggerFactory.Logger.child({ loggerName });
  }
}
