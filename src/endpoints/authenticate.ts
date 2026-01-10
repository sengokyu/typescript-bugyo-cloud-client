import * as qs from "querystring";
import { BugyoCloudClient } from "../bugyo-cloud-client";
import { AuthInfo } from "../models/auth-info";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";
import { isAuthenticationResponse } from "../types";

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
  ): Promise<string> {
    const url = produceUrl("Authenticate", client);
    const data = this.createData(token, authInfo);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    };

    this.logger.trace("Posting Authenticate: %s.", url);

    const response = await client.session.post(url, data, {
      headers,
    });

    const result = await response.json();

    if (!isAuthenticationResponse(result)) {
      this.logger.error("Unexpected authentication response. %s", result);
      throw new Error("Unexpected authentication response.");
    }

    this.logger.trace("Authenticate succeed.");

    return result.RedirectURL;
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
