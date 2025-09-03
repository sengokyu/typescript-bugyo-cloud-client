import { AxiosRequestConfig } from "axios";
import qs from "querystring";
import { BugyoCloudClient } from "../bugyo-cloud-client";
import { AuthInfo } from "../models/auth-info";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

export class Authenticate extends BaseEndpoint {
  /**
   * 認証します
   *
   * @param client
   * @param token
   * @param authInfo
   */
  async invoke(
    client: BugyoCloudClient,
    token: string,
    authInfo: AuthInfo
  ): Promise<void> {
    const url = produceUrl("Authenticate", client);
    const data = this.createData(token, authInfo);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    this.logger.debug("Trying to POST, url=%s", url, data, config);

    const resp = await client.session.post(url, data, config);

    this.throwIfNgStatus(resp);

    this.logger.info("Authenticate succeed.");
  }

  private createData(token: string, authInfo: AuthInfo): string {
    return qs.stringify({
      btnLogin: null,
      OBCID: authInfo.loginId,
      Password_d1: null,
      Password_d2: null,
      Password_d3: null,
      Password: authInfo.password,
      __RequestVerificationToken: token,
      "X-Requested-With": "XMLHttpRequest",
    });
  }
}
