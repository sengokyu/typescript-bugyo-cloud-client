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

    this.logger.trace("Getting OmRedirect.");

    const text = await client.session.getPage(url);

    return parseUserCode(text);
  }
}
