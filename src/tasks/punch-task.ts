import { BugyoCloudClient } from "../bugyo-cloud-client";
import { PunchmarkPage } from "../endpoints/punchmark-page";
import { TimeClock } from "../endpoints/time-clock";
import { PunchInfo } from "../models/punch-info";
import { Logger } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * 打刻します。
 */
export class PunchTask implements BaseTask {
  constructor(
    private readonly logger: Logger,
    private readonly timeClock: TimeClock,
    private readonly punchmarkPage: PunchmarkPage,
    private readonly punchInfo: PunchInfo
  ) {}

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Invoking PunchmarkPage.");
    const token = await this.punchmarkPage.invoke(client);
    this.logger.debug("Got token: %s", token);

    this.logger.trace("Invoking TimeClock.");
    await this.timeClock.invoke(client, token, this.punchInfo);
  }
}
