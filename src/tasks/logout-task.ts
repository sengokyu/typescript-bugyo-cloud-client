import { BugyoCloudClient } from "..";
import { CallLogout } from "../endpoints/call-logout";
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

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.debug("Trying to logout from BUGYO CLOUD.");

    await new CallLogout(this.loggerFactory).invoke(client);
  }
}
