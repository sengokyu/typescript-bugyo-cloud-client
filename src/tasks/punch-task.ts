import { BugyoCloudClient } from "../bugyo-cloud-client";
import { PunchmarkPage } from "../endpoints/punchmark-page";
import { PunchInfo } from "../models/punch-info";
import { LoggerFactory } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";
import { TimeClock } from "../endpoints/time-clock";

/**
 * 打刻します。
 */
export class PunchTask implements BaseTask {
  private readonly logger = LoggerFactory.getLogger(PunchTask.name);

  constructor(private punchInfo: PunchInfo) {}

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Trying to get the punchmark page token.");
    const token = await this.getPunchmarkPageToken(client);

    const timeClock = new TimeClock();
    await timeClock.invoke(client, token, this.punchInfo);
  }

  private getPunchmarkPageToken(client: BugyoCloudClient): Promise<string> {
    return new PunchmarkPage().invoke(client);
  }
}
