import { AxiosRequestConfig, AxiosResponse } from "axios";
import { BugyoCloudClient, BugyoCloudClientError } from "../bugyo-cloud-client";
import { BASE_URL } from "../config";
import { extractUserCode } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

export class TopPage extends BaseEndpoint {
  private readonly requestConfig: AxiosRequestConfig = {
    maxRedirects: 0,
    // Locationが相対なので指定
    baseURL: BASE_URL,
    // 302のときに、エラーにならないようにする
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 302,
  };

  /**
   * リダイレクト後のURLからUserCodeを返します。
   *
   * @param client
   * @param url
   */
  async invoke(client: BugyoCloudClient, url: string): Promise<string> {
    const resp = await this.wrappedHttpGet(client, url);

    if (!resp.config.url) {
      const msg = "Cannot determin toppage url.";
      this.logger.error(msg);
      throw new BugyoCloudClientError(msg);
    }

    this.logger.info("Toppage url is %s.", resp.config.url);

    return extractUserCode(resp.config.url);
  }

  /**
   * リダイレクト中の set-cookie が動かない様子なので、
   * 自前でリダイレクトを追いかける
   * @param client
   * @param url
   */
  private async wrappedHttpGet(
    client: BugyoCloudClient,
    url: string
  ): Promise<AxiosResponse> {
    let nextUrl = url;
    let resp: AxiosResponse;

    do {
      this.logger.debug("Trying to GET, url=%s", nextUrl);

      resp = await client.session.get(nextUrl, this.requestConfig);
    } while (resp.status === 302 && (nextUrl = resp.headers["location"]));

    this.throwIfNgStatus(resp);

    return resp;
  }
}
