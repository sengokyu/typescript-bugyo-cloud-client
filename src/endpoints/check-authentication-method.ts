import * as qs from "querystring";
import { BugyoCloudClient } from "../bugyo-cloud-client";
import { AuthInfo } from "../models/auth-info";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

export class CheckAuthenticationMethod extends BaseEndpoint {
  /**
   * 'session'クッキーを読み込ませるために呼び出します。
   *
   * @param client
   * @param token
   * @param authInfo
   */
  public async invoke(
    client: BugyoCloudClient,
    token: string,
    authInfo: AuthInfo
  ): Promise<void> {
    const url = produceUrl("CheckAuthenticationMethod", client);
    const data = this.createData(authInfo);
    const headers = {
      __RequestVerificationToken: token,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    };

    this.logger.trace("Posting CheckAuthenticationMethod.");

    // エラーがあるとリダイレクトするので、リダイレクトさせない
    const resp = await client.session.post(url, data, {
      headers,
      redirect: "error",
    });

    const json = (await resp.json()) as any;

    if ("AuthenticationMethod" in json === false) {
      this.logger.error(
        "CheckAuthenticationMethod response does not contain AuthenticationMethod.",
        { response: json }
      );
      throw new Error(
        "CheckAuthenticationMethod response does not contain AuthenticationMethod."
      );
    }

    this.logger.trace("CheckAuthenticationMethod succeed.");
  }

  private createData(authInfo: AuthInfo) {
    return qs.stringify({
      OBCiD: authInfo.loginId,
      isBugyoCloud: "false",
    });
  }
}
