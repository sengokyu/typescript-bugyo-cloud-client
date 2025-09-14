import { BugyoCloudClient } from "../bugyo-cloud-client";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

/**
 * ログアウトします
 */
export class CallLogout extends BaseEndpoint {
  async invoke(client: BugyoCloudClient): Promise<void> {
    const url = produceUrl("CallLogout", client);

    this.logger.trace("Trying to logout");

    const resp = await client.session.get(url);

    this.throwIfNgStatus(resp);

    this.logger.trace("CallLogout succeed.");
  }
}
