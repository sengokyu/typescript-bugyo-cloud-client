import { BugyoCloudClient, BugyoCloudClientError } from "../bugyo-cloud-client";
import { BASE_URL } from "../config";
import { extractUserCode } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

export class TopPage extends BaseEndpoint {
  /**
   * リダイレクト後のURLからUserCodeを返します。
   *
   * @param client
   * @param url
   */
  async invoke(client: BugyoCloudClient, url: string): Promise<string> {
    // Locationが相対なのでbaseURLを指定
    const resp = await client.session.getAndFollow(url, { baseURL: BASE_URL });

    if (!resp.config.url) {
      const msg = "Cannot determin toppage url.";
      this.logger.error(msg);
      throw new BugyoCloudClientError(msg);
    }

    this.logger.info("Toppage url is %s.", resp.config.url);

    return extractUserCode(resp.config.url);
  }
}
