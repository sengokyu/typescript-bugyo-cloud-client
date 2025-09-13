import { AxiosRequestConfig } from "axios";
import qs from "querystring";
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
    const config = this.createConfig(client, token);
    const data = this.createData(punchInfo);

    this.logger.debug("Trying to POST, url=%s", url, data, config);

    const resp = await client.session.post(url, data, config);

    this.throwIfNgStatus(resp);

    this.logger.info("TimeClock succeed.");
  }

  private createConfig(
    client: BugyoCloudClient,
    token: string
  ): AxiosRequestConfig {
    return {
      headers: this.createHeaders(client, token),
      maxRedirects: 0,
    };
  }

  private createHeaders(client: BugyoCloudClient, token: string): any {
    return {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: this.getRefererUrl(client),
      __RequestVerificationToken: token,
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  private getRefererUrl(client: BugyoCloudClient): string {
    return produceUrl("PunchmarkPage", client);
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
