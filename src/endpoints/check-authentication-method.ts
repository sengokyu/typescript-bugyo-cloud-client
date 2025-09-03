import { AxiosRequestConfig } from "axios";
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
    const config = this.createConfig(token);

    this.logger.debug("Trying to POST, url=%s", url, data, config);

    const resp = await client.session.post(url, data, config);

    this.throwIfNgStatus(resp);

    this.logger.info("CheckAuthenticationMethod succeed.");
  }

  private createData(authInfo: AuthInfo) {
    return {
      OBCiD: authInfo.loginId,
      isBugyoCloud: "false",
    };
  }

  private createConfig(token: string): AxiosRequestConfig {
    // エラーがあるとリダイレクトするので、リダイレクトさせない
    return {
      headers: {
        __RequestVerificationToken: token,
        "X-Requested-With": "XMLHttpRequest",
      },
      maxRedirects: 0,
    };
  }
}
