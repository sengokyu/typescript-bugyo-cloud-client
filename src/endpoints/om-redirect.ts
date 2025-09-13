import { AxiosRequestConfig } from "axios";
import { BugyoCloudClient, BugyoCloudClientError } from "../bugyo-cloud-client";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

/**
 * リダイレクト先URLを取得します
 */
export class OmRedirect extends BaseEndpoint {
  /**
   * いったんワンタイムトークンを挟んでトップページに至ります
   *
   * @param client
   */
  async invoke(client: BugyoCloudClient): Promise<string> {
    const url = produceUrl("OmRedirect", client);
    const referer = produceUrl("LoginPage", client);
    const config: AxiosRequestConfig = {
      headers: {
        Referer: referer,
      },
    };

    this.logger.debug("Trying to GET, url=%s", url);

    const resp = await client.session.getAndFollow(url, config);

    this.throwIfNgStatus(resp);

    if (!resp.config.url) {
      throw new BugyoCloudClientError("Cannot retrieve the top page URL.");
    }

    return resp.config.url!;
  }
}
