import { BugyoCloudClient } from "../bugyo-cloud-client";
import { parseUserCode } from "../utils/page-parser";
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
  async invoke(client: BugyoCloudClient, url: string): Promise<string> {
    this.logger.trace("Getting OmRedirect: %s.", url);

    const text = await client.session.getPage(url);

    return parseUserCode(text);
  }
}
