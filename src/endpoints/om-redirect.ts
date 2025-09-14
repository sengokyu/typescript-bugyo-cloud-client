import { AxiosRequestConfig } from "axios";
import { BugyoCloudClient } from "../bugyo-cloud-client";
import { parseUserCode } from "../utils/page-parser";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

/**
 * リダイレクト先URLを取得します
 */
export class OmRedirect extends BaseEndpoint {
  /**
   * いったんワンタイムトークンを挟んでトップページに至ります。
   * userCode を返します。
   *
   * @param client
   */
  async invoke(client: BugyoCloudClient): Promise<string> {
    const url = produceUrl("OmRedirect", client);
    const referer = produceUrl("LoginPage", client);
    const config: AxiosRequestConfig = {
      headers: {
        Referer: referer.absoluteURL,
      },
    };

    this.logger.trace("Getting OmRedirect.");

    const resp = await client.session.getAndFollow(url, config);

    this.throwIfNgStatus(resp);

    return parseUserCode(resp.data);
  }
}
