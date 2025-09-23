import { BugyoCloudClient } from "../../bugyo-cloud-client";
import { EndpointName } from "../../config";
import { parseToken } from "../../utils/page-parser";
import { produceUrl } from "../../utils/url-utils";
import { BaseEndpoint } from "./base-endpoint";

/**
 * The page contains "__RequestVerificationToken"
 */
export abstract class TokenPage extends BaseEndpoint {
  protected abstract get EndpointName(): EndpointName;

  public async invoke(client: BugyoCloudClient): Promise<string> {
    const url = produceUrl(this.EndpointName, client);

    this.logger.debug("Getting %s.", this.EndpointName);

    const text = await client.session.getPage(url);

    this.logger.info("%s succeed.", this.EndpointName);

    return parseToken(text);
  }
}
