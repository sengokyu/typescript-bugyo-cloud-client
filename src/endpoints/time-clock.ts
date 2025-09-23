import * as qs from "querystring";
import { BugyoCloudClient } from "../bugyo-cloud-client";
import { PunchInfo } from "../models/punch-info";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";
/**
 * 打刻します。
 */
export class TimeClock extends BaseEndpoint {
  async invoke(
    client: BugyoCloudClient,
    token: string,
    punchInfo: PunchInfo
  ): Promise<void> {
    const url = produceUrl("TimeClock", client);
    const headers = this.createHeaders(token);
    const data = this.createData(punchInfo);

    this.logger.trace("Trying to call TimeClock.");

    await client.session.post(url, data, {
      headers,
    });

    this.logger.trace("TimeClock succeed.");
  }

  private createHeaders(token: string) {
    return {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      __RequestVerificationToken: token,
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  private createData(punchInfo: PunchInfo): string {
    return qs.stringify({
      ClockType: punchInfo.clockType,
      LaborSystemID: "0",
      LaborSystemCode: "",
      LaborSystemName: "",
      PositionLatitude: punchInfo.latitude ?? 0,
      PositionLongitude: punchInfo.longitude ?? 0,
      PositionAccuracy: "0",
    });
  }
}
