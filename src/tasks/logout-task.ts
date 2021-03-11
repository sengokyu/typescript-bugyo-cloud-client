import { BugyoCloudClient } from "..";
import { CallLogout } from "../endpoints/calll-logout";
import { Logger, LoggerFactory } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * ログアウトします。
 */
export class LogoutTask implements BaseTask {
  private readonly logger: Logger;

  constructor(private loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(LogoutTask.name);
  }

  execute(client: BugyoCloudClient): Promise<void> {
    this.logger.debug("Trying to logout from BUGYO CLOUD.");

    return new CallLogout(this.loggerFactory).invoke(client);
  }
}
