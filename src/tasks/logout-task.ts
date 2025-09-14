import { BugyoCloudClient } from "../bugyo-cloud-client";
import { CallLogout } from "../endpoints/call-logout";
import { Logger } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * ログアウトします。
 */
export class LogoutTask implements BaseTask {
  constructor(
    private readonly logger: Logger,
    private readonly callLogout: CallLogout
  ) {}

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Invoking CallLogout.");

    await this.callLogout.invoke(client);
  }
}
