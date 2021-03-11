import { BugyoCloudClient } from "../bugyo-cloud-client";
import { PunchmarkPage } from "../endpoints/punchmark-page";
import { TimeClock } from "../endpoints/time-clock";
import { PunchInfo } from "../models/punch-info";
import { Logger, LoggerFactory } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * 打刻します。
 */
export class PunchTask implements BaseTask {
  private readonly logger: Logger;

  constructor(
    private punchInfo: PunchInfo,
    private loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(PunchTask.name);
  }

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Trying to get the punchmark page token.");
    const token = await this.getPunchmarkPageToken(client);

    const timeClock = new TimeClock(this.loggerFactory);
    await timeClock.invoke(client, token, this.punchInfo);
  }

  private getPunchmarkPageToken(client: BugyoCloudClient): Promise<string> {
    return new PunchmarkPage(this.loggerFactory).invoke(client);
  }
}
